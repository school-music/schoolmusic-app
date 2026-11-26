import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { useTheme } from './theme';

const particles = Array.from({ length: 8 }, (_, index) => {
  const angle = index * Math.PI / 4 - Math.PI / 8;
  const distance = index % 2 ? 25 : 35;
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, rotation: index * 37 };
});

function Particle({ progress, index, color, vector }: {
  progress: SharedValue<number>; index: number; color: string; vector: typeof particles[number];
}) {
  const { x, y, rotation } = vector;
  const motion = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.13, 0.5, 1], [0, 1, 0.85, 0]),
    transform: [
      { translateX: x * progress.value },
      { translateY: y * progress.value + 8 * progress.value ** 2 },
      { rotate: rotation + 110 * progress.value + 'deg' },
    ],
  }));
  return <Animated.View style={[styles.particle, { backgroundColor: color, height: index % 2 ? 3 : 6 }, motion]} />;
}

export function ReactionBurst({ celebrate, color, children }: { celebrate: boolean; color: string; children: ReactNode }) {
  const { colors, reduceMotion } = useTheme();
  const progress = useSharedValue(1);
  useEffect(() => {
    progress.set(1);
    if (celebrate && !reduceMotion) {
      progress.set(0);
      progress.set(withTiming(1, { duration: 460, easing: Easing.out(Easing.cubic) }));
    }
  }, [celebrate, progress, reduceMotion]);
  const pop = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 0.28, 0.62, 1], [1, 1.19, 0.98, 1]) }],
  }));
  return <View style={celebrate && !reduceMotion ? styles.foreground : undefined}>
    <Animated.View style={pop}>{children}</Animated.View>
    {celebrate && !reduceMotion ? <View pointerEvents="none" accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants" style={styles.overlay}>
      {particles.map((vector, index) => <Particle key={index} index={index} progress={progress} vector={vector}
        color={index % 3 ? color : colors.text} />)}
    </View> : null}
  </View>;
}

const styles = StyleSheet.create({
  foreground: { zIndex: 1 },
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  particle: { position: 'absolute', width: 3, borderRadius: 1 },
});
