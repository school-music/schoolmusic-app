import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useEffect, type ComponentProps, type PropsWithChildren, type ReactNode } from 'react';
import {
  ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
  type TextInputProps, type TextProps, type ViewStyle,
} from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from './theme';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function Icon({ name, size = 24, color }: { name: IconName; size?: number; color?: string }) {
  const { colors } = useTheme();
  return <MaterialCommunityIcons name={name} size={size} color={color ?? colors.text} accessible={false} />;
}

type Variant = 'title' | 'section' | 'track' | 'body' | 'small' | 'detail';

export function Copy({ variant = 'body', tone = 'text', style, ...props }: TextProps & {
  variant?: Variant; tone?: keyof ReturnType<typeof useTheme>['colors'];
}) {
  const { colors } = useTheme();
  return <Text {...props} style={[{ color: colors[tone] }, typography[variant], style]} />;
}

export function Screen({ children, top = true }: PropsWithChildren<{ top?: boolean }>) {
  const { colors } = useTheme();
  return <SafeAreaView edges={top ? ['top', 'left', 'right'] : ['left', 'right']} style={[styles.fill, { backgroundColor: colors.background }]}>{children}</SafeAreaView>;
}

export function Page({ title, children, leading, trailing }: PropsWithChildren<{
  title: string; leading?: ReactNode; trailing?: ReactNode;
}>) {
  return <Screen>
    <PageHeading title={title} leading={leading} trailing={trailing} />
    <ScrollView contentContainerStyle={styles.pageContent} keyboardShouldPersistTaps="handled">{children}</ScrollView>
  </Screen>;
}

export function PageHeading({ title, leading, trailing }: {
  title: string; leading?: ReactNode; trailing?: ReactNode;
}) {
  return <View style={[styles.heading, Boolean(leading) && styles.backHeading]}>
    {leading}
    <Copy accessibilityRole="header" variant="title" style={styles.fill}>{title}</Copy>
    {trailing}
  </View>;
}

export function Action({ label, onPress, kind = 'primary', busy = false, disabled = false, icon, style, testID }: {
  label: string; onPress: () => void; kind?: 'primary' | 'secondary' | 'danger' | 'text';
  busy?: boolean; disabled?: boolean; icon?: IconName; style?: ViewStyle; testID?: string;
}) {
  const { colors, reduceMotion } = useTheme();
  const primary = kind === 'primary';
  const color = primary ? colors.background : kind === 'danger' ? colors.danger : colors.text;
  const alpha = useSharedValue(1);
  const face = useAnimatedStyle(() => ({ opacity: alpha.value }));
  return <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{ disabled: disabled || busy, busy }} disabled={disabled || busy}
    onPress={onPress} style={style} onPressIn={() => alpha.set(withTiming(0.75, { duration: reduceMotion ? 0 : 120 }))}
    onPressOut={() => alpha.set(withTiming(1, { duration: reduceMotion ? 0 : 120 }))}>
    <Animated.View style={[styles.button, face, {
      backgroundColor: primary ? colors.text : kind === 'text' ? 'transparent' : colors.surface,
      opacity: disabled ? 0.55 : undefined,
    }]}>
      {busy ? <ActivityIndicator color={color} /> : icon ? <Icon name={icon} size={18} color={color} /> : null}
      <Copy variant="small" style={{ color, fontWeight: '600', textAlign: 'center' }}>{label}</Copy>
    </Animated.View>
  </Pressable>;
}

export function IconButton({ label, name, selectedName, color, selectedColor, selected = false, onPress, disabled = false, testID, size = 24 }: {
  label: string; name: IconName; selectedName?: IconName; color?: string; selectedColor?: string;
  selected?: boolean; onPress: () => void; disabled?: boolean; testID?: string; size?: number;
}) {
  const { colors, reduceMotion } = useTheme();
  const scale = useSharedValue(1);
  const active = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    active.value = withTiming(selected ? 1 : 0, { duration: reduceMotion ? 0 : 180 });
  }, [active, reduceMotion, selected]);
  const face = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const inactiveStyle = useAnimatedStyle(() => ({ opacity: 1 - active.value }));
  const activeStyle = useAnimatedStyle(() => ({ opacity: active.value }));
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected, disabled }}
    testID={testID} onPress={onPress} disabled={disabled} style={styles.iconButton}
    onPressIn={() => scale.set(reduceMotion ? 1 : withTiming(0.89, { duration: 120 }))}
    onPressOut={() => scale.set(withTiming(1, { duration: reduceMotion ? 0 : 120 }))}>
    <Animated.View style={[styles.iconFace, face, disabled && { opacity: 0.55 }]}>
      {selectedName ? <>
        <Animated.View style={inactiveStyle}><Icon name={name} size={size} color={color ?? colors.muted} /></Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, activeStyle]}><Icon name={selectedName} size={size} color={selectedColor} /></Animated.View>
      </> : <Icon name={name} size={size} color={color ?? colors.muted} />}
    </Animated.View>
  </Pressable>;
}

export function Field({ icon, ...props }: TextInputProps & { icon?: IconName }) {
  const { colors } = useTheme();
  return <View style={[styles.field, icon ? styles.search : null, { backgroundColor: colors.surface }]}>
    {icon && <Icon name={icon} size={23} color={colors.muted} />}
    <TextInput {...props} accessibilityLabel={props.accessibilityLabel ?? props.placeholder}
      placeholderTextColor={colors.muted} selectionColor={colors.accent}
      style={[styles.fieldInput, { color: colors.text }, props.style]} />
  </View>;
}

