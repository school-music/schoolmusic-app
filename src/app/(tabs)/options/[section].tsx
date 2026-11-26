import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ComponentType } from 'react';
import { isAdmin, isStaff } from '@/domain';
import { access, isSection, sections, type Section } from '@/features/options/catalog';
import { Account, Information, PlaybackHistory, Rankings, Schedule, SectionLink, Styles } from '@/features/options/public';
import { Dashboard, SpotifyConnect, TrackCatalog } from '@/features/options/staff-admin';
import { Bans, ManageQueue, ManageUsers, ModerationLists, Player, Proposals } from '@/features/options/staff-operations';
import { BaseBreaks, Events, Exceptions, FallbackTracks, Templates, Weekly } from '@/features/options/staff-schedule';
import { useSession } from '@/session';
import { Copy, Empty, IconButton, Page } from '@/ui/components';

const moderation: Section[] = ['proposals', 'lists', 'bans', 'queue', 'player'];
const administration: Section[] = ['dashboard', 'weekly', 'templates', 'baseBreaks', 'exceptions', 'events', 'fallback', 'catalog', 'users', 'spotify'];

function Staff() {
  const { session } = useSession();
  return <>
    <Copy variant="track" accessibilityRole="header">Moderacja i odtwarzanie</Copy>
    {moderation.map((section) => <SectionLink key={section} section={section} />)}
    {isAdmin(session?.role) ? <>
      <Copy variant="track" accessibilityRole="header">Administracja</Copy>
      {administration.map((section) => <SectionLink key={section} section={section} />)}
    </> : null}
  </>;
}

const screens: Record<Section, ComponentType> = {
  account: Account, rankings: Rankings, styles: Styles, information: Information, schedule: Schedule, history: PlaybackHistory,
  staff: Staff, proposals: Proposals, lists: ModerationLists, bans: Bans, queue: ManageQueue, player: Player, dashboard: Dashboard,
  weekly: Weekly, templates: Templates, baseBreaks: BaseBreaks, exceptions: Exceptions, events: Events,
  fallback: FallbackTracks, catalog: TrackCatalog, users: ManageUsers, spotify: SpotifyConnect,
};

export default function OptionDetail() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const router = useRouter();
  const { session } = useSession();
  const leading = <IconButton label="Wstecz" name="arrow-left" onPress={() => {
    if (router.canGoBack()) router.back();
    else router.replace('/options');
  }} />;

  if (!isSection(section)) return <Page title="Opcje" leading={leading}><Empty title="Nie znaleziono tej opcji" /></Page>;

  const minimum = access(section);
  const allowed = minimum === 'admin' ? isAdmin(session?.role) : minimum === 'staff' ? isStaff(session?.role) : Boolean(session);
  const Content = screens[section];
  return <Page title={sections[section].title} leading={leading}>
    {allowed ? <Content key={section} /> : <Empty title="Brak dostępu" detail="Ta sekcja wymaga uprawnień radiowęzła." icon="shield-lock-outline" />}
  </Page>;
}
