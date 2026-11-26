import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { errorText } from '@/api/client';
import type { MobileFavorite } from '@/api/generated';
import { Action, Copy, Empty, Failure, Fade, Icon, IconButton, PageHeading, Placeholder, Row, Screen, ui } from '@/ui/components';
import { useTheme } from '@/ui/theme';
import { FavoriteButton, SpotifyButton, TrackRow, useFavorites, useTrack } from './tracks';

const sorts = [
  { id: 'asc', title: 'Tytuł A–Z' },
  { id: 'desc', title: 'Tytuł Z–A' },
  { id: 'duration', title: 'Czas trwania' },
] as const;
type Sort = typeof sorts[number]['id'];
const collator = new Intl.Collator('pl');
const favoriteLayout = LinearTransition.duration(200);

function FavoriteRow({ item }: { item: MobileFavorite }) {
  const track = useTrack(item.id);
  return <TrackRow {...item} artist={track.data?.artistName} actions={<>
    <SpotifyButton title={item.title} spotifyId={item.spotifyId} />
    <FavoriteButton id={item.id} title={item.title} selected />
  </>} />;
}

export function Favorites() {
  const router = useRouter();
  const query = useFavorites();
  const [sort, setSort] = useState<Sort>('asc');
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { colors, reduceMotion } = useTheme();
  const progress = useSharedValue(0);
  const closing = useRef(false);
  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: `${(1 - progress.value) * 100}%` as const }],
  }));

  async function refreshFavorites() {
    setRefreshing(true);
    try {
      await query.refetch();
    } finally {
      setRefreshing(false);
    }
  }

  function openSheet() {
    closing.current = false;
    progress.set(reduceMotion ? 1 : 0);
    setOpen(true);
  }

  function closeSheet() {
    if (closing.current) return;
    closing.current = true;
    if (reduceMotion) {
      setOpen(false);
      return;
    }
    progress.set(withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) }, (finished) => {
      if (finished) scheduleOnRN(setOpen, false);
    }));
  }
  const tracks = [...(query.data?.tracks ?? [])].sort((first, second) => {
    if (sort === 'duration') return first.durationMs - second.durationMs || collator.compare(first.title, second.title);
    return collator.compare(first.title, second.title) * (sort === 'asc' ? 1 : -1);
  });
  return <Screen>
    <PageHeading title="Ulubione" trailing={<IconButton name="sort-variant" label="Sortuj ulubione"
      testID="favorites-sort" onPress={openSheet} />} />
    {query.isPending ? <View style={styles.list}><Placeholder count={4} /></View>
      : query.error && !query.data ? <Failure message={errorText(query.error)} retry={() => { void query.refetch(); }} />
      : <Fade style={ui.fill}>
        <Animated.FlatList data={tracks} keyExtractor={(item) => String(item.id)}
          itemLayoutAnimation={reduceMotion ? undefined : favoriteLayout}
          onRefresh={() => { void refreshFavorites(); }} refreshing={refreshing}
          contentContainerStyle={styles.list} renderItem={({ item }) => <FavoriteRow item={item} />}
          ListEmptyComponent={<Empty title="Nie masz jeszcze ulubionych"
            detail="Dotknij serca obok utworu, aby zapisać go tutaj." icon="heart-outline"
            action={<Action label="Przejdź do radia" kind="secondary" onPress={() => router.navigate('/')} />} />} />
      </Fade>}
    <Modal visible={open} animationType="none" transparent onRequestClose={closeSheet}
      onShow={() => {
        if (!closing.current && !reduceMotion) progress.set(withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) }));
      }}>
      <View style={styles.modal}>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]} />
        <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={closeSheet} />
        <Animated.View accessibilityViewIsModal style={[styles.sheet, { backgroundColor: colors.background }, sheetStyle]}>
          <Copy variant="section" accessibilityRole="header">Sortowanie</Copy>
          {sorts.map((item) => <Row key={item.id} title={item.title} onPress={() => { setSort(item.id); closeSheet(); }}
            right={sort === item.id ? <Icon name="check" color={colors.accent} /> : null} />)}
          <Action label="Zamknij" kind="secondary" onPress={closeSheet} />
        </Animated.View>
      </View>
    </Modal>
  </Screen>;
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 15, paddingTop: 6, paddingBottom: 18, gap: 14 },
  modal: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { backgroundColor: '#0009' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36, gap: 10 },
});
