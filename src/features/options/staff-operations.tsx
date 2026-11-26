import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import { useState } from 'react';
import { View } from 'react-native';
import type { MobileQueueTrack } from '@/api/generated';
import * as sdk from '@/api/generated/sdk.gen';
import { request } from '@/api/options';
import { useApiQuery, usePages } from '@/api/query';
import { moveItem, roleNames, schoolDate, timeLabel } from '@/domain';
import { useSession } from '@/session';
import { Action, Copy, Empty, Feedback, Field, IconButton, Row, confirm, ui } from '@/ui/components';
import { useDebounce } from '@/ui/use-debounce';
import { statusKey } from '../radio-data';
import { Collection, Load, More, Remove, Result, TrackPicker, useTask } from './shared';

export function Proposals() {
  const { session } = useSession();
  const pending = useApiQuery(['pending'], (client, signal) => sdk.pending(request(client, signal)));
  const task = useTask([['pending'], ['queue'], statusKey, ['bans'], ['moderation']]);
  return <>
    <Result task={task} />
    <Load query={pending}>{({ proposals }) => <Collection items={proposals} itemKey={(item) => item.id}
      empty="Brak propozycji oczekujących" render={(item) => <>
        <Row title={item.title ?? 'Utwór ' + item.songId}
          detail={[item.artist, item.submittedBy, 'Przerwa ' + (item.breakNumber ?? item.breakId)].filter(Boolean).join(' · ')} />
        <View style={ui.inline}>
          <Action label="Zatwierdź" kind="secondary" disabled={task.isPending} onPress={() =>
            task.mutate((client) => sdk.approve({ ...request(client), path: { proposalId: item.id } }))} />
          <Remove label="Odrzuć" detail="Propozycja zniknie z kolejki moderacji." disabled={task.isPending}
            action={() => task.mutate((client) => sdk.deny({ ...request(client), path: { proposalId: item.id } }))} />
          <Remove label="Odrzuć i zablokuj utwór" detail="Utwór zostanie dodany do czarnej listy." disabled={task.isPending}
            action={() => task.mutate((client) => sdk.deny({ ...request(client), path: { proposalId: item.id }, query: { addToBlacklist: true } }))} />
          {item.userId > 0 && item.userId !== session?.userId ? <Remove label="Zablokuj autora"
            detail={'Konto: ' + (item.submittedBy ?? item.userId)} disabled={task.isPending}
            action={() => task.mutate((client) => sdk.ban({ ...request(client), path: { userId: item.userId } }))} /> : null}
        </View>
      </>} />}</Load>
  </>;
}

export function Bans() {
  const query = useApiQuery(['bans'], (client, signal) => sdk.bans(request(client, signal)));
  const task = useTask([['bans'], ['users']]);
  return <>
    <Result task={task} />
    <Load query={query}>{({ bannedUsers }) => <Collection items={bannedUsers} itemKey={(item) => item.id}
      empty="Brak zablokowanych kont" render={(item) => <>
        <Row title={item.username} detail={item.reason ?? item.bannedAt.slice(0, 10)} icon="account-cancel-outline" />
        <Remove label="Zdejmij blokadę" detail={item.username} disabled={task.isPending}
          action={() => task.mutate((client) => sdk.liftBan({ ...request(client), path: { banId: item.id } }))} />
      </>} />}</Load>
  </>;
}

const lists = [
  { kind: 'blackSongs', label: 'Czarna lista utworów' },
  { kind: 'blackArtists', label: 'Czarna lista wykonawców' },
  { kind: 'green', label: 'Zielona lista' },
] as const;
type ListKind = typeof lists[number]['kind'];

