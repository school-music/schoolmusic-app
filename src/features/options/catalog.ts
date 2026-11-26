import type { IconName } from '@/ui/components';

export const sections = {
  account: { title: 'Konto', icon: 'account-circle-outline' },
  rankings: { title: 'Statystyki', icon: 'chart-bar' },
  styles: { title: 'Style', icon: 'palette-outline' },
  information: { title: 'Informacje', icon: 'information-outline' },
  schedule: { title: 'Harmonogram radia', icon: 'calendar-outline' },
  history: { title: 'Historia odtworzeń', icon: 'history' },
  staff: { title: 'Panel radiowęzła', icon: 'shield-account-outline', minimum: 'staff' },
  proposals: { title: 'Propozycje utworów', icon: 'playlist-check', minimum: 'staff' },
  lists: { title: 'Listy moderacji', icon: 'shield-check-outline', minimum: 'staff' },
  bans: { title: 'Blokady kont', icon: 'account-cancel-outline', minimum: 'staff' },
  queue: { title: 'Zarządzanie kolejką', icon: 'playlist-edit', minimum: 'staff' },
  player: { title: 'Sterowanie radiem', icon: 'radio-tower', minimum: 'staff' },
  dashboard: { title: 'Statystyki administratora', icon: 'chart-box-outline', minimum: 'admin' },
  weekly: { title: 'Ustawienia tygodniowe', icon: 'calendar-week', minimum: 'admin' },
  templates: { title: 'Szablony dzwonków', icon: 'bell-outline', minimum: 'admin' },
  baseBreaks: { title: 'Bazowe godziny przerw', icon: 'clock-outline', minimum: 'admin' },
  exceptions: { title: 'Wyjątki w harmonogramie', icon: 'calendar-remove-outline', minimum: 'admin' },
  events: { title: 'Wydarzenia dźwiękowe', icon: 'calendar-star', minimum: 'admin' },
  fallback: { title: 'Utwory domyślne', icon: 'playlist-music-outline', minimum: 'admin' },
  catalog: { title: 'Katalog utworów', icon: 'music-box-multiple-outline', minimum: 'admin' },
  users: { title: 'Użytkownicy', icon: 'account-multiple-outline', minimum: 'admin' },
  spotify: { title: 'Spotify Connect', icon: 'spotify', minimum: 'admin' },
} satisfies Record<string, { title: string; icon: IconName; minimum?: 'staff' | 'admin' }>;

export type Section = keyof typeof sections;

export function isSection(value: string | undefined): value is Section {
  return value != null && Object.hasOwn(sections, value);
}

export function access(section: Section) {
  const entry = sections[section];
  return 'minimum' in entry ? entry.minimum : undefined;
}
