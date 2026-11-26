import { useState } from 'react';
import { View } from 'react-native';
import type { MobileBreak, MobileEvent, MobileTemplate } from '@/api/generated';
import * as sdk from '@/api/generated/sdk.gen';
import { request } from '@/api/options';
import { useApiQuery } from '@/api/query';
import { schoolDate, timeLabel } from '@/domain';
import { Action, Copy, Empty, Field, Row, confirm, ui } from '@/ui/components';
import { Collection, Load, Remove, Result, TrackPicker, apiTime, hasDate, hasTime, isWebUrl, useTask } from './shared';

import { statusKey } from '../radio-data';

const scheduleKeys = [['weekly'], ['weekly-breaks'], ['templates'], ['breaks'], ['schedule'], statusKey];

export function Weekly() {
  const [weekday, setWeekday] = useState(1);
  const weekly = useApiQuery(['weekly'], (client, signal) => sdk.weekly(request(client, signal)));
  const breaks = useApiQuery(['weekly-breaks', weekday], (client, signal) => sdk.weeklyBreaks({
    ...request(client, signal), path: { weekday },
  }));
  const task = useTask(scheduleKeys);

  return <>
    <Result task={task} />
    <Load query={weekly}>{(days) => {
      const selected = days.find((entry) => entry.weekday === weekday);
      return <>
        <View style={ui.inline}>{days.map((day) => <Action key={day.weekday} label={day.dayName}
          kind={day.weekday === weekday ? 'primary' : 'secondary'} onPress={() => setWeekday(day.weekday)} />)}</View>
        {selected ? <Row title={selected.dayName} detail={selected.musicEnabled ? 'Muzyka włączona' : 'Muzyka wyłączona'}
          right={<Action label={selected.musicEnabled ? 'Wyłącz' : 'Włącz'} kind="secondary" disabled={task.isPending}
            onPress={() => task.mutate((client) => sdk.updateWeekday({
              ...request(client), path: { weekday }, body: { musicEnabled: !selected.musicEnabled },
            }))} />} /> : null}
      </>;
    }}</Load>
    <Load query={breaks}>{({ breaks: items }) => <Collection items={items} itemKey={(item) => item.breakNumber}
      empty="Brak przerw" render={(item) => <Row title={'Przerwa ' + item.breakNumber}
        detail={[timeLabel(item.startsTime) + '–' + timeLabel(item.endsTime),
          item.musicEnabled ? 'Muzyka włączona' : 'Muzyka wyłączona',
          item.isOverridden ? 'Ustawienie przerwy' : 'Ustawienie dnia'].join(' · ')}
        right={<Action label={item.musicEnabled ? 'Wyłącz' : 'Włącz'} kind="secondary" disabled={task.isPending}
          onPress={() => task.mutate((client) => sdk.updateWeeklyBreak({
            ...request(client), path: { weekday, breakNo: item.breakNumber }, body: { musicEnabled: !item.musicEnabled },
          }))} />} />} />}</Load>
  </>;
}

function TemplateForm({ entry, onClose }: { entry?: MobileTemplate; onClose: () => void }) {
  const [number, setNumber] = useState(entry ? String(entry.breakNumber) : '');
  const [start, setStart] = useState(timeLabel(entry?.startsTime));
  const [end, setEnd] = useState(timeLabel(entry?.endsTime));
  const task = useTask(scheduleKeys);
  const valid = /^\d{1,3}$/.test(number) && +number >= 1 && +number <= 127 && hasTime(start) && hasTime(end) && apiTime(start) < apiTime(end);

  return <View style={ui.gap}>
    <Copy variant="track">{entry ? 'Edytuj szablon' : 'Nowy szablon'}</Copy>
    <Field placeholder="Numer przerwy" value={number} onChangeText={setNumber} keyboardType="number-pad" />
    <Field placeholder="Początek (GG:MM)" value={start} onChangeText={setStart} autoCapitalize="none" />
    <Field placeholder="Koniec (GG:MM)" value={end} onChangeText={setEnd} autoCapitalize="none" />
    <Result task={task} />
    <View style={ui.inline}>
      <Action label="Zapisz szablon" disabled={!valid} busy={task.isPending} onPress={() => {
        const body = { breakNumber: +number, startsTime: apiTime(start), endsTime: apiTime(end) };
        task.mutate((client) => entry ? sdk.updateTemplate({ ...request(client), path: { id: entry.id }, body })
          : sdk.createTemplate({ ...request(client), body }), { onSuccess: onClose });
      }} />
      <Action label="Anuluj" kind="text" onPress={onClose} disabled={task.isPending} />
    </View>
  </View>;
}

