import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/ui/components';
import { useTheme } from '@/ui/theme';

const tabs: Record<string, { title: string; icon: IconName }> = {
  index: { title: 'Radio', icon: 'playlist-music' },
  vote: { title: 'Głosuj', icon: 'chart-box-outline' },
  favorites: { title: 'Ulubione', icon: 'heart-outline' },
  options: { title: 'Opcje', icon: 'account-outline' },
};

function TabIcon({ title, icon, selected, onPress }: { title: string; icon: IconName; selected: boolean; onPress: () => void }) {
  const { colors, reduceMotion } = useTheme();
  const active = useSharedValue(selected ? 1 : 0);
  useEffect(() => { active.value = withTiming(selected ? 1 : 0, { duration: reduceMotion ? 0 : 120 }); }, [active, reduceMotion, selected]);
  const animated = useAnimatedStyle(() => ({ opacity: active.value }));
  return <Pressable accessibilityRole="tab" accessibilityLabel={title} accessibilityState={{ selected }}
    testID={'tab-' + title} onPress={onPress} style={styles.tab}>
    <View>
      <Icon name={icon} size={30} color={colors.muted} />
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, animated]}>
        <Icon name={icon} size={30} color={colors.text} />
      </Animated.View>
    </View>
  </Pressable>;
}

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={{ headerShown: false, animation: 'none', sceneStyle: { backgroundColor: colors.background } }}
    tabBar={({ state, emitter, navigateToTab }) => <View accessibilityRole="tablist" style={[styles.bar, {
      paddingBottom: Math.max(insets.bottom, 4), paddingLeft: insets.left + 8, paddingRight: insets.right + 8,
      backgroundColor: colors.background, borderTopColor: colors.line,
    }]}>
      {state.routes.map((route, index) => {
        const tab = tabs[route.name];
        if (!tab) return null;
        const selected = index === state.index;
        return <TabIcon key={route.key} {...tab} selected={selected} onPress={() => {
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!selected && !event.defaultPrevented) navigateToTab(route.key);
        }} />;
      })}
    </View>}>
    <Tabs.Screen name="index" options={{ title: 'Radio' }} />
    <Tabs.Screen name="vote" options={{ title: 'Głosuj' }} />
    <Tabs.Screen name="favorites" options={{ title: 'Ulubione' }} />
    <Tabs.Screen name="options" options={{ title: 'Opcje' }} />
  </Tabs>;
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 5 },
  tab: { flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center' },
});