export function ModerationLists() {
  const [kind, setKind] = useState<ListKind>('blackSongs');
  const [input, setInput] = useState('');
  const search = useDebounce(input.trim());
  const task = useTask([['moderation'], ['catalog']]);
  const collection = usePages(['moderation', kind, search], async (client, signal, page) => {
    const options = { ...request(client, signal), query: { search, page, pageSize: 20 } };
    if (kind === 'blackArtists') {
      const data = await sdk.artistBlacklist(options);
      return { ...data, items: data.items.map((item) => ({ key: item.id, targetId: item.artistId, title: item.artistName, detail: '' })) };
    }
    const data = kind === 'green' ? await sdk.greenlist(options) : await sdk.songBlacklist(options);
    return { ...data, items: data.items.map((item) => ({
      key: item.id, targetId: kind === 'green' ? item.songId : item.id, title: item.title, detail: item.artistName,
    })) };
  });

  function add(item: { id: number; title: string; artistId: number; artistName: string }) {
    confirm('Dodać do listy?', kind === 'blackArtists' ? item.artistName : item.title, () => task.mutate((client) => {
      if (kind === 'blackArtists') return sdk.blacklistArtist({ ...request(client), path: { artistId: item.artistId } });
      if (kind === 'green') return sdk.greenlistSong({ ...request(client), body: { songId: item.id } });
      return sdk.blacklistSong({ ...request(client), body: { songId: item.id, artistId: null } });
    }), 'Dodaj');
  }

  function remove(targetId: number) {
    task.mutate((client) => {
      if (kind === 'blackArtists') return sdk.removeBlacklistedArtist({ ...request(client), path: { artistId: targetId } });
      if (kind === 'green') return sdk.removeGreenlistedSong({ ...request(client), path: { songId: targetId } });
      return sdk.removeBlacklistedSong({ ...request(client), path: { id: targetId } });
    });
  }

  return <>
    <View style={ui.inline}>{lists.map((list) => <Action key={list.kind} label={list.label}
      kind={kind === list.kind ? 'primary' : 'secondary'} onPress={() => { setKind(list.kind); task.reset(); }} />)}</View>
    <TrackPicker key={kind} title={kind === 'blackArtists' ? 'Wybierz utwór wykonawcy' : 'Dodaj utwór do listy'}
      onSelect={add} busy={task.isPending} />
    <Field icon="magnify" placeholder="Przeszukaj listę" value={input} onChangeText={setInput} />
    <Result task={task} />
    <Load query={collection}>{(data) => <>
      <Collection items={data.pages.flatMap((page) => page.items)} itemKey={(item) => item.key} empty="Lista jest pusta"
        render={(item) => <>
          <Row title={item.title} detail={item.detail} />
          <Remove label="Usuń z listy" detail={item.title} disabled={task.isPending} action={() => remove(item.targetId)} />
        </>} />
      <More query={collection} />
    </>}</Load>
  </>;
}

function QueueEditor({ breakId }: { breakId: number }) {
  const list = useApiQuery(['queue', breakId], (client, signal) => sdk.queueForBreak({
    ...request(client, signal), path: { breakId },
  }));
  const task = useTask([['queue', breakId], statusKey, ['history'], ['rankings']]);
  const [sequence, setSequence] = useState<MobileQueueTrack[] | null>(null);
  return <>
    <Result task={task} />
    <Load query={list}>{({ queue }) => {
      const current = [...queue].sort((a, b) => a.orderIndex - b.orderIndex);
      const changed = sequence && (sequence.length !== current.length || sequence.some((item) =>
        !current.some((entry) => entry.queueItemId === item.queueItemId)));
      const ordered = changed ? current : sequence ?? current;
      return <>
        {changed ? <Feedback error text="Kolejka zmieniła się. Zacznij ustawianie kolejności od nowa." /> : null}
        <Collection items={ordered} itemKey={(item) => item.queueItemId} empty="Kolejka jest pusta" render={(item, index) => <Row
          title={(index + 1) + '. ' + item.title} detail={item.artistName}
          right={<View style={ui.inline}>
            <IconButton name="arrow-up" label={'Przenieś wyżej: ' + item.title} disabled={index === 0 || task.isPending}
              onPress={() => setSequence(moveItem(ordered, index, -1))} />
            <IconButton name="arrow-down" label={'Przenieś niżej: ' + item.title} disabled={index === ordered.length - 1 || task.isPending}
              onPress={() => setSequence(moveItem(ordered, index, 1))} />
          </View>} />} />
        {sequence && !changed ? <Action label="Zapisz kolejność" busy={task.isPending} onPress={() => task.mutate(
          (client) => sdk.reorderQueue({ ...request(client), path: { breakId },
            body: { queueItemIds: ordered.map((item) => item.queueItemId) } }),
          { onSuccess: () => setSequence(null) },
        )} /> : null}
        <Remove label="Archiwizuj przerwę" detail="Kolejka zostanie zamknięta, a zagrane utwory trafią do historii."
          disabled={task.isPending || !queue.length} action={() => task.mutate(
            (client) => sdk.archive({ ...request(client), path: { breakId } }), { onSuccess: () => setSequence(null) },
          )} />
      </>;
    }}</Load>
  </>;
}

