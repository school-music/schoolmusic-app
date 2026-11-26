import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';

const dark = {
  background: '#0B0D0F',
  surface: '#181A1B',
  raised: '#24282B',
  line: '#27292B',
  text: '#F2F4F6',
  secondary: '#CBCD D4'.replace(' ', ''),
  muted: '#A4A4A8',
  detail: '#9AA4B1',
  accent: '#50CFAC',
  favorite: '#CE4B65',
  danger: '#FF747E',
};

const contrast: typeof dark = {
  background: '#000000',
  surface: '#202225',
  raised: '#33373B',
  line: '#505256',
  text: '#FFFFFF',
  secondary: '#F0F0F3',
  muted: '#D1D2D7',
  detail: '#C7CFDB',
  accent: '#7CEBC9',
  favorite: '#FF7B92',
  danger: '#FFADB1',
};

const key = 'schoolmusic-style-v1';
const ThemeContext = createContext({
  colors: dark,
  highContrast: false,
  setHighContrast: (_value: boolean) => Promise.resolve(),
  reduceMotion: true,
});

export function ThemeProvider({ children }: PropsWithChildren) {
  const [highContrast, setContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    let active = true;
    const syncMotion = () => {
      void AccessibilityInfo.isReduceMotionEnabled()
        .then((value) => { if (active) setReduceMotion(value); })
        .catch(() => undefined);
    };
    void AsyncStorage.getItem(key).then((value) => { if (active) setContrast(value === 'high'); }).catch(() => undefined);
    const accessibility = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    const appState = AppState.addEventListener('change', (state) => { if (state === 'active') syncMotion(); });
    syncMotion();
    return () => {
      active = false;
      accessibility.remove();
      appState.remove();
    };
  }, []);

  async function setHighContrast(value: boolean) {
    await AsyncStorage.setItem(key, value ? 'high' : 'dark');
    setContrast(value);
  }

  return <ThemeContext.Provider value={{ colors: highContrast ? contrast : dark, highContrast, setHighContrast, reduceMotion }}>
    {children}
  </ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