export function Row({ icon, title, detail, onPress, right }: {
  icon?: IconName; title: string; detail?: string; onPress?: () => void; right?: ReactNode;
}) {
  const { colors } = useTheme();
  const content = <View style={[styles.option, { borderBottomColor: colors.line }]}>
    {icon && <Icon name={icon} color={colors.secondary} />}
    <View style={styles.fill}>
      <Copy>{title}</Copy>
      {detail ? <Copy variant="small" tone="muted">{detail}</Copy> : null}
    </View>
    {right ?? (onPress ? <Icon name="chevron-right" size={20} color={colors.muted} /> : null)}
  </View>;
  return onPress
    ? <Pressable accessibilityRole="button" accessibilityLabel={title} android_ripple={{ color: colors.raised }} onPress={onPress}>{content}</Pressable>
    : content;
}

export function Artwork({ uri, size = 44, radius = 4, hero = false }: {
  uri?: string | null; size?: number; radius?: number; hero?: boolean;
}) {
  const { colors, reduceMotion } = useTheme();
  return <View style={[
    styles.artwork, { backgroundColor: colors.surface, borderRadius: radius },
    hero ? StyleSheet.absoluteFill : { height: size, width: size },
  ]}>
    <Icon name={hero ? 'radio-tower' : 'music-note'} size={hero ? 66 : 23} color={colors.detail} />
    {uri ? <Image source={uri} accessible={false} style={StyleSheet.absoluteFill}
      contentFit="cover" transition={reduceMotion || !hero ? 0 : 220}
      recyclingKey={hero ? undefined : uri} cachePolicy="memory-disk" /> : null}
  </View>;
}

export function Fade({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { reduceMotion } = useTheme();
  const alpha = useSharedValue(reduceMotion ? 1 : 0);
  useEffect(() => { alpha.value = withTiming(1, { duration: reduceMotion ? 0 : 180 }); }, [alpha, reduceMotion]);
  const animated = useAnimatedStyle(() => ({ opacity: alpha.value }));
  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}

export function Feedback({ text, error = false }: { text: string; error?: boolean }) {
  return <Fade>
    <Copy accessibilityRole={error ? 'alert' : undefined} accessibilityLiveRegion="polite" variant="small"
      tone={error ? 'danger' : 'accent'}>{text}</Copy>
  </Fade>;
}

export function Empty({ title, detail, icon = 'music-note-outline', action }: {
  title: string; detail?: string; icon?: IconName; action?: ReactNode;
}) {
  const { colors } = useTheme();
  return <Fade style={styles.empty}>
    <Icon name={icon} size={32} color={colors.detail} />
    <Copy variant="track" style={styles.center}>{title}</Copy>
    {detail ? <Copy tone="muted" variant="small" style={styles.center}>{detail}</Copy> : null}
    {action}
  </Fade>;
}

export function Placeholder({ count = 3 }: { count?: number }) {
  const { colors } = useTheme();
  return <View accessibilityLabel="Wczytywanie" accessibilityRole="progressbar" style={styles.placeholders}>
    {Array.from({ length: count }, (_, index) => <View key={index} style={[styles.placeholder, { backgroundColor: colors.surface }]} />)}
  </View>;
}

export function Failure({ message, retry }: { message: string; retry?: () => void }) {
  return <Empty title="Nie udało się wczytać danych" detail={message} icon="alert-circle-outline"
    action={retry ? <Action label="Spróbuj ponownie" kind="secondary" onPress={retry} /> : undefined} />;
}

export function confirm(title: string, detail: string, action: () => void, label = 'Potwierdź') {
  Alert.alert(title, detail, [
    { text: 'Anuluj', style: 'cancel' },
    { text: label, style: 'destructive', onPress: action },
  ]);
}

export function useBar(value: number, duration: number) {
  const { reduceMotion } = useTheme();
  const scale = useSharedValue(value);
  useEffect(() => {
    scale.value = withTiming(value, { duration: reduceMotion ? 0 : duration, easing: Easing.out(Easing.quad) });
  }, [duration, reduceMotion, scale, value]);
  return useAnimatedStyle(() => ({ transform: [{ scaleX: scale.value }] }));
}

export const ui = {
  gap: { gap: 12 } as const,
  inline: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 } as const,
  fill: { flex: 1 } as const,
};
const typography = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700' },
  section: { fontSize: 24, fontWeight: '700' },
  track: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22 },
  small: { fontSize: 13, lineHeight: 18 },
  detail: { fontSize: 11, fontVariant: ['tabular-nums'] },
});
const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { textAlign: 'center' },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 24, marginTop: 4, marginBottom: 8, minHeight: 44 },
  backHeading: { paddingLeft: 8, gap: 0 },
  pageContent: { paddingHorizontal: 24, paddingBottom: 32, gap: 16 },
  field: { minHeight: 51, borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 6 },
  search: { minHeight: 42, borderRadius: 25, paddingHorizontal: 12 },
  fieldInput: { flex: 1, minHeight: 46, fontSize: 16, paddingVertical: Platform.OS === 'android' ? 8 : 0 },
  button: { minHeight: 50, borderRadius: 28, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  iconButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  iconFace: { alignItems: 'center', justifyContent: 'center' },
  option: { minHeight: 59, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 9 },
  artwork: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', gap: 9, paddingHorizontal: 24, paddingVertical: 36 },
  placeholders: { gap: 12, paddingVertical: 12 },
  placeholder: { height: 46, borderRadius: 5 },
});
