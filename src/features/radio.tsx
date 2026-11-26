import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, FadeInDown, cancelAnimation, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { errorText } from '@/api/client';
import type { MobileSystemStatus, MobileTopTrack } from '@/api/generated';
import { progress, timeLabel } from '@/domain';
import { Action, Artwork, Copy, Empty, Fade, Failure, Icon, PageHeading, Placeholder, Screen } from '@/ui/components';
import { useTheme } from '@/ui/theme';
import { useForeground, useRadioConnection, useStatus } from './radio-data';
import { FavoriteButton, SpotifyButton, TrackRow, useFavorites, useTrack } from './tracks';

type CurrentTrack = NonNullable<MobileSystemStatus['nowPlaying']>;
const trackTitleEntrance = FadeInDown.duration(230).withInitialValues({ transform: [{ translateY: 9 }] });

function NowPlayingHero({ track, height }: { track: CurrentTrack; height: number }) {
  const { colors, reduceMotion } = useTheme();
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.set(reduceMotion ? 1 : 1.045);
    if (!reduceMotion) scale.set(withTiming(1, { duration: 460, easing: Easing.out(Easing.cubic) }));
  }, [reduceMotion, scale, track.queueItemId]);
  const artwork = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return <View style={[styles.hero, { height, backgroundColor: colors.surface }]}>
    <Animated.View style={[StyleSheet.absoluteFill, artwork]}>
      <Artwork uri={track.cover} hero radius={0} />
    </Animated.View>
    <LinearGradient colors={['transparent', 'rgba(11,13,15,0.25)', colors.background]}
      locations={[0.32, 0.67, 1]} style={StyleSheet.absoluteFill} />
    <Animated.View key={track.queueItemId} entering={reduceMotion ? undefined : trackTitleEntrance} style={styles.heroText}>
      <Copy variant="title" style={styles.center}>{track.title}</Copy>
      <Copy tone="secondary" style={[styles.center, styles.heroArtist]}>{track.artistName}</Copy>
    </Animated.View>
  </View>;
}

function RadioIdle({ status, hasQueue }: { status: MobileSystemStatus; hasQueue: boolean }) {
  const router = useRouter();
  const { colors } = useTheme();
  const nextBreak = timeLabel(status.nextBreakStartsAt);
  const title = status.currentState === 'AfterHours' ? 'Radio gra w czasie przerw'
    : status.muteReason ? 'Radio jest wyciszone' : 'Czekamy na muzykę';
  const detail = nextBreak ? 'Następna przerwa zaczyna się o ' + nextBreak + '.'
    : status.muteReason ?? (status.currentState === 'AfterHours' ? 'Sprawdź, kiedy znów zagra radiowęzeł.' : status.message);

  return <>
    <PageHeading title="Radio" />
    <Fade style={styles.idle}>
      <View style={[styles.signal, { backgroundColor: colors.surface }]}>
        <Icon name="radio-tower" size={36} color={colors.secondary} />
      </View>
      <Copy variant="section" style={styles.center}>{title}</Copy>
      <Copy tone="muted" style={styles.center}>{detail}</Copy>
      <Action label="Harmonogram w Informacjach" kind="secondary"
        onPress={() => router.push({ pathname: '/options/[section]', params: { section: 'information' } })} />
    </Fade>
    {hasQueue ? <Copy variant="track" style={styles.queueHeading}>W kolejce</Copy> : null}
  </>;
}

