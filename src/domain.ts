export function tokenExpiry(token: string): number | null {
  const part = token.split('.')[1];
  if (!part) return null;
  try {
    const payload: { exp?: unknown } = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && Number.isSafeInteger(payload.exp) ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export const isStaff = (role?: string) => role === 'mod' || role === 'admin' || role === 'head_admin';
export const isAdmin = (role?: string) => role === 'admin' || role === 'head_admin';

export const roleNames: Record<string, string> = {
  user: 'Uczeń', mod: 'Moderator', admin: 'Administrator', head_admin: 'Główny administrator',
};

export function duration(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}

export function progress(elapsedSeconds: number, durationMs: number) {
  if (durationMs <= 0) return 0;
  return Math.min(1, Math.max(0, elapsedSeconds * 1000 / durationMs));
}

const schoolDateFormat = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit',
});
export const schoolDate = (date = new Date()) => schoolDateFormat.format(date);

export function calendarMonth(date: string, offset = 0) {
  const start = new Date(date.slice(0, 7) + '-01T00:00:00Z');
  start.setUTCMonth(start.getUTCMonth() + offset);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1, 0);
  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
    firstWeekday: (start.getUTCDay() + 6) % 7,
    dayCount: end.getUTCDate(),
  };
}

type Break = {
  id: number; breakNumber: number; startAt: string; voteEnds: string | null; isMuted: boolean;
};

export function selectVotingBreak(breaks: Break[], enabledNumbers: number[], serverTime: string) {
  const timestamp = serverTime.slice(0, 19);
  return breaks
    .filter((entry) => !entry.isMuted && enabledNumbers.includes(entry.breakNumber)
      && timestamp < (entry.voteEnds ?? entry.startAt).slice(0, 19))
    .sort((first, second) => first.startAt.localeCompare(second.startAt))[0];
}

export function spotifyTrackUrl(id?: string | null) {
  return id && /^[0-9a-z]{22}$/i.test(id) ? 'https://open.spotify.com/track/' + id : null;
}

export function timeLabel(value?: string | null) {
  return value?.match(/(?:T|^)(\d\d:\d\d)/)?.[1] ?? '';
}

export function moveItem<T>(list: T[], index: number, offset: -1 | 1) {
  const target = index + offset;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) return list;
  const moved = [...list];
  const item = moved.splice(index, 1)[0] as T;
  moved.splice(target, 0, item);
  return moved;
}