export function Templates() {
  const [form, setForm] = useState<{ entry?: MobileTemplate }>();
  const templates = useApiQuery(['templates'], (client, signal) => sdk.templates(request(client, signal)));
  const task = useTask(scheduleKeys);
  return <>
    {form ? <TemplateForm key={form.entry?.id ?? 'new'} entry={form.entry} onClose={() => setForm(undefined)} />
      : <Action label="Dodaj szablon" kind="secondary" onPress={() => setForm({})} />}
    <Result task={task} />
    <Load query={templates}>{(data) => <Collection items={data} itemKey={(item) => item.id}
      empty="Brak szablonów" render={(item) => <>
        <Row title={'Przerwa ' + item.breakNumber} detail={timeLabel(item.startsTime) + '–' + timeLabel(item.endsTime)} />
        <View style={ui.inline}>
          <Action label="Edytuj" kind="secondary" onPress={() => setForm({ entry: item })} />
          <Remove label="Usuń szablon" detail={'Przerwa ' + item.breakNumber} disabled={task.isPending}
            action={() => task.mutate((client) => sdk.deleteTemplate({ ...request(client), path: { id: item.id } }))} />
        </View>
      </>} />}</Load>
  </>;
}

function BaseBreakForm({ entry, onClose }: { entry: MobileBreak; onClose: () => void }) {
  const [start, setStart] = useState(timeLabel(entry.startAt));
  const [end, setEnd] = useState(timeLabel(entry.endsAt));
  const [cutoff, setCutoff] = useState(timeLabel(entry.voteEnds));
  const task = useTask(scheduleKeys);
  const valid = hasTime(start) && hasTime(end) && apiTime(start) < apiTime(end)
    && (!cutoff || (hasTime(cutoff) && apiTime(cutoff) <= apiTime(start)));
  return <>
    <Copy variant="track">{'Przerwa ' + entry.breakNumber}</Copy>
    <Field placeholder="Początek (GG:MM)" value={start} onChangeText={setStart} />
    <Field placeholder="Koniec (GG:MM)" value={end} onChangeText={setEnd} />
    <Field placeholder="Koniec głosowania (GG:MM)" value={cutoff} onChangeText={setCutoff} />
    <Result task={task} />
    <View style={ui.inline}>
      <Action label="Zapisz godzinę przerwy" disabled={!valid} busy={task.isPending} onPress={() => task.mutate(
        (client) => sdk.updateBaseBreaks({ ...request(client), body: [{ id: entry.id,
          startAt: apiTime(start), endsAt: apiTime(end), voteEnds: cutoff ? apiTime(cutoff) : undefined }] }),
        { onSuccess: onClose },
      )} />
      <Action label="Anuluj" kind="text" onPress={onClose} disabled={task.isPending} />
    </View>
  </>;
}

export function BaseBreaks() {
  const [selected, setSelected] = useState<MobileBreak>();
  const date = '2026-01-01';
  const breaks = useApiQuery(['breaks', date], (client, signal) => sdk.breaks({
    ...request(client, signal), query: { date },
  }));
  return <>
    {selected ? <BaseBreakForm key={selected.id} entry={selected} onClose={() => setSelected(undefined)} /> : null}
    <Load query={breaks}>{({ przerwy }) => <Collection items={przerwy} itemKey={(item) => item.id} empty="Brak przerw bazowych"
      render={(item) => <Row title={'Przerwa ' + item.breakNumber} detail={timeLabel(item.startAt) + '–' + timeLabel(item.endsAt)}
        onPress={() => setSelected(item)} />} />}</Load>
  </>;
}

