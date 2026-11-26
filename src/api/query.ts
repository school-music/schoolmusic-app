import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/session';
import type { makeClient } from './client';

type Client = ReturnType<typeof makeClient>;
type Request<T> = (client: Client, signal: AbortSignal) => Promise<T>;
type QueryKey = readonly unknown[];

export function useApiQuery<T>(key: QueryKey, request: Request<T>, options?: {
  enabled?: boolean; refetchInterval?: number | false; staleTime?: number;
}) {
  const { client } = useSession();
  return useQuery({
    queryKey: key,
    queryFn: ({ signal }) => request(client, signal),
    ...options,
  });
}

export function usePages<T extends { totalPages: number }>(
  key: QueryKey,
  request: (client: Client, signal: AbortSignal, page: number) => Promise<T>,
  enabled = true,
) {
  const { client } = useSession();
  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ signal, pageParam }) => request(client, signal, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last, _pages, requestedPage) => requestedPage < last.totalPages ? requestedPage + 1 : undefined,
    enabled,
  });
}

export function useApiMutation<T, V>(
  request: (client: Client, variables: V) => Promise<T>,
  invalidate: readonly QueryKey[],
) {
  const { client } = useSession();
  const cache = useQueryClient();
  return useMutation({
    mutationFn: (variables: V) => request(client, variables),
    onSettled: async () => {
      await Promise.all(invalidate.map((queryKey) => cache.invalidateQueries({ queryKey })));
    },
  });
}
