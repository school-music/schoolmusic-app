import { fetch as expoFetch } from 'expo/fetch';
import { openBrowserAsync } from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { MobileAdminTrack } from '@/api/generated';
import * as sdk from '@/api/generated/sdk.gen';
import { request } from '@/api/options';
import { useApiQuery, usePages } from '@/api/query';
import { duration, timeLabel } from '@/domain';
import { Action, Copy, Empty, Field, Row, confirm, ui } from '@/ui/components';
import { useDebounce } from '@/ui/use-debounce';
import { useForeground } from '../radio-data';
import { Collection, Load, More, Remove, Result, isWebUrl, useTask } from './shared';

const catalogKeys = [['admin-catalog'], ['admin-track'], ['tracks'], ['catalog'], ['track'], ['favorites'], ['fallback']];

function TrackForm({ entry, onClose }: { entry?: MobileAdminTrack; onClose: () => void }) {
  const [title, setTitle] = useState(entry?.title ?? '');
  const [artist, setArtist] = useState(entry?.artistName ?? '');
  const [length, setLength] = useState(entry ? String(entry.durationMs / 1000) : '');
  const [genre, setGenre] = useState(entry?.genre ?? '');
  const [url, setUrl] = useState(entry?.songUrl ?? '');
  const [cover, setCover] = useState(entry?.cover ?? '');
  const [source, setSource] = useState(entry?.source ?? 'other');
  const [spotifyId, setSpotifyId] = useState(entry?.spotifyId ?? '');
  const task = useTask(catalogKeys);
  const durationMs = Math.round(Number(length.replace(',', '.')) * 1000);
  const valid = Boolean(title.trim() && artist.trim()) && Number.isSafeInteger(durationMs)
    && durationMs > 0 && durationMs <= 2_147_483_647 && (!url.trim() || isWebUrl(url.trim()))
    && (!cover.trim() || isWebUrl(cover.trim())) && (!spotifyId.trim() || /^[0-9a-z]{22}$/i.test(spotifyId.trim()));

  return <View style={ui.gap}>
    <Copy variant="track">{entry ? 'Edytuj utwór' : 'Nowy utwór'}</Copy>
    <Field placeholder="Tytuł" value={title} onChangeText={setTitle} />
    <Field placeholder="Wykonawca" value={artist} onChangeText={setArtist} />
    <Field placeholder="Czas trwania (sekundy)" value={length} onChangeText={setLength} keyboardType="decimal-pad" />
    <Field placeholder="Gatunek" value={genre} onChangeText={setGenre} />
    <Field placeholder="Adres URL utworu" value={url} onChangeText={setUrl} keyboardType="url" autoCapitalize="none" />
    <Field placeholder="Adres URL okładki" value={cover} onChangeText={setCover} keyboardType="url" autoCapitalize="none" />
    <Field placeholder="Źródło" value={source} onChangeText={setSource} autoCapitalize="none" />
    <Field placeholder="Identyfikator Spotify" value={spotifyId} onChangeText={setSpotifyId} autoCapitalize="none" />
    <Result task={task} />
    <View style={ui.inline}>
      <Action label="Zapisz utwór" disabled={!valid} busy={task.isPending} onPress={() => {
        const body = { title: title.trim(), artistName: artist.trim(), durationMs,
          genre: genre.trim(), songUrl: url.trim(), cover: cover.trim(), source: source.trim(), spotifyId: spotifyId.trim() };
        task.mutate((client) => entry ? sdk.updateTrack({ ...request(client), path: { id: entry.id }, body: { ...body, isActive: null } })
          : sdk.createTrack({ ...request(client), body }), { onSuccess: onClose });
      }} />
      <Action label="Anuluj" kind="text" disabled={task.isPending} onPress={onClose} />
    </View>
  </View>;
}

export function TrackCatalog() {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [form, setForm] = useState<{ id?: number }>();
  const search = useDebounce(input.trim());
  const query = usePages(['admin-catalog', search, filter], (client, signal, page) => sdk.adminTracks({
    ...request(client, signal), query: { search, page, pageSize: 20,
      isActive: filter === 'all' ? undefined : filter === 'active', sortBy: 'title' },
  }));
  const entry = useApiQuery(['admin-track', form?.id], (client, signal) => sdk.adminTrack({
    ...request(client, signal), path: { id: form?.id ?? 0 },
  }), { enabled: form?.id != null });
  const task = useTask(catalogKeys);
  const filters = [{ id: 'all', label: 'Wszystkie' }, { id: 'active', label: 'Aktywne' },
    { id: 'inactive', label: 'Nieaktywne' }] as const;

  return <>
    {form ? form.id ? <Load query={entry}>{(item) => <TrackForm key={item.id} entry={item} onClose={() => setForm(undefined)} />}</Load>
      : <TrackForm onClose={() => setForm(undefined)} />
      : <Action label="Dodaj utwór" kind="secondary" onPress={() => setForm({})} />}
    <Field icon="magnify" placeholder="Szukaj w katalogu" value={input} onChangeText={setInput} />
    <View style={ui.inline}>{filters.map((item) => <Action key={item.id} label={item.label}
      kind={item.id === filter ? 'primary' : 'secondary'} onPress={() => setFilter(item.id)} />)}</View>
    <Result task={task} />
    <Load query={query}>{(data) => <>
      <Collection items={data.pages.flatMap((page) => page.items)} itemKey={(item) => item.id}
        empty="Brak pasujących utworów" render={(item) => <>
          <Row title={item.title} detail={item.artistName + ' · ' + duration(item.durationMs) + (item.isActive ? '' : ' · Nieaktywny')} />
          <View style={ui.inline}>
            <Action label="Edytuj" kind="secondary" onPress={() => setForm({ id: item.id })} />
            {item.isActive ? <Remove label="Dezaktywuj" detail={item.title} disabled={task.isPending}
              action={() => task.mutate((client) => sdk.deleteTrack({ ...request(client), path: { id: item.id } }))} />
              : <Action label="Przywróć" kind="secondary" disabled={task.isPending}
                onPress={() => task.mutate((client) => sdk.restoreTrack({ ...request(client), path: { id: item.id } }))} />}
            <Remove label="Usuń trwale" detail={item.title + '. Utwory powiązane z kolejką lub historią mogą zostać dezaktywowane.'}
              disabled={task.isPending} action={() => task.mutate((client) => sdk.deleteTrack({
                ...request(client), path: { id: item.id }, query: { hardDelete: true },
              }))} />
          </View>
        </>} />
      <More query={query} />
    </>}</Load>
  </>;
}