export function ManageQueue() {
  const [selected, setSelected] = useState<number>();
  const date = schoolDate();
  const breaks = useApiQuery(['breaks', date], (client, signal) => sdk.breaks({
    ...request(client, signal), query: { date },
  }));
  return <Load query={breaks}>{({ przerwy }) => {
    const breakId = przerwy.find((item) => item.id === selected)?.id ?? przerwy[0]?.id;
    return <>
      <View style={ui.inline}>
        {przerwy.map((entry) => <Action key={entry.id} label={entry.breakNumber + ' · ' + timeLabel(entry.startAt)}
          kind={entry.id === breakId ? 'primary' : 'secondary'} onPress={() => setSelected(entry.id)} />)}
      </View>
      {breakId ? <QueueEditor key={breakId} breakId={breakId} /> : <Empty title="Brak przerw" />}
    </>;
  }}</Load>;
}

export function Player() {
  const [volume, setVolume] = useState('');
  const [source, setSource] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audio, setAudio] = useState<DocumentPicker.DocumentPickerAsset>();
  const [pickerError, setPickerError] = useState('');
  const player = useApiQuery(['player'], (client, signal) => sdk.playerStatus(request(client, signal)), {
    refetchInterval: 12_000,
  });
  const task = useTask([['player'], statusKey, ['queue']]);

  async function pickAudio() {
    setPickerError('');
    try {
      const picked = await DocumentPicker.getDocumentAsync({ type: ['audio/*', 'video/mp4'], copyToCacheDirectory: true });
      if (picked.canceled) return;
      const file = picked.assets[0];
      if (!file || (file.size != null && file.size >= 100_000_000) || !/\.(mp3|wav|ogg|flac|m4a|mp4)$/i.test(file.name)) {
        setPickerError('Wybierz plik MP3, WAV, OGG, FLAC, M4A lub MP4 poniżej 100 MB.');
        return;
      }
      setAudio(file);
    } catch {
      setPickerError('Nie udało się otworzyć pliku.');
    }
  }

  return <>
    <Result task={task} success="Polecenie wykonane." />
    <Load query={player}>{(status) => <>
      <Row title={status.title ?? 'Brak aktywnego utworu'}
        detail={[status.artist, status.isPaused ? 'Wstrzymano' : status.isPlaying ? 'Odtwarzanie' : 'Zatrzymano'].filter(Boolean).join(' · ')}
        icon="radio-tower" />
      <View style={ui.inline}>
        <Action label={status.isPaused ? 'Wznów' : 'Wstrzymaj'} kind="secondary" disabled={task.isPending || (!status.isPlaying && !status.isPaused)}
          onPress={() => task.mutate((client) => status.isPaused ? sdk.resumePlayer(request(client)) : sdk.pausePlayer(request(client)))} />
        <Action label={status.isMuted ? 'Włącz dźwięk' : 'Wycisz'} kind="secondary" disabled={task.isPending}
          onPress={() => task.mutate((client) => sdk.mutePlayer(request(client)))} />
        <Remove label="Pomiń" detail="Radio przejdzie do następnego utworu w kolejce." disabled={task.isPending || !status.isPlaying}
          action={() => task.mutate(async (client) => {
            const result = await sdk.skipTrack(request(client));
            if (!result.success) throw new Error('Nie ma utworu, który można pominąć.');
          })} />
        <Remove label="Zatrzymaj" detail="Odtwarzanie w radiowęźle zostanie zatrzymane." disabled={task.isPending}
          action={() => task.mutate((client) => sdk.stopPlayer(request(client)))} />
      </View>
      <Field placeholder={'Głośność (0–100), obecnie ' + status.volume + '%'} keyboardType="number-pad" value={volume} onChangeText={setVolume} />
      <Action label="Ustaw głośność" kind="secondary" disabled={task.isPending || !/^\d{1,3}$/.test(volume) || +volume > 100}
        onPress={() => task.mutate((client) => sdk.setVolume({ ...request(client), body: { volume: +volume } }))} />
    </>}</Load>
    <Copy accessibilityRole="header" variant="track">Odtwarzanie pliku</Copy>
    <Field placeholder="Adres URL lub ścieżka na serwerze" value={source} onChangeText={setSource} autoCapitalize="none" />
    <Field placeholder="Tytuł (opcjonalny)" value={title} onChangeText={setTitle} />
    <Field placeholder="Wykonawca (opcjonalny)" value={artist} onChangeText={setArtist} />
    <Action label="Odtwórz źródło serwera" kind="secondary" disabled={task.isPending || !source.trim()} onPress={() =>
      confirm('Odtworzyć plik?', 'Zastąpi bieżące odtwarzanie w szkole.', () => task.mutate((client) => sdk.playFile({
        ...request(client), body: { pathOrUrl: source.trim(), title: title.trim() || null, artist: artist.trim() || null },
      })), 'Odtwórz')} />
    <Action label={audio?.name ?? 'Wybierz plik audio'} kind="secondary" disabled={task.isPending} onPress={() => { void pickAudio(); }} />
    {pickerError ? <Feedback error text={pickerError} /> : null}
    {audio ? <Action label="Wyślij i odtwórz" disabled={task.isPending} onPress={() =>
      confirm('Odtworzyć plik na radiowęźle?', audio.name, () => task.mutate((client) => sdk.uploadAndPlay({
        ...request(client), fetch: expoFetch as typeof fetch,
        body: { file: new File(audio.uri), title: title.trim() || undefined, artist: artist.trim() || undefined },
      })), 'Odtwórz')} /> : null}
  </>;
}