export function Exceptions() {
  const [kind, setKind] = useState<'day' | 'break'>('day');
  const [adding, setAdding] = useState(false);
  const [from, setFrom] = useState(schoolDate);
  const [to, setTo] = useState('');
  const [number, setNumber] = useState('');
  const [description, setDescription] = useState('');
  const [dayOff, setDayOff] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const days = useApiQuery(['exceptions', 'days'], (client, signal) => sdk.exceptionDays(request(client, signal)),
    { enabled: kind === 'day' });
  const breaks = useApiQuery(['exceptions', 'breaks'], (client, signal) => sdk.exceptionBreaks(request(client, signal)),
    { enabled: kind === 'break' });
  const task = useTask([['exceptions'], ...scheduleKeys]);
  const valid = hasDate(from) && (kind === 'day' ? (!to || (hasDate(to) && to >= from))
    : /^\d{1,3}$/.test(number) && +number >= 1 && +number <= 127);

  function submit() {
    task.mutate((client) => kind === 'day' ? sdk.createExceptionDay({
      ...request(client), body: { startDate: from, endDate: to || from,
        dayType: dayOff ? 'day_off' : 'no_music', description: description.trim() || null },
    }) : sdk.createExceptionBreak({
      ...request(client), body: { breakDate: from, breakNumber: +number, musicEnabled, description: description.trim() || null },
    }), { onSuccess: () => { setAdding(false); setDescription(''); } });
  }

  return <>
    <View style={ui.inline}>
      <Action label="Dni" kind={kind === 'day' ? 'primary' : 'secondary'} onPress={() => { setKind('day'); setAdding(false); }} />
      <Action label="Przerwy" kind={kind === 'break' ? 'primary' : 'secondary'} onPress={() => { setKind('break'); setAdding(false); }} />
    </View>
    <Action label={adding ? 'Zamknij formularz' : 'Dodaj wyjątek'} kind="secondary" onPress={() => setAdding(!adding)} />
    {adding ? <>
      <Field placeholder="Data (RRRR-MM-DD)" value={from} onChangeText={setFrom} />
      {kind === 'day' ? <>
        <Field placeholder="Data końcowa (opcjonalna)" value={to} onChangeText={setTo} />
        <View style={ui.inline}>
          <Action label="Dzień bez muzyki" kind={!dayOff ? 'primary' : 'secondary'} onPress={() => setDayOff(false)} />
          <Action label="Dzień wolny" kind={dayOff ? 'primary' : 'secondary'} onPress={() => setDayOff(true)} />
        </View>
      </> : <>
        <Field placeholder="Numer przerwy" value={number} onChangeText={setNumber} keyboardType="number-pad" />
        <View style={ui.inline}>
          <Action label="Wycisz muzykę" kind={!musicEnabled ? 'primary' : 'secondary'} onPress={() => setMusicEnabled(false)} />
          <Action label="Włącz muzykę" kind={musicEnabled ? 'primary' : 'secondary'} onPress={() => setMusicEnabled(true)} />
        </View>
      </>}
      <Field placeholder="Opis (opcjonalny)" value={description} onChangeText={setDescription} />
      <Action label="Zapisz wyjątek" busy={task.isPending} disabled={!valid} onPress={submit} />
    </> : null}
    <Result task={task} />
    {kind === 'day' ? <Load query={days}>{({ exceptions }) => <Collection items={exceptions} itemKey={(item) => item.id}
      empty="Brak wyjątkowych dni" render={(item) => <>
        <Row title={item.startDate + ' – ' + item.endDate} detail={item.description || (item.dayType === 'day_off' ? 'Dzień wolny' : 'Bez muzyki')} />
        <Remove label="Usuń wyjątek" detail={item.startDate} disabled={task.isPending}
          action={() => task.mutate((client) => sdk.deleteExceptionDay({ ...request(client), path: { id: item.id } }))} />
      </>} />}</Load> : <Load query={breaks}>{({ exceptionBreaks }) => <Collection items={exceptionBreaks} itemKey={(item) => item.id}
        empty="Brak wyjątkowych przerw" render={(item) => <>
          <Row title={item.breakDate + ' · Przerwa ' + item.breakNumber}
            detail={item.description || (item.musicEnabled ? 'Muzyka włączona' : 'Muzyka wyciszona')} />
          <Remove label="Usuń wyjątek" detail={item.breakDate} disabled={task.isPending}
            action={() => task.mutate((client) => sdk.deleteExceptionBreak({ ...request(client), path: { id: item.id } }))} />
        </>} />}</Load>}
  </>;
}

const eventStatuses = [
  { code: 'pending', label: 'Zaplanowane' }, { code: 'playing', label: 'Odtwarzane' }, { code: 'done', label: 'Zakończone' },
];

