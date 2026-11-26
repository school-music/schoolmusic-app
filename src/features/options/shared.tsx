import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { errorText, type makeClient } from '@/api/client';
import * as sdk from '@/api/generated/sdk.gen';
import { request } from '@/api/options';
import { useApiMutation, usePages } from '@/api/query';
import { Action, Empty, Failure, Fade, Feedback, Field, Placeholder, Row, confirm, ui } from '@/ui/components';
import { useDebounce } from '@/ui/use-debounce';

type Client = ReturnType<typeof makeClient>;
export type Task = (client: Client) => Promise<unknown>;

export function useTask(invalidate: readonly (readonly unknown[])[]) {
  return useApiMutation((client, task: Task) => task(client), [...invalidate]);
}

type TaskState = ReturnType<typeof useTask>;

export function Result({ task, success = 'Zmiany zapisane.' }: { task: TaskState; success?: string }) {
  return task.error ? <Feedback error text={errorText(task.error)} />
    : task.isSuccess ? <Feedback text={success} /> : null;
}

export function Load<T>({ query, children }: {
  query: { data: T | undefined; error: unknown; isPending: boolean; refetch: () => unknown };
  children: (data: T) => ReactNode;
}) {
  if (query.isPending) return <Placeholder />;
  if (query.data === undefined) return <Failure message={errorText(query.error)} retry={() => { void query.refetch(); }} />;
  return <Fade>{children(query.data)}</Fade>;
}

export function Collection<T>({ items, empty, itemKey, render }: {
  items: T[]; itemKey: (item: T) => string | number; empty: string;
  render: (item: T, index: number) => ReactNode;
}) {
  if (!items.length) return <Empty title={empty} />;
  return <View style={styles.collection}>
    {items.map((item, index) => <View key={itemKey(item)} style={ui.gap}>{render(item, index)}</View>)}
  </View>;
}

export function More({ query }: {
  query: { hasNextPage: boolean; isFetchingNextPage: boolean; fetchNextPage: () => unknown };
}) {
  return query.hasNextPage ? <Action label="Pokaż więcej" kind="secondary" busy={query.isFetchingNextPage}
    onPress={() => { void query.fetchNextPage(); }} /> : null;
}

export function Remove({ label, detail, disabled, action }: {
  label: string; detail: string; disabled: boolean; action: () => void;
}) {
  return <Action label={label} kind="danger" disabled={disabled}
    onPress={() => confirm(label + '?', detail, action, label)} />;
}

export function TrackPicker({ title, onSelect, busy = false }: {
  title: string; busy?: boolean; onSelect: (row: { id: number; title: string; artistId: number; artistName: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const search = useDebounce(input.trim());
  const query = usePages(['tracks', 'picker', search], (client, signal, page) => sdk.tracks({
    ...request(client, signal), query: { page, pageSize: 12, search },
  }), open && search.length > 0);
  return <View style={ui.gap}>
    <Action kind="secondary" label={open ? 'Zamknij wybór' : title} onPress={() => setOpen(!open)} />
    {open ? <>
      <Field icon="magnify" placeholder="Tytuł lub wykonawca" value={input} onChangeText={setInput} />
      {search ? <Load query={query}>{(data) => <>
        <Collection items={data.pages.flatMap((page) => page.items)} itemKey={(item) => item.id} empty="Brak pasujących utworów"
          render={(item) => <Row title={item.title} detail={item.artistName} onPress={busy ? undefined : () => onSelect(item)} />} />
        <More query={query} />
      </>}</Load> : null}
    </> : null}
  </View>;
}

export function hasTime(text: string) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(text);
}
export function apiTime(text: string) {
  return text.length === 5 ? text + ':00' : text;
}
export function hasDate(text: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const date = new Date(text + 'T12:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === text;
}
export function isWebUrl(text: string) {
  try { return ['https:', 'http:'].includes(new URL(text).protocol); }
  catch { return false; }
}

const styles = StyleSheet.create({ collection: { gap: 16 } });