export function ManageUsers() {
  const { session } = useSession();
  const [input, setInput] = useState('');
  const [editing, setEditing] = useState<number>();
  const search = useDebounce(input.trim());
  const users = usePages(['users', search], (client, signal, page) => sdk.users({
    ...request(client, signal), query: { page, pageSize: 20, search },
  }));
  const bans = useApiQuery(['bans'], (client, signal) => sdk.bans(request(client, signal)));
  const task = useTask([['users'], ['bans']]);
  const ranks = ['user', 'mod', 'admin', 'head_admin'];

  return <>
    <Field icon="magnify" placeholder="Szukaj użytkownika" value={input} onChangeText={setInput} />
    <Result task={task} />
    <Load query={users}>{(data) => <>
      <Collection items={data.pages.flatMap((page) => page.users)} itemKey={(item) => item.id}
        empty="Brak pasujących użytkowników" render={(item) => {
          const ban = bans.data?.bannedUsers.find((entry) => entry.userId === item.id);
          const otherUser = item.id !== session?.userId;
          const canEdit = session?.role === 'head_admin' && otherUser;
          return <>
            <Row title={item.userLogin} detail={roleNames[item.rankName] ?? item.rankName} icon="account-outline" />
            {otherUser && bans.data ? <View style={ui.inline}>
              <Remove label={ban ? 'Zdejmij blokadę' : 'Zablokuj konto'} detail={item.userLogin} disabled={task.isPending}
                action={() => task.mutate((client) => ban ? sdk.liftBan({ ...request(client), path: { banId: ban.id } })
                  : sdk.ban({ ...request(client), path: { userId: item.id } }))} />
              {canEdit ? <Action label={editing === item.id ? 'Anuluj wybór roli' : 'Zmień rolę'} kind="secondary"
                onPress={() => setEditing(editing === item.id ? undefined : item.id)} /> : null}
            </View> : null}
            {canEdit && editing === item.id ? <View style={ui.inline}>{ranks.map((role, index) => <Action
              key={role} label={roleNames[role] ?? role} kind={index + 1 === item.rankId ? 'primary' : 'secondary'}
              disabled={index + 1 === item.rankId || task.isPending}
              onPress={() => confirm('Zmienić rolę użytkownika?', item.userLogin + ' · ' + roleNames[role], () =>
                task.mutate((client) => sdk.updateRole({ ...request(client), path: { id: item.id },
                  body: { rankId: index + 1 } }), { onSuccess: () => setEditing(undefined) }), 'Zmień rolę')} />)}</View> : null}
          </>;
        }} />
      <More query={users} />
    </>}</Load>
  </>;
}