function EventForm({ entry, onClose }: { entry?: MobileEvent; onClose: () => void }) {
  const [title, setTitle] = useState(entry?.title ?? '');
  const [url, setUrl] = useState(entry?.fileUrl ?? '');
  const [date, setDate] = useState(entry?.startsAt.slice(0, 10) ?? schoolDate());
  const [time, setTime] = useState(timeLabel(entry?.startsAt));
  const [status, setStatus] = useState(entry?.eventStatus ?? 'pending');
  const task = useTask([['events'], ...scheduleKeys]);
  const valid = isWebUrl(url.trim()) && hasDate(date) && hasTime(time);

  return <>
    <Copy variant="track">{entry ? 'Edytuj wydarzenie' : 'Nowe wydarzenie'}</Copy>
    <Field placeholder="Tytuł (opcjonalny)" value={title} onChangeText={setTitle} />
    <Field placeholder="Adres URL dźwięku" value={url} onChangeText={setUrl} autoCapitalize="none" keyboardType="url" />
    <Field placeholder="Data (RRRR-MM-DD)" value={date} onChangeText={setDate} />
    <Field placeholder="Godzina szkolna (GG:MM)" value={time} onChangeText={setTime} />
    <View style={ui.inline}>{eventStatuses.map((item) => <Action key={item.code} label={item.label}
      kind={item.code === status ? 'primary' : 'secondary'} onPress={() => setStatus(item.code)} />)}</View>
    <Result task={task} />
    <View style={ui.inline}>
      <Action label="Zapisz wydarzenie" disabled={!valid} busy={task.isPending} onPress={() => {
        const body = { title: title.trim() || null, fileUrl: url.trim(), startsAt: date + 'T' + apiTime(time), eventStatus: status };
        task.mutate((client) => entry ? sdk.updateEvent({ ...request(client), path: { id: entry.id }, body })
          : sdk.createEvent({ ...request(client), body }), { onSuccess: onClose });
      }} />
      <Action label="Anuluj" kind="text" onPress={onClose} disabled={task.isPending} />
    </View>
  </>;
}

export function Events() {
  const [form, setForm] = useState<{ entry?: MobileEvent }>();
  const events = useApiQuery(['events'], (client, signal) => sdk.events(request(client, signal)));
  const task = useTask([['events'], ...scheduleKeys]);
  return <>
    {form ? <EventForm key={form.entry?.id ?? 'new'} entry={form.entry} onClose={() => setForm(undefined)} />
      : <Action label="Dodaj wydarzenie" kind="secondary" onPress={() => setForm({})} />}
    <Result task={task} />
    <Load query={events}>{(data) => <Collection items={data} itemKey={(item) => item.id} empty="Brak wydarzeń"
      render={(item) => <>
        <Row title={item.title ?? 'Wydarzenie dźwiękowe'}
          detail={item.startsAt.slice(0, 10) + ' · ' + timeLabel(item.startsAt) + ' · '
            + (eventStatuses.find((entry) => entry.code === item.eventStatus)?.label ?? item.eventStatus)} />
        <View style={ui.inline}>
          <Action label="Edytuj" kind="secondary" onPress={() => setForm({ entry: item })} />
          <Remove label="Usuń wydarzenie" detail={item.title ?? item.startsAt} disabled={task.isPending}
            action={() => task.mutate((client) => sdk.deleteEvent({ ...request(client), path: { id: item.id } }))} />
        </View>
      </>} />}</Load>
  </>;
}

export function FallbackTracks() {
  const tracks = useApiQuery(['fallback'], (client, signal) => sdk.fallbackTracks(request(client, signal)));
  const task = useTask([['fallback']]);
  return <>
    <TrackPicker title="Dodaj utwór domyślny" busy={task.isPending} onSelect={(item) =>
      confirm('Dodać utwór domyślny?', item.title, () => task.mutate((client) => sdk.addFallbackTrack({
        ...request(client), body: { songId: item.id },
      })), 'Dodaj')} />
    <Result task={task} />
    <Load query={tracks}>{(items) => items.length ? <Collection items={items} itemKey={(item) => item.id}
      empty="Brak utworów domyślnych" render={(item) => <>
        <Row title={item.title} detail={item.artistName + (item.isActive ? '' : ' · Nieaktywny')} />
        <Remove label="Usuń utwór domyślny" detail={item.title} disabled={task.isPending}
          action={() => task.mutate((client) => sdk.removeFallbackTrack({ ...request(client), path: { id: item.id } }))} />
      </>} /> : <Empty title="Brak utworów domyślnych" detail="Wybierz utwór z katalogu powyżej." />}</Load>
  </>;
}