export function Dashboard() {
  const dashboard = useApiQuery(['dashboard'], (client, signal) => sdk.dashboard(request(client, signal)),
    { staleTime: 60_000 });
  return <Load query={dashboard}>{(data) => data.isAvailable ? <>
    <Row title="Głosy dzisiaj" detail={String(data.votes.today)} icon="poll" />
    <Row title="Głosy w tym tygodniu" detail={String(data.votes.thisWeek)} />
    <Row title="Łącznie oddane głosy" detail={String(data.votes.total)} />
    <Copy variant="track" accessibilityRole="header">Aktywność z ostatnich 7 dni</Copy>
    {data.dailyActivity.map((item) => <Row key={item.date} title={item.date}
      detail={item.votesCount + ' głosów · ' + item.playsCount + ' odtworzeń'} />)}
    <Copy variant="track" accessibilityRole="header">Popularne gatunki</Copy>
    {data.genres.length ? data.genres.map((item) => <Row key={item.genre} title={item.genre}
      detail={item.playsCount + ' odtworzeń · ' + item.sharePercent.toLocaleString('pl') + '%'} />)
      : <Copy tone="muted">Brak danych o gatunkach.</Copy>}
    <Copy variant="track" accessibilityRole="header">Najczęściej odtwarzane utwory</Copy>
    {data.topSongs.length ? data.topSongs.map((item) => <Row key={item.songId}
      title={item.position + '. ' + item.title} detail={item.artistName + ' · ' + item.playsCount + ' odtworzeń'} />)
      : <Copy tone="muted">Brak odtworzeń.</Copy>}
    <Copy variant="track" accessibilityRole="header">Najczęściej odtwarzani wykonawcy</Copy>
    {data.topArtists.length ? data.topArtists.map((item) => <Row key={item.artistId}
      title={item.position + '. ' + item.artistName} detail={item.playsCount + ' odtworzeń'} />)
      : <Copy tone="muted">Brak odtworzeń.</Copy>}
    <Copy variant="detail" tone="muted">Aktualizacja: {timeLabel(data.generatedAt)}</Copy>
  </> : <Empty title="Statystyki są chwilowo niedostępne" />}</Load>;
}

export function SpotifyConnect() {
  const status = useApiQuery(['spotify-connect'], (client, signal) => sdk.spotifyStatus(request(client, signal)));
  const task = useTask([['spotify-connect'], ['player']]);
  const active = useForeground();
  const { refetch } = status;
  useEffect(() => { if (active) void refetch(); }, [active, refetch]);

  function authorize() {
    task.mutate(async (client) => {
      let location: string | null = null;
      await sdk.spotifyConnect({
        ...request(client),
        fetch: (async (input: RequestInfo | URL, init?: RequestInit) => {
          const response = await expoFetch(input, { ...init, redirect: 'manual' });
          if (response.status === 302) {
            location = response.headers.get('location');
            return new Response(null, { status: 204 });
          }
          return response;
        }) as typeof fetch,
      });
      if (!location) throw new Error('Serwer nie zwrócił adresu autoryzacji Spotify.');
      const url = new URL(location);
      if (url.origin !== 'https://accounts.spotify.com' || url.pathname !== '/authorize') {
        throw new Error('Serwer zwrócił nieprawidłowy adres Spotify.');
      }
      await openBrowserAsync(url.href);
    });
  }

  return <>
    <Result task={task} success="Po autoryzacji wróć tutaj i sprawdź połączenie." />
    <Load query={status}>{(data) => <>
      <Row title={data.connected ? 'Połączono ze Spotify' : 'Spotify Connect'} icon="spotify"
        detail={data.message || (data.configured ? 'Autoryzuj konto radiowęzła.' : 'Integracja wymaga konfiguracji na serwerze.')} />
      <Row title="Urządzenie radiowęzła" detail={data.deviceName + (data.deviceAvailable ? ' · Dostępne' : ' · Niedostępne')} />
      {data.configured ? <Action label={data.connected ? 'Autoryzuj ponownie' : 'Połącz konto Spotify'} busy={task.isPending}
        onPress={() => confirm('Połączyć Spotify Connect?', 'Zaloguj się na konto przeznaczone do szkolnego radiowęzła.',
          authorize, 'Otwórz Spotify')} /> : null}
      <Action label="Odśwież stan" kind="secondary" onPress={() => { void status.refetch(); }} />
    </>}</Load>
  </>;
}
