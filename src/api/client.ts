import { Platform } from 'react-native';
import { createClient } from './generated/client';

const devUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const localBuild = __DEV__ || process.env.EXPO_PUBLIC_SCHOOLMUSIC_LOCAL === '1';

function getApiUrl() {
  const value = configuredUrl || (localBuild ? devUrl : '');
  if (!value) return undefined;
  try {
    const url = new URL(value);
    const valid = !url.username && !url.password && !url.search && !url.hash
      && (url.protocol === 'https:' || (localBuild && url.protocol === 'http:'));
    return valid ? url.href.replace(/\/$/, '') : undefined;
  } catch {
    return undefined;
  }
}

export const apiUrl = getApiUrl();

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function serverMessage(error: unknown) {
  let value = error;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return undefined; }
  }
  if (!value || typeof value !== 'object') return undefined;
  for (const key of ['message', 'Message', 'detail', 'title']) {
    const field = (value as Record<string, unknown>)[key];
    if (typeof field === 'string' && field.trim()) return field;
  }
  return undefined;
}

export function errorText(error: unknown) {
  if (error instanceof ApiError || (error instanceof Error && !(error instanceof TypeError))) return error.message;
  return 'Sprawdź połączenie z radiowęzłem i spróbuj ponownie.';
}

export function makeClient(token?: string) {
  const client = createClient({
    baseUrl: apiUrl ?? 'https://schoolmusic.invalid',
    auth: token,
    headers: token ? { Authorization: 'Bearer ' + token } : undefined,
    throwOnError: true,
    responseStyle: 'data',
  });
  client.interceptors.request.use((request) => {
    if (!apiUrl) throw new ApiError(0, 'Skonfiguruj adres API SchoolMusic.');
    return request;
  });
  client.interceptors.error.use((error, response) => {
    const status = response?.status ?? 0;
    const fallback = status === 401 ? 'Sprawdź login i hasło.'
      : status === 403 ? 'Brak uprawnień do tej operacji.'
      : status === 404 ? 'Nie znaleziono danych.'
      : status === 409 ? 'Dane zmieniły się. Spróbuj ponownie.'
      : status >= 500 ? 'Usługa jest chwilowo niedostępna.'
      : 'Nie udało się wykonać operacji.';
    return new ApiError(status, serverMessage(error) ?? fallback);
  });
  return client;
}

export const publicClient = makeClient();
