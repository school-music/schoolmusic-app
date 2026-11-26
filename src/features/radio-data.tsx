import { HubConnectionBuilder } from '@microsoft/signalr';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { apiUrl } from '@/api/client';
import { systemStatusOptions } from '@/api/generated/@tanstack/react-query.gen';
import * as sdk from '@/api/generated/sdk.gen';
import { request } from '@/api/options';
import { useApiQuery } from '@/api/query';
import { schoolDate, selectVotingBreak } from '@/domain';
import { useSession } from '@/session';

export function useForeground() {
  const [active, setActive] = useState(AppState.currentState === 'active' || AppState.currentState == null);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => setActive(state === 'active'));
    return () => subscription.remove();
  }, []);
  return active;
}

export const statusKey = [{ _id: 'systemStatus' }] as const;

export function useStatus(connected = false) {
  const { client } = useSession();
  return useQuery({
    ...systemStatusOptions({ client }),
    staleTime: 10_000, refetchInterval: connected ? 45_000 : 12_000,
  });
}

export function useVotingTarget(status: ReturnType<typeof useStatus>) {
  const date = status.data?.serverTime.slice(0, 10) || schoolDate();
  const schedule = useApiQuery(['schedule', date], (client, signal) => sdk.calendar({
    ...request(client, signal), query: { from: date, to: date },
  }), { staleTime: 30_000 });
  const breaks = useApiQuery(['breaks', date], (client, signal) => sdk.breaks({
    ...request(client, signal), query: { date },
  }), { staleTime: 30_000 });
  const day = schedule.data?.days.find((item) => item.date === date);
  const allowed = day?.isSchoolDay
    ? day.breaks.filter((item) => item.isMusicEnabled).map((item) => item.breakNumber)
    : [];
  const timestamp = status.data?.serverTime;
  const target = timestamp ? selectVotingBreak(breaks.data?.przerwy ?? [], allowed, timestamp) : undefined;
  const activeBreak = status.data?.currentState === 'Break'
    ? breaks.data?.przerwy.find((entry) => entry.breakNumber === status.data?.currentBreakNumber)
    : undefined;
  return {
    target,
    activeBreak,
    loading: status.isPending || schedule.isPending || breaks.isPending,
    error: status.error ?? schedule.error ?? breaks.error,
    retry: () => { void Promise.all([status.refetch(), schedule.refetch(), breaks.refetch()]); },
  };
}

export function useRadioConnection(breakId: number | undefined, active: boolean) {
  const cache = useQueryClient();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!apiUrl || !active) return;
    let disposed = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const hub = new HubConnectionBuilder().withUrl(apiUrl + '/hubs/queue').withAutomaticReconnect().build();
    const refreshStatus = () => { void cache.invalidateQueries({ queryKey: statusKey }); };
    const refreshQueue = () => {
      refreshStatus();
      void cache.invalidateQueries({ queryKey: breakId == null ? ['queue'] : ['queue', breakId] });
    };
    const refreshSchool = () => {
      refreshStatus();
      void cache.invalidateQueries({ queryKey: ['schedule'] });
      void cache.invalidateQueries({ queryKey: ['breaks'] });
    };
    const subscribe = async () => {
      await hub.invoke('JoinKiosk');
      if (breakId != null) await hub.invoke('JoinBreak', breakId);
      if (!disposed) { setConnected(true); refreshQueue(); }
    };
    const retryStart = () => {
      if (disposed) return;
      if (retry) clearTimeout(retry);
      retry = setTimeout(() => { void start(); }, 10_000);
    };
    async function start() {
      if (disposed) return;
      try {
        await hub.start();
        if (!disposed) await subscribe();
      } catch {
        await hub.stop().catch(() => undefined);
        retryStart();
      }
    }

    hub.on('QueueUpdated', refreshQueue);
    hub.on('PlaybackStatusChanged', refreshStatus);
    hub.on('NowPlayingChanged', refreshStatus);
    hub.on('SchoolStatusChanged', refreshSchool);
    hub.onreconnecting(() => { if (!disposed) setConnected(false); });
    hub.onreconnected(() => { void subscribe().catch(() => { if (!disposed) setConnected(false); }); });
    hub.onclose(() => {
      if (!disposed) { setConnected(false); retryStart(); }
    });
    void start();
    return () => {
      disposed = true;
      setConnected(false);
      if (retry) clearTimeout(retry);
      void hub.stop().catch(() => undefined);
    };
  }, [active, breakId, cache]);

  return connected;
}
