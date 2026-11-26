import { useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ApiError, errorText } from '@/api/client';
import type { MobileQueueTrack, MobileSpotifyTrack, MobileTrack } from '@/api/generated';
import * as sdk from '@/api/generated/sdk.gen';
import { request } from '@/api/options';
import { useApiMutation, useApiQuery, usePages } from '@/api/query';
import { duration, progress, timeLabel } from '@/domain';
import { Action, Copy, Empty, Failure, Fade, Feedback, Field, Icon, PageHeading, Placeholder, Screen, ui, useBar } from '@/ui/components';
import { useTheme } from '@/ui/theme';
import { ReactionBurst } from '@/ui/reaction-burst';
import { useDebounce } from '@/ui/use-debounce';
import { statusKey, useForeground, useRadioConnection, useStatus, useVotingTarget } from './radio-data';
import { FavoriteButton, SpotifyButton, TrackRow, useFavorites, useTrack } from './tracks';

type Candidate =
  | { key: string; source: 'catalog'; track: MobileTrack }
  | { key: string; source: 'spotify'; track: MobileSpotifyTrack };

const voteLayout = LinearTransition.duration(210);

function BreakCountdown({ start, end, remaining, updatedAt, active }: {
  start: string; end: string; remaining: number; updatedAt: number; active: boolean;
}) {
  const { colors } = useTheme();
  const [seconds, setSeconds] = useState(remaining);
  const total = (Date.parse(end.slice(0, 19) + 'Z') - Date.parse(start.slice(0, 19) + 'Z')) / 1000;
  const fill = useBar(total > 0 ? progress(seconds, total * 1000) : 0, 250);

  useEffect(() => {
    const update = () => setSeconds(Math.max(0, remaining - Math.floor(Math.max(0, Date.now() - updatedAt) / 1000)));
    update();
    if (!active) return;
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [active, remaining, updatedAt]);

  const label = duration(seconds * 1000);
  return <View style={styles.countdown} accessible accessibilityRole="progressbar"
    accessibilityLabel="Do końca przerwy" accessibilityValue={{ text: label }}>
    <View style={styles.countdownLabel}>
      <Copy variant="detail" tone="muted">Do końca przerwy</Copy>
      <Copy variant="detail">{label}</Copy>
    </View>
    <View style={[styles.breakTrack, { backgroundColor: colors.surface }]}>
      <Animated.View style={[styles.breakFill, { backgroundColor: colors.text }, fill]} />
    </View>
  </View>;
}

function VoteButton({ item, onPress, busy, closed, celebrate }: {
  item: MobileQueueTrack; onPress: () => void; busy: boolean; closed: boolean; celebrate: boolean;
}) {
  const { colors, reduceMotion } = useTheme();
  const active = useSharedValue(item.hasVoted ? 1 : 0);
  const scale = useSharedValue(1);
  useEffect(() => {
    active.value = withTiming(item.hasVoted ? 1 : 0, { duration: reduceMotion ? 0 : 180 });
  }, [active, item.hasVoted, reduceMotion]);
  const activeStyle = useAnimatedStyle(() => ({ opacity: active.value * 0.14 }));
  const face = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <ReactionBurst celebrate={celebrate && item.hasVoted} color={colors.accent}>
    <Pressable accessibilityRole="button"
    testID={'vote-' + item.queueItemId}
    accessibilityLabel={(item.hasVoted ? 'Cofnij głos: ' : 'Zagłosuj: ') + item.title}
    accessibilityValue={{ text: String(item.votesCount) }}
    accessibilityState={{ selected: item.hasVoted, busy, disabled: busy || closed }}
    disabled={busy || closed} style={styles.voteButton} onPress={onPress}
    onPressIn={() => scale.set(withTiming(reduceMotion ? 1 : 0.94, { duration: reduceMotion ? 0 : 120 }))}
    onPressOut={() => scale.set(withTiming(1, { duration: reduceMotion ? 0 : 120 }))}>
    <Animated.View style={[styles.voteFace, face, { backgroundColor: colors.surface, opacity: closed ? 0.55 : 1 }]}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.tint, { backgroundColor: colors.accent }, activeStyle]} />
      <Icon name={item.hasVoted ? 'check-bold' : 'check'} color={item.hasVoted ? colors.accent : colors.muted} size={19} />
      <Copy variant="small" style={{ color: item.hasVoted ? colors.accent : colors.secondary, fontVariant: ['tabular-nums'] }}>
        {item.votesCount}
      </Copy>
    </Animated.View>
    </Pressable>
  </ReactionBurst>;
}

