import assert from 'node:assert/strict';
import test from 'node:test';
import { calendarMonth, duration, isAdmin, isStaff, moveItem, progress, schoolDate, selectVotingBreak, spotifyTrackUrl, tokenExpiry } from '../src/domain';

test('uses only real future voting breaks with music enabled', () => {
  const now = '2026-11-25T08:00:00';
  const candidates = [
    { id: 5, breakNumber: 5, startAt: '2026-11-25T11:00:00', voteEnds: null, isMuted: false },
    { id: 1, breakNumber: 1, startAt: '2026-11-25T07:45:00', voteEnds: null, isMuted: false },
    { id: 2, breakNumber: 2, startAt: '2026-11-25T08:30:00', voteEnds: now, isMuted: false },
    { id: 3, breakNumber: 3, startAt: '2026-11-25T09:00:00', voteEnds: null, isMuted: true },
    { id: 4, breakNumber: 4, startAt: '2026-11-25T10:00:00', voteEnds: null, isMuted: false },
  ];
  assert.equal(selectVotingBreak(candidates, [1, 2, 3, 4, 5], now)?.id, 4);
  assert.equal(selectVotingBreak(candidates, [1, 2, 3], now), undefined);
  assert.deepEqual(candidates.map(({ id }) => id), [5, 1, 2, 3, 4]);
});

test('uses the school time zone for dates', () => {
  assert.equal(schoolDate(new Date('2026-11-25T23:30:00Z')), '2026-11-26');
});

test('builds Monday-first calendar months across leap days and year boundaries', () => {
  assert.deepEqual(calendarMonth('2024-02-29'), {
    from: '2024-02-01', to: '2024-02-29', firstWeekday: 3, dayCount: 29,
  });
  assert.deepEqual(calendarMonth('2026-12-31', 1), {
    from: '2027-01-01', to: '2027-01-31', firstWeekday: 4, dayCount: 31,
  });
});

test('bounds playback progress and formats track lengths', () => {
  assert.equal(progress(30, 60000), 0.5);
  assert.equal(progress(61, 60000), 1);
  assert.equal(progress(-1, 60000), 0);
  assert.equal(progress(1, 0), 0);
  assert.equal(duration(420000), '7:00');
});

test('validates Spotify track IDs', () => {
  assert.equal(spotifyTrackUrl('4CeeEOM32jQcH3eN9Q2dGj'), 'https://open.spotify.com/track/4CeeEOM32jQcH3eN9Q2dGj');
  assert.equal(spotifyTrackUrl('https://example.com'), null);
  assert.equal(spotifyTrackUrl(null), null);
});

test('reads an expiry and rejects malformed JWTs', () => {
  const token = 'header.' + Buffer.from(JSON.stringify({ exp: 2_000_000_000 })).toString('base64url') + '.signature';
  assert.equal(tokenExpiry(token), 2_000_000_000_000);
  assert.equal(tokenExpiry('bad'), null);
  assert.equal(tokenExpiry('header.ew.signature'), null);
});

test('matches moderator and admin scopes without implicit privilege', () => {
  assert.equal(isStaff('user'), false);
  assert.equal(isStaff('mod'), true);
  assert.equal(isAdmin('mod'), false);
  assert.equal(isAdmin('admin'), true);
  assert.equal(isAdmin('head_admin'), true);
  assert.equal(isStaff(undefined), false);
});

test('moves an item without mutating its source', () => {
  const items = [7, 8, 9];
  assert.deepEqual(moveItem(items, 1, -1), [8, 7, 9]);
  assert.deepEqual(moveItem(items, 2, 1), items);
  assert.deepEqual(items, [7, 8, 9]);
});
