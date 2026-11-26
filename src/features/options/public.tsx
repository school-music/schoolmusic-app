import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { errorText } from '@/api/client';
import * as sdk from '@/api/generated/sdk.gen';
import { request } from '@/api/options';
import { useApiMutation, useApiQuery } from '@/api/query';
import { calendarMonth, roleNames, schoolDate, timeLabel } from '@/domain';
import { useSession } from '@/session';
import { Action, Copy, Empty, Failure, Fade, Feedback, Icon, IconButton, Placeholder, Row, confirm, ui } from '@/ui/components';
import { useTheme } from '@/ui/theme';
import { TrackRow } from '../tracks';
import { type Section, sections } from './catalog';

export function SectionLink({ section }: { section: Section }) {
  const router = useRouter();
  return <Row title={sections[section].title} icon={sections[section].icon}
    onPress={() => router.push({ pathname: '/options/[section]', params: { section } })} />;
}

export function Account() {
  const { session, signOut } = useSession();
  const [localError, setError] = useState('');
  const remove = useApiMutation((client) => sdk.deleteAccount(request(client)), []);

  function logout() {
    void signOut().catch((error) => setError(errorText(error)));
  }

  if (!session) return null;
  return <>
    <Row title={session.displayName || session.username} detail={roleNames[session.role] ?? 'Użytkownik'} icon="account-circle-outline" />
    <Row title="Login" detail={session.username} />
    <Row title="Typ konta" detail={session.isLdap ? 'Konto szkolne' : 'Konto lokalne'} />
    <Action label="Wyloguj się" kind="secondary" icon="logout" onPress={logout} />
    <Action label="Usuń konto" kind="danger" busy={remove.isPending}
      onPress={() => confirm('Usunąć konto SchoolMusic?', 'Usunięcie konta może trwale usunąć jego dane z radiowęzła.',
        () => remove.mutate(undefined, { onSuccess: logout }), 'Usuń konto')} />
    {remove.error || localError ? <Feedback error text={localError || errorText(remove.error)} /> : null}
  </>;
}

const periods = [
  { value: 'day', label: 'Dzisiaj' },
  { value: 'week', label: 'Tydzień' },
  { value: 'month', label: 'Miesiąc' },
  { value: 'year', label: 'Rok' },
  { value: 'all-time', label: 'Wszystkie' },
] as const;

export function Rankings() {
  const [period, setPeriod] = useState<typeof periods[number]['value']>('week');
  const [tab, setTab] = useState<'tracks' | 'artists'>('tracks');
  const songs = useApiQuery(['rankings', 'songs', period], (client, signal) => sdk.songsRanking({
    ...request(client, signal), query: { period, limit: 10 },
  }), { enabled: tab === 'tracks' });
  const artists = useApiQuery(['rankings', 'artists', period], (client, signal) => sdk.artistsRanking({
    ...request(client, signal), query: { period, limit: 10 },
  }), { enabled: tab === 'artists' });
  const query = tab === 'tracks' ? songs : artists;
  const hasRows = tab === 'tracks' ? Boolean(songs.data?.songs.length) : Boolean(artists.data?.artists.length);

  return <>
    <View style={ui.inline}>
      <Action label="Utwory" kind={tab === 'tracks' ? 'primary' : 'secondary'} onPress={() => setTab('tracks')} />
      <Action label="Wykonawcy" kind={tab === 'artists' ? 'primary' : 'secondary'} onPress={() => setTab('artists')} />
    </View>
    <View style={ui.inline}>{periods.map((item) => <Action key={item.value} label={item.label}
      kind={item.value === period ? 'primary' : 'secondary'} onPress={() => setPeriod(item.value)} />)}</View>
    {query.isPending ? <Placeholder /> : query.error && !query.data
      ? <Failure message={errorText(query.error)} retry={() => { void query.refetch(); }} />
      : !hasRows ? <Empty title="Ranking jest pusty" detail="Wyniki pojawią się po pierwszych odtworzeniach." /> : <Fade>
        {tab === 'tracks' ? songs.data?.songs.map((item) => <Row key={item.songId} title={item.position + '. ' + item.title}
          detail={item.artistName + ' · Odtworzenia: ' + item.playsCount} />)
          : artists.data?.artists.map((item) => <Row key={item.artistId} title={item.position + '. ' + item.artistName}
            detail={'Odtworzenia: ' + item.playsCount} />)}
      </Fade>}
    <SectionLink section="history" />
  </>;
}

export function PlaybackHistory() {
  const [limit, setLimit] = useState(20);
  const result = useApiQuery(['history', limit], (client, signal) => sdk.playbackHistory({
    ...request(client, signal), query: { limit, offset: 0 },
  }));
  if (result.isPending) return <Placeholder />;
  if (!result.data) return <Failure message={errorText(result.error)} retry={() => { void result.refetch(); }} />;
  if (!result.data.history.length) return <Empty title="Brak odtworzeń" detail="Historia pojawi się, gdy radio zagra utwory." />;

  return <>
    {result.data.history.map((item) => <View key={item.historyId} style={styles.historyRow}>
      <Copy variant="detail" tone="muted">{item.playedAt.slice(0, 10)} · {timeLabel(item.playedAt)}</Copy>
      <TrackRow {...item} artist={item.artistName} />
    </View>)}
    {result.data.history.length === limit && limit < 100
      ? <Action label="Pokaż więcej" kind="secondary" onPress={() => setLimit(limit + 20)} /> : null}
  </>;
}

