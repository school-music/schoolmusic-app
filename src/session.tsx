import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import { ApiError, apiUrl, makeClient } from '@/api/client';
import type { MobileLogin } from '@/api/generated';
import { tokenExpiry } from '@/domain';

type Session = MobileLogin & { expiresAt: number; displayName?: string };
const secureKey = 'schoolmusic-session-v1';
const accountKey = (id: number) => 'schoolmusic-profile:' + apiUrl + ':' + id;

type SessionValue = {
  session: Session | null; loading: boolean; client: ReturnType<typeof makeClient>;
  signIn: (profile: MobileLogin, displayName?: string) => Promise<void>; signOut: () => Promise<void>;
};
const SessionContext = createContext<SessionValue | undefined>(undefined);

function newCache() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15_000,
        retry: (count, error) => count < 1 && (!(error instanceof ApiError) || error.status >= 500),
      },
      mutations: { retry: false },
    },
  });
}

function useNetworkLifecycle() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => focusManager.setFocused(state === 'active'));
    onlineManager.setEventListener((setOnline) => {
      const network = Network.addNetworkStateListener((state) => setOnline(state.isConnected !== false && state.isInternetReachable !== false));
      return () => network.remove();
    });
    return () => subscription.remove();
  }, []);
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState(newCache);
  const currentToken = useRef<string | null>(null);
  const writes = useRef(Promise.resolve());
  useNetworkLifecycle();

  const persist = useCallback((work: () => Promise<void>) => {
    const next = writes.current.then(work, work);
    writes.current = next.catch(() => undefined);
    return next;
  }, []);

  const clearSession = useCallback(async () => {
    currentToken.current = null;
    setSession(null);
    cache.clear();
    setCache(newCache());
    await persist(() => SecureStore.deleteItemAsync(secureKey));
  }, [cache, persist]);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const raw = await SecureStore.getItemAsync(secureKey);
        if (!raw || !active) return;
        const saved: { api: string; profile: Session } = JSON.parse(raw);
        const expiresAt = tokenExpiry(saved.profile.jwtSecurityToken);
        if (saved.api === apiUrl && expiresAt && expiresAt > Date.now()) {
          currentToken.current = saved.profile.jwtSecurityToken;
          setSession({ ...saved.profile, expiresAt });
        } else {
          await persist(() => SecureStore.deleteItemAsync(secureKey));
        }
      } catch {
        if (active) setSession(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    void restore();
    return () => { active = false; };
  }, [persist]);

  async function signIn(profile: MobileLogin, displayName?: string) {
    const expiresAt = tokenExpiry(profile.jwtSecurityToken);
    if (!expiresAt || expiresAt <= Date.now() || !profile.userId || !profile.role || !profile.username) {
      throw new Error('Serwer zwrócił nieprawidłową sesję.');
    }
    if (displayName) await AsyncStorage.setItem(accountKey(profile.userId), displayName);
    const localName = displayName ?? (await AsyncStorage.getItem(accountKey(profile.userId))) ?? undefined;
    const next = { ...profile, expiresAt, displayName: localName };
    await persist(() => SecureStore.setItemAsync(secureKey, JSON.stringify({ api: apiUrl, profile: next })));
    currentToken.current = profile.jwtSecurityToken;
    cache.clear();
    setCache(newCache());
    setSession(next);
  }

  useEffect(() => {
    if (!session) return;
    const check = () => {
      if (currentToken.current === session.jwtSecurityToken && session.expiresAt <= Date.now()) {
        void clearSession().catch(() => undefined);
      }
    };
    const timeout = setTimeout(check, Math.max(0, Math.min(2_147_483_647, session.expiresAt - Date.now())));
    const subscription = AppState.addEventListener('change', check);
    return () => { clearTimeout(timeout); subscription.remove(); };
  }, [clearSession, session]);

  const token = session?.jwtSecurityToken;
  const client = useMemo(() => makeClient(token), [token]);

  useEffect(() => {
    if (!token) return;
    const interceptor = client.interceptors.response.use((response) => {
      if (response.status === 401 && currentToken.current === token) {
        void clearSession().catch(() => undefined);
      }
      return response;
    });
    return () => client.interceptors.response.eject(interceptor);
  }, [clearSession, client, token]);

  return <QueryClientProvider client={cache}>
    <SessionContext.Provider value={{ session, loading, client, signIn, signOut: clearSession }}>
      {children}
    </SessionContext.Provider>
  </QueryClientProvider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('Missing SessionProvider');
  return context;
}
