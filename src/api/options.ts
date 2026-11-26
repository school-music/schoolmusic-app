import type { makeClient } from './client';

export function request(client: ReturnType<typeof makeClient>, signal?: AbortSignal) {
  return { client, signal, throwOnError: true, responseStyle: 'data' } as const;
}
