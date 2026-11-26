import { Stack } from 'expo-router';
import { useTheme } from '@/ui/theme';

export default function OptionsStack() {
  const { colors, reduceMotion } = useTheme();
  return <Stack screenOptions={{
    headerShown: false, contentStyle: { backgroundColor: colors.background },
    animation: reduceMotion ? 'none' : 'default',
  }} />;
}