export function Styles() {
  const { highContrast, setHighContrast, colors } = useTheme();
  const [error, setError] = useState('');
  return <>
    <Row title="Tryb wysokiego kontrastu" detail="Rozjaśnia tekst i elementy sterujące."
      right={<Switch accessibilityLabel="Tryb wysokiego kontrastu" value={highContrast}
        trackColor={{ true: colors.accent }} onValueChange={(value) => {
          void setHighContrast(value).then(() => setError(''), (reason) => setError(errorText(reason)));
        }} />} />
    {error ? <Feedback error text={error} /> : null}
  </>;
}

export function Information() {
  return <>
    <SectionLink section="schedule" />
    <Row title="SchoolMusic" detail="Wersja 1.0.0" icon="radio-tower" />
  </>;
}

const dayNames = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
const monthFormat = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const dayFormat = new Intl.DateTimeFormat('pl-PL', { dateStyle: 'full', timeZone: 'UTC' });
const calendarDate = (day: string) => new Date(day + 'T00:00:00Z');

export function Schedule() {
  const [today] = useState(() => schoolDate());
  const [selected, setSelected] = useState(today);
  const { colors } = useTheme();
  const { from, to, firstWeekday, dayCount } = calendarMonth(selected);
  const calendar = useApiQuery(['schedule', from, to], (client, signal) => sdk.calendar({
    ...request(client, signal), query: { from, to },
  }));
  const days = new Map(calendar.data?.days.map((day) => [day.date, day]));
  const selectedDay = days.get(selected);
  const weeks = Array.from({ length: Math.ceil((firstWeekday + dayCount) / 7) }, (_, week) =>
    Array.from({ length: 7 }, (_, column) => week * 7 + column - firstWeekday + 1));

  function changeMonth(offset: number) {
    const next = calendarMonth(selected, offset);
    setSelected(today >= next.from && today <= next.to ? today : next.from);
  }

  return <>
    <View style={[styles.calendar, { borderColor: colors.line }]}>
      <View style={styles.calendarHeader}>
        <IconButton name="chevron-left" label="Poprzedni miesiąc" onPress={() => changeMonth(-1)} />
        <Copy variant="track" accessibilityRole="header" style={styles.monthLabel}>{monthFormat.format(calendarDate(from))}</Copy>
        <IconButton name="chevron-right" label="Następny miesiąc" onPress={() => changeMonth(1)} />
      </View>
      <View style={styles.week}>
        {dayNames.map((name) => <Copy key={name} variant="detail" tone="muted" style={styles.weekday}>{name}</Copy>)}
      </View>
      {weeks.map((week) => <View key={week[0]} style={styles.week}>
        {week.map((number) => {
          if (number < 1 || number > dayCount) return <View key={number} style={styles.cell} />;
          const date = from.slice(0, 8) + String(number).padStart(2, '0');
          const day = days.get(date);
          const active = selected === date;
          const hasMusic = day?.isSchoolDay && day.isMusicEnabled;
          return <Pressable key={number} style={styles.cell} accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={dayFormat.format(calendarDate(date)) + (day ? ', ' + day.statusDescription : '')}
            onPress={() => setSelected(date)}>
            <View style={[styles.day, {
              backgroundColor: active ? colors.text : 'transparent',
              borderColor: date === today && !active ? colors.muted : 'transparent',
            }]}>
              <Copy variant="small" tone={active ? 'background' : day?.isSchoolDay === false ? 'muted' : 'text'}>{number}</Copy>
              {hasMusic ? <View style={[styles.dot, { backgroundColor: active ? colors.background : colors.muted }]} /> : null}
            </View>
          </Pressable>;
        })}
      </View>)}
    </View>
    {calendar.isPending ? <Placeholder count={2} />
      : !calendar.data ? <Failure message={errorText(calendar.error)} retry={() => { void calendar.refetch(); }} />
      : selectedDay ? <View>
        <Row title={dayFormat.format(calendarDate(selected))} detail={selectedDay.statusDescription} icon="calendar-outline" />
        {selectedDay.isSchoolDay ? selectedDay.breaks.map((entry) => <Row key={entry.breakNumber}
          title={'Przerwa ' + entry.breakNumber}
          detail={timeLabel(entry.startAt) + '–' + timeLabel(entry.endsAt) + (entry.isMusicEnabled ? ' · Muzyka' : ' · Bez muzyki')}
          right={<Icon name={entry.isMusicEnabled ? 'music-note' : 'volume-off'} />} />) : null}
      </View> : <Empty title="Brak harmonogramu na ten dzień" />}
  </>;
}

const styles = StyleSheet.create({
  historyRow: { gap: 4 },
  calendar: { padding: 8, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  monthLabel: { flex: 1, textAlign: 'center', textTransform: 'capitalize' },
  week: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center', paddingVertical: 5 },
  cell: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  day: { alignItems: 'center', justifyContent: 'center', minWidth: 32, minHeight: 34, borderRadius: 10, borderWidth: 1 },
  dot: { position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: 2 },
});
