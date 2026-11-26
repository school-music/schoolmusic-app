import { useState, type ReactNode } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { errorText } from '@/api/client';
import * as sdk from '@/api/generated/sdk.gen';
import { request } from '@/api/options';
import { useApiMutation, useApiQuery } from '@/api/query';
import { duration, spotifyTrackUrl } from '@/domain';
import { Artwork, Copy, Feedback, IconButton, useBar } from '@/ui/components';
import { ReactionBurst } from '@/ui/reaction-burst';
import { useTheme } from '@/ui/theme';

export function useFavorites() {
  return useApiQuery(['favorites'], (client, signal) => sdk.favorites(request(client, signal)));
}

export function useTrack(id: number) {
  return useApiQuery(['track', id], (client, signal) => sdk.track({ ...request(client, signal), path: { id } }),
    { enabled: id > 0, staleTime: 60_000 });
}

export function FavoriteButton({ id, title, selected }: { id: number; title: string; selected: boolean }) {
  const { colors } = useTheme();
  const toggle = useApiMutation((client, wasSelected: boolean) => {
    const options = { ...request(client), path: { id } };
    return wasSelected ? sdk.removeFavorite(options) : sdk.addFavorite(options);
  }, [['favorites'], ['track', id], ['tracks'], ['catalog']]);

  return <View style={styles.action}>
    <ReactionBurst celebrate={selected && toggle.isSuccess && toggle.variables === false} color={colors.favorite}>
    <IconButton name="heart-outline" selectedName="heart" size={23} selectedColor={colors.favorite}
      label={(selected ? 'Usuń z ulubionych: ' : 'Dodaj do ulubionych: ') + title} selected={selected}
      testID={'favorite-' + id} disabled={toggle.isPending} onPress={() => { if (!toggle.isPending) toggle.mutate(selected); }} />
    </ReactionBurst>
    {toggle.error ? <Feedback error text={errorText(toggle.error)} /> : null}
  </View>;
}

export function SpotifyButton({ spotifyId, title }: { spotifyId?: string | null; title: string }) {
  const { colors } = useTheme();
  const [error, setError] = useState(false);
  const url = spotifyTrackUrl(spotifyId);
  if (!url) return null;
  return <View style={styles.action}>
    <IconButton name="spotify" size={21} label={'Otwórz w Spotify: ' + title} color={colors.text}
      onPress={() => { void Linking.openURL(url).then(() => setError(false), () => setError(true)); }} />
    {error ? <Feedback error text="Nie udało się otworzyć Spotify." /> : null}
  </View>;
}

export type TrackRowProps = {
  title: string; artist?: string | null; cover?: string | null; durationMs?: number;
  actions?: ReactNode; bar?: number; timeUnderArtist?: boolean;
};

export function TrackRow({ title, artist, cover, durationMs, actions, bar, timeUnderArtist }: TrackRowProps) {
  const { colors } = useTheme();
  const animatedBar = useBar(bar ?? 0, 180);
  const time = durationMs && durationMs > 0 ? duration(durationMs) : null;
  return <View style={styles.row}>
    {bar != null ? <View pointerEvents="none" style={styles.barSpace}>
      <Animated.View style={[styles.bar, { backgroundColor: colors.surface }, animatedBar]} />
    </View> : null}
    <Artwork uri={cover} />
    <View style={styles.labels}>
      <Copy variant="track" tone="secondary" numberOfLines={2}>{title}</Copy>
      {artist ? <Copy variant="small" tone="muted" numberOfLines={1} style={styles.artist}>{artist}</Copy> : null}
      {timeUnderArtist && time ? <Copy variant="detail" tone="detail">{time}</Copy> : null}
    </View>
    {!timeUnderArtist && time ? <Copy variant="detail" tone="detail" style={styles.duration}>{time}</Copy> : null}
    {actions && <View style={styles.actions}>{actions}</View>}
  </View>;
}

const styles = StyleSheet.create({
  row: { position: 'relative', minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 9 },
  labels: { flex: 1, paddingVertical: 3 },
  artist: { fontWeight: '600' },
  barSpace: { position: 'absolute', top: 0, bottom: 0, left: -1, right: 80 },
  bar: { flex: 1, transformOrigin: 'left center' },
  actions: { flexDirection: 'row', alignItems: 'center', flexShrink: 0 },
  action: { maxWidth: 86 },
  duration: { minWidth: 29, textAlign: 'right' },
});
