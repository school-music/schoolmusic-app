import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';

const baseUrl = 'http://127.0.0.1:8082';
const suffix = randomBytes(4).toString('hex');
const login = 'mobile_qa_' + suffix;
const password = 'QA!' + randomBytes(12).toString('hex');
const adminPassword = process.env.SCHOOLMUSIC_QA_ADMIN_PASSWORD;
if (!adminPassword) throw new Error('Set SCHOOLMUSIC_QA_ADMIN_PASSWORD to the isolated demo account password.');

async function api(path, { method = 'GET', token, body, expected = 200 } = {}) {
  const response = await fetch(baseUrl + path, {
    method,
    headers: {
      ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const statuses = Array.isArray(expected) ? expected : [expected];
  assert.ok(statuses.includes(response.status), method + ' ' + path + ' returned ' + response.status);
  if (response.status === 204 || response.headers.get('content-length') === '0') return null;
  return response.json();
}

const loginAs = (name, password) => api('/api/auth/login', { method: 'POST', body: { name, password } });
const admin = (await loginAs('admin', adminPassword)).jwtSecurityToken;
await api('/api/auth/register', { method: 'POST', body: { name: login, password }, expected: 201 });
const student = await loginAs(login, password);
const token = student.jwtSecurityToken;
assert.equal(student.role, 'user');
const ldap = await loginAs('jan.kowalski', 'SzkolaPassword123!');
assert.equal(ldap.isLdap, true);
await api('/api/statistics/dashboard', { token, expected: 403 });
await api('/api/moderation/pending', { token, expected: 403 });
await api('/api/system/status');
await api('/openapi/v1.json');
console.log('PASS authentication, LDAP, status, OpenAPI, staff authorization');

const title = 'Mobile QA ' + suffix;
const track = await api('/api/admin/tracks', { method: 'POST', token: admin, expected: 201, body: {
  title, artistName: 'Mobile QA Artist ' + suffix, durationMs: 9000, genre: 'QA', source: 'other',
} });
const trackId = track.id;
const { items } = await api('/api/tracks?search=' + encodeURIComponent(title), { token });
assert.equal(items[0]?.id, trackId);
const { przerwy } = await api('/api/breaks');
const breakId = przerwy[0].id;
const proposed = await api('/api/queue/propose', { method: 'POST', token, body: { songId: trackId, breakId }, expected: 202 });
assert.equal(proposed.status, 'pending');
const { proposals } = await api('/api/moderation/pending', { token: admin });
const proposal = proposals.find((item) => item.songId === trackId);
assert.ok(proposal);
await api('/api/moderation/approve/' + proposal.id, { method: 'POST', token: admin });
const readQueue = () => api('/api/queue/break/' + breakId, { token });
let queueItem = (await readQueue()).queue.find((item) => item.songId === trackId);
assert.ok(queueItem);
const queueId = queueItem.queueItemId;
if (queueItem.hasVoted) await api('/api/queue/vote/' + queueId, { method: 'DELETE', token });
await api('/api/queue/vote', { method: 'POST', token, body: { queueItemId: queueId } });
queueItem = (await readQueue()).queue.find((item) => item.queueItemId === queueId);
assert.equal(queueItem.hasVoted, true);
await api('/api/queue/vote/' + queueId, { method: 'DELETE', token });
assert.equal((await readQueue()).queue.find((item) => item.queueItemId === queueId).hasVoted, false);
await api('/api/tracks/' + trackId + '/favourites', { method: 'POST', token });
assert.ok((await api('/api/tracks/favourites', { token })).tracks.some((item) => item.id === trackId));
await api('/api/tracks/favourites/' + trackId, { method: 'DELETE', token });
assert.ok(!(await api('/api/tracks/favourites', { token })).tracks.some((item) => item.id === trackId));
await api('/api/tracks/search?q=schoolmusic', { expected: [200, 503] });
console.log('PASS local search, proposal, approval, voting and undo, favorites, Spotify search state');

await api('/api/queue/break/' + breakId + '/order', { method: 'PUT', token: admin, body: {
  queueItemIds: (await readQueue()).queue.map((item) => item.queueItemId).reverse(),
} });
await api('/api/queue/break/' + breakId + '/archive', { method: 'POST', token: admin });
await api('/api/moderation/blacklist', { method: 'POST', token: admin, body: { songId: trackId } });
const blacklist = await api('/api/moderation/blacklist?search=' + encodeURIComponent(title), { token: admin });
assert.equal(blacklist.items[0]?.songId, trackId);
await api('/api/moderation/blacklist/' + blacklist.items[0].id, { method: 'DELETE', token: admin });
await api('/api/moderation/blacklist/artist/' + track.artistId, { method: 'POST', token: admin });
await api('/api/moderation/blacklist/artist/' + track.artistId, { method: 'DELETE', token: admin });
await api('/api/moderation/greenlist', { method: 'POST', token: admin, body: { songId: trackId } });
await api('/api/moderation/greenlist/' + trackId, { method: 'DELETE', token: admin });
await api('/api/moderation/ban/' + student.userId, { method: 'POST', token: admin });
const ban = (await api('/api/moderation/banned', { token: admin })).bannedUsers.find((item) => item.userId === student.userId);
assert.ok(ban);
await api('/api/moderation/unaban/' + ban.id, { method: 'POST', token: admin });
await api('/api/users/' + student.userId + '/role', { method: 'PUT', token: admin, body: { rankId: 2 } });
assert.equal((await loginAs(login, password)).role, 'mod');
await api('/api/users/' + student.userId + '/role', { method: 'PUT', token: admin, body: { rankId: 1 } });
await api('/api/statistics/dashboard', { token: admin });
console.log('PASS reorder, archive, moderation lists, bans, role changes, admin statistics');

const weekly = await api('/api/schedule/weekly');
const day = weekly[0];
await api('/api/schedule/weekly/' + day.weekday, { method: 'PUT', token: admin, body: { musicEnabled: day.musicEnabled } });
const dayBreaks = await api('/api/schedule/weekly/' + day.weekday + '/breaks');
const first = dayBreaks.breaks[0];
await api('/api/schedule/weekly/' + day.weekday + '/breaks/' + first.breakNumber, {
  method: 'PUT', token: admin, body: { musicEnabled: first.musicEnabled },
});
const templates = await api('/api/breaks/templates', { token: admin });
const template = await api('/api/breaks/templates', { method: 'POST', token: admin, expected: 201, body: {
  breakNumber: Math.max(0, ...templates.map((item) => item.breakNumber)) + 1, startsTime: '18:50:00', endsTime: '18:55:00',
} });
await api('/api/breaks/templates/' + template.id, { method: 'PUT', token: admin, expected: [200, 204], body: {
  breakNumber: template.breakNumber, startsTime: '18:51:00', endsTime: '18:56:00',
} });
await api('/api/breaks/templates/' + template.id, { method: 'DELETE', token: admin, expected: 204 });
const startsAt = '2099-12-17T12:00:00';
const event = await api('/api/admin/special-events', { method: 'POST', token: admin, expected: 201, body: {
  title, fileUrl: 'https://example.com/fixture.wav', startsAt, eventStatus: 'pending',
} });
await api('/api/admin/special-events/' + event.id, { method: 'PUT', token: admin, body: {
  title: title + ' edited', fileUrl: 'https://example.com/fixture.wav', startsAt, eventStatus: 'done',
} });
await api('/api/admin/special-events/' + event.id, { method: 'DELETE', token: admin });
const dayException = await api('/api/breaks/exceptions', { method: 'POST', token: admin, expected: [200, 201], body: {
  startDate: '2099-12-17', endDate: '2099-12-17', dayType: 'no_music', description: title,
} });
const exception = (await api('/api/breaks/exceptions', { token: admin })).exceptions.find((item) => item.description === title);
assert.ok(exception || dayException);
if (exception) await api('/api/breaks/exceptions/' + exception.id, { method: 'DELETE', token: admin, expected: [200, 204] });
const exceptionOptions = { breakDate: '2099-12-17', breakNumber: 1, musicEnabled: false, description: title };
await api('/api/breaks/exception-breaks', { method: 'POST', token: admin, expected: [200, 201], body: exceptionOptions });
const breakException = (await api('/api/breaks/exception-breaks', { token: admin })).exceptionBreaks.find((item) => item.description === title);
assert.ok(breakException);
await api('/api/breaks/exception-breaks/' + breakException.id, { method: 'DELETE', token: admin, expected: [200, 204] });
const fallback = await api('/api/admin/default-songs', { method: 'POST', token: admin, expected: 201, body: { songId: trackId } });
await api('/api/admin/default-songs/' + fallback.id, { method: 'DELETE', token: admin });
await api('/api/admin/tracks/' + trackId, { method: 'PUT', token: admin, body: { title: title + ' edited' } });
await api('/api/admin/tracks/' + trackId, { method: 'DELETE', token: admin });
await api('/api/admin/tracks/' + trackId + '/restore', { method: 'POST', token: admin });
await api('/api/admin/tracks/' + trackId + '?hardDelete=true', { method: 'DELETE', token: admin });
await api('/api/spotify-playback/status', { token: admin });
await api('/api/player/status', { token: admin, expected: [200, 503] });
console.log('PASS schedule, templates, exceptions, events, fallback songs, catalog lifecycle, player and Spotify status');