function PlaybackBar({ track, updatedAt, active }: { track: CurrentTrack; updatedAt: number; active: boolean }) {
  const { colors, reduceMotion } = useTheme();
  const [seconds, setSeconds] = useState(track.elapsedSeconds);
  const [width, setWidth] = useState(0);
  const bar = useSharedValue(progress(track.elapsedSeconds, track.durationMs));

  useEffect(() => {
    const elapsed = () => track.elapsedSeconds + (track.isPaused ? 0 : Math.max(0, Date.now() - updatedAt) / 1000);
    const updateText = () => setSeconds(Math.min(Math.floor(track.durationMs / 1000), Math.floor(elapsed())));
    updateText();
    bar.value = progress(elapsed(), track.durationMs);
    if (!track.isPaused && active && !reduceMotion && track.durationMs > 0) {
      const remaining = Math.max(0, track.durationMs - elapsed() * 1000);
      if (remaining > 0) bar.value = withTiming(1, { duration: remaining, easing: Easing.linear });
    }
    const timer = active && !track.isPaused ? setInterval(() => {
      updateText();
      if (reduceMotion) bar.value = progress(elapsed(), track.durationMs);
    }, 1000) : undefined;
    return () => {
      if (timer) clearInterval(timer);
      cancelAnimation(bar);
    };
  }, [active, bar, reduceMotion, track.durationMs, track.elapsedSeconds, track.isPaused, updatedAt]);

  const fill = useAnimatedStyle(() => ({ transform: [{ scaleX: bar.value }] }));
  const pointer = useAnimatedStyle(() => ({ transform: [{ translateX: bar.value * Math.max(0, width - 9) }] }));
  return <View accessible accessibilityRole="progressbar" accessibilityLabel="Postęp utworu"
    accessibilityValue={{ min: 0, max: Math.max(1, Math.ceil(track.durationMs / 1000)), now: Math.max(0, seconds) }}
    onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    style={[styles.progress, { backgroundColor: colors.muted }]}>
    <Animated.View style={[styles.progressFill, { backgroundColor: colors.text }, fill]} />
    <Animated.View pointerEvents="none" style={[styles.progressDot, { backgroundColor: colors.text }, pointer]} />
  </View>;
}

function QueueRow({ item, maxVotes, isFavorite }: { item: MobileTopTrack; maxVotes: number; isFavorite: boolean }) {
  const info = useTrack(item.songId);
  return <TrackRow {...item} artist={item.artistName} bar={maxVotes ? item.votesCount / maxVotes : 0}
    actions={<>
      <SpotifyButton title={item.title} spotifyId={info.data?.spotifyId} />
      <FavoriteButton id={item.songId} title={item.title} selected={isFavorite} />
    </>} />;
}

export function Radio() {
  const status = useStatus();
  const favorites = useFavorites();
  const focused = useIsFocused();
  const active = useForeground();
  useRadioConnection(undefined, active && focused);
  const { height, width } = useWindowDimensions();
  const track = status.data?.nowPlaying;
  const queue = (status.data?.topTracks ?? []).filter((item) => item.songId !== track?.songId).slice(0, 5);
  const maxVotes = Math.max(0, ...queue.map((item) => item.votesCount));
  const heroHeight = Math.min(width * 1.14, height * 0.53, 600);

  if (status.isPending) return <Screen><View style={styles.loading}><Placeholder count={5} /></View></Screen>;
  if (!status.data) return <Screen><Failure message={errorText(status.error)} retry={() => { void status.refetch(); }} /></Screen>;

  return <Screen top={!track}>
    <FlatList data={queue} keyExtractor={(item) => String(item.queueItemId)}
      showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never"
      ListHeaderComponent={track
        ? <Fade>
          <NowPlayingHero track={track} height={heroHeight} />
          <PlaybackBar key={track.queueItemId} track={track} updatedAt={status.dataUpdatedAt} active={active && focused} />
        </Fade>
        : <RadioIdle status={status.data} hasQueue={queue.length > 0} />}
      ListEmptyComponent={track ? <Empty title="Kolejka jest pusta" detail="Zgłoś utwór w zakładce Głosuj." /> : undefined}
      renderItem={({ item }) => <View style={styles.queueRow}>
        <QueueRow item={item} maxVotes={maxVotes} isFavorite={favorites.data?.tracks.some((entry) => entry.id === item.songId) ?? false} />
      </View>}
      contentContainerStyle={styles.list} />
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { justifyContent: 'flex-end', overflow: 'hidden' },
  heroText: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 35 },
  center: { textAlign: 'center' },
  heroArtist: { fontSize: 19, lineHeight: 24 },
  progress: { height: 5, position: 'relative', marginBottom: 5 },
  progressFill: { flex: 1, transformOrigin: 'left center' },
  progressDot: { width: 9, height: 9, borderRadius: 6, position: 'absolute', top: -2 },
  idle: { paddingHorizontal: 28, paddingTop: 12, paddingBottom: 26, alignItems: 'center', gap: 12 },
  signal: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  queueHeading: { marginHorizontal: 16, marginTop: 4 },
  list: { paddingBottom: 12 },
  queueRow: { paddingHorizontal: 9, marginTop: 12 },
  loading: { paddingHorizontal: 14 },
});
