import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SessionProvider, useSession } from '@/session';
import { ThemeProvider, useTheme } from '@/ui/theme';

function Routes() {
  const { session, loading } = useSession();
  const { colors, reduceMotion } = useTheme();

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
    <ActivityIndicator color={colors.text} accessibilityLabel="Wczytywanie sesji" />
  </View>;

  return <Stack screenOptions={{
    headerShown: false,
    contentStyle: { backgroundColor: colors.background },
    animation: reduceMotion ? 'none' : 'fade',
  }}>
    <Stack.Protected guard={!session}><Stack.Screen name="(auth)" /></Stack.Protected>
    <Stack.Protected guard={Boolean(session)}><Stack.Screen name="(tabs)" /></Stack.Protected>
  </Stack>;
}

export default function Root() {
  return <ThemeProvider>
    <SessionProvider>
      <StatusBar style="light" />
      <Routes />
    </SessionProvider>
  </ThemeProvider>;
}