function VotingRow({ item, breakId }: { item: MobileQueueTrack; breakId: number }) {
  const track = useTrack(item.songId);
  const vote = useApiMutation(async (client, selected: boolean) => {
    if (selected) return sdk.undoVote({ ...request(client), path: { queueItemId: item.queueItemId } });
    return sdk.vote({ ...request(client), body: { queueItemId: item.queueItemId } });
  }, [['queue', breakId], statusKey, ['track', item.songId], ['catalog']]);
  const status = track.data?.queueStatus;
  return <View style={ui.gap}>
    <TrackRow {...item} artist={item.artistName} timeUnderArtist actions={<>
      <VoteButton item={item} busy={vote.isPending} closed={Boolean(status && status !== 'queued')}
        celebrate={vote.isSuccess && vote.variables === false}
        onPress={() => { if (!vote.isPending) vote.mutate(item.hasVoted); }} />
      <SpotifyButton spotifyId={track.data?.spotifyId} title={item.title} />
    </>} />
    {vote.error ? <Feedback error text={errorText(vote.error)} /> : null}
  </View>;
}

export function Voting() {
  const [input, setInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { reduceMotion } = useTheme();
  const search = useDebounce(input.trim());
  const searching = Boolean(input.trim());
  const active = useForeground();
  const focused = useIsFocused();
  const status = useStatus();
  const { target, activeBreak, loading, error, retry } = useVotingTarget(status);
  const breakId = target?.id;
  const connected = useRadioConnection(breakId, active && focused);
  const favorites = useFavorites();
  const queue = useApiQuery(['queue', breakId], (client, signal) => sdk.queueForBreak({
    ...request(client, signal), path: { breakId: breakId ?? 0 },
  }), { enabled: breakId != null, refetchInterval: connected ? 45_000 : 12_000 });
  const catalog = usePages(['catalog', search, breakId], (client, signal, page) => sdk.tracks({
    ...request(client, signal), query: { search, page, pageSize: 20, breakId },
  }), Boolean(search && searching));
  const spotify = useApiQuery(['spotify-search', search], (client, signal) => sdk.spotifySearch({
    ...request(client, signal), query: { q: search },
  }), { enabled: Boolean(search && searching), staleTime: 60_000 });
  const propose = useApiMutation((client, item: Candidate) => sdk.propose({
    ...request(client), body: item.source === 'catalog' ? { songId: item.track.id, breakId }
      : { spotifyId: item.track.externalId, breakId },
  }), [['queue', breakId], statusKey, ['catalog'], ['pending']]);

  async function refreshQueue() {
    setRefreshing(true);
    try {
      await queue.refetch();
    } finally {
      setRefreshing(false);
    }
  }

  const local = catalog.data?.pages.flatMap((page) => page.items) ?? [];
  const localSpotifyIds = new Set(local.map((track) => track.spotifyId));
  const remote = (spotify.data ?? []).filter((track) => !localSpotifyIds.has(track.externalId));
  const results: Candidate[] = [
    ...local.map((track) => ({ key: 'local-' + track.id, source: 'catalog' as const, track })),
    ...remote.map((track) => ({ key: 'spotify-' + track.externalId, source: 'spotify' as const, track })),
  ];

  return <Screen>
    <PageHeading title="Dodaj" />
    <View style={styles.search}>
      <Field testID="track-search" icon="magnify" placeholder="Szukaj" value={input}
        onChangeText={setInput} autoCorrect={false} autoCapitalize="none" clearButtonMode="while-editing" returnKeyType="search" />
      {propose.error ? <Feedback error text={errorText(propose.error)} /> : null}
      {propose.isSuccess ? <Feedback text={propose.data?.status === 'approved'
        ? 'Utwór dodano do kolejki.' : 'Utwór oczekuje na moderację.'} /> : null}
    </View>
    {searching ? <FlatList data={search === input.trim() ? results : []} keyExtractor={(item) => item.key}
      keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list}
      onEndReached={() => { if (catalog.hasNextPage && !catalog.isFetchingNextPage) void catalog.fetchNextPage(); }}
      ListEmptyComponent={search !== input.trim() || catalog.isPending || spotify.isPending ? <Placeholder />
        : catalog.error ? <Failure message={errorText(catalog.error)} retry={() => { void catalog.refetch(); }} />
        : <Empty title="Brak wyników" detail="Spróbuj wpisać inny tytuł lub wykonawcę." />}
      ListHeaderComponent={spotify.error && !(spotify.error instanceof ApiError && spotify.error.status === 503)
        ? <Feedback error text="Wyszukiwanie Spotify jest chwilowo niedostępne." /> : undefined}
      renderItem={({ item }) => {
        const localTrack = item.source === 'catalog' ? item.track : undefined;
        const title = item.track.title;
        const artist = item.source === 'catalog' ? item.track.artistName : item.track.artist;
        const spotifyId = item.source === 'catalog' ? item.track.spotifyId : item.track.externalId;
        return <TrackRow {...item.track} artist={artist} timeUnderArtist actions={<>
          <SpotifyButton spotifyId={spotifyId} title={title} />
          {localTrack ? <FavoriteButton id={localTrack.id} title={title}
            selected={favorites.data?.tracks.some((entry) => entry.id === localTrack.id) ?? localTrack.isFavorite} /> : null}
          <Action label="Zgłoś" kind="secondary" disabled={!breakId || Boolean(localTrack?.queueItemId) || propose.isPending}
            busy={propose.isPending && propose.variables?.key === item.key} onPress={() => propose.mutate(item)} />
        </>} />;
      }} /> : <>
      <View style={styles.voteHeading}>
        <Copy variant="section" accessibilityRole="header">Głosuj</Copy>
        {activeBreak && status.data?.breakEndsAt ? <BreakCountdown key={activeBreak.id}
          start={activeBreak.startAt} end={status.data.breakEndsAt} remaining={status.data.secondsRemaining}
          updatedAt={status.dataUpdatedAt} active={active && focused} />
          : target ? <Copy variant="small" tone="muted">Przerwa {target.breakNumber} · {timeLabel(target.startAt)}</Copy> : null}
        {activeBreak && target && target.id !== activeBreak.id ? <Copy variant="small" tone="muted" style={styles.targetLabel}>
          Głosy na przerwę {target.breakNumber} · {timeLabel(target.startAt)}
        </Copy> : null}
      </View>
      {loading ? <View style={styles.list}><Placeholder count={2} /></View>
        : error ? <Failure message={errorText(error)} retry={retry} />
        : !breakId ? <Empty title="Głosowanie zamknięte" detail="Harmonogram znajdziesz w Opcjach → Informacje." icon="poll" />
        : queue.isPending ? <View style={styles.list}><Placeholder count={2} /></View>
        : queue.error && !queue.data ? <Failure message={errorText(queue.error)} retry={() => { void queue.refetch(); }} />
        : <Fade style={ui.fill}>
          <Animated.FlatList data={queue.data?.queue ?? []} keyExtractor={(item) => String(item.queueItemId)}
            contentContainerStyle={styles.list}
            itemLayoutAnimation={reduceMotion ? undefined : voteLayout}
            onRefresh={() => { void refreshQueue(); }} refreshing={refreshing}
            renderItem={({ item }) => <VotingRow item={item} breakId={breakId} />}
            ListEmptyComponent={<Empty title="Brak utworów do głosowania" detail="Wyszukaj utwór powyżej i zgłoś go do kolejki." icon="poll" />} />
        </Fade>}
    </>}
  </Screen>;
}

const styles = StyleSheet.create({
  search: { paddingHorizontal: 14, gap: 8 },
  voteHeading: { marginTop: 22, marginBottom: 24, flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, gap: 8 },
  countdown: { minWidth: 130, gap: 5 },
  countdownLabel: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  breakTrack: { height: 4, overflow: 'hidden', borderRadius: 2 },
  breakFill: { flex: 1, borderRadius: 2, transformOrigin: 'left center' },
  targetLabel: { width: '100%' },
  list: { paddingHorizontal: 13, paddingBottom: 20, gap: 14 },
  voteButton: { minHeight: 48, minWidth: 76, justifyContent: 'center' },
  voteFace: { minHeight: 44, minWidth: 76, overflow: 'hidden', borderRadius: 12, paddingHorizontal: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  tint: { borderRadius: 12 },
});
