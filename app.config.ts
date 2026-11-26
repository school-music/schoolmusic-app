import type { ConfigContext, ExpoConfig } from 'expo/config';

export default function configure({ config }: ConfigContext): ExpoConfig {
  const local = process.env.SCHOOLMUSIC_LOCAL_BUILD === '1' || process.env.NODE_ENV !== 'production';

  return {
    ...config,
    name: 'SchoolMusic',
    slug: 'schoolmusic',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'dark',
    backgroundColor: '#0b0d0f',
    scheme: 'schoolmusic',
    ios: {
      bundleIdentifier: local ? 'pl.schoolmusic.app.dev' : 'pl.schoolmusic.app',
      infoPlist: local ? { NSAppTransportSecurity: { NSAllowsLocalNetworking: true } } : {},
      supportsTablet: true,
    },
    android: {
      package: local ? 'pl.schoolmusic.app.dev' : 'pl.schoolmusic.app',
      adaptiveIcon: { backgroundColor: '#0b0d0f' },
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      ['expo-build-properties', { android: { usesCleartextTraffic: local } }],
    ],
    experiments: { typedRoutes: true },
  };
}
