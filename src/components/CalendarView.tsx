/* eslint-disable react/require-default-props */

'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, View, ToolbarProps } from 'react-big-calendar';
import {
  format,
  parse,
  startOfWeek,
  getDay,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export type DBEvent = {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  description: string | null;
  categoriesNew: { id: number; name: string }[];
  imageUrl: string | null;
  createdBy?: { email?: string };
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: DBEvent;
};

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

const defaultDurationMinutes = 60;

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const EventNoTime = ({ event }: { event: CalendarEvent }) => <span>{event.title}</span>;

export const CalendarToolbar = ({
  date,
  label,
  onNavigate,
  onView,
}: ToolbarProps<CalendarEvent>) => {
  const currentMonth = date.getMonth();

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number(e.target.value);
    const newDate = new Date(date);
    newDate.setMonth(newMonth);
    newDate.setDate(1);
    onNavigate('DATE', newDate);
  };

  return (
    <div className="rbc-toolbar" style={{ gap: '0.5rem' }}>
      {/* Navigation Buttons */}
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>Back</button>
        <button type="button" onClick={() => onNavigate('TODAY')}>Today</button>
        <button type="button" onClick={() => onNavigate('NEXT')}>Next</button>
      </span>

      {/* Center Label */}
      <span className="rbc-toolbar-label">{label}</span>

      {/* Month Selector */}
      <span className="rbc-btn-group" style={{ alignItems: 'center' }}>
        <span className="me-2">Month:</span>
        <select value={currentMonth} onChange={handleMonthChange}>
          {monthNames.map((name, idx) => (
            <option key={name} value={idx}>{name}</option>
          ))}
        </select>
      </span>

      {/* View Buttons */}
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onView('month')}>Month</button>
        <button type="button" onClick={() => onView('week')}>Week</button>
        <button type="button" onClick={() => onView('day')}>Day</button>
      </span>
    </div>
  );
};

export default function CalendarView({ initialDate }: { initialDate?: Date }) {
  const router = useRouter();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState<Date>(initialDate || new Date());

  const safeInitialDate = useMemo(() => initialDate || new Date(), [initialDate]);

  useEffect(() => {
    setDate(safeInitialDate);
  }, [safeInitialDate]);

  const updateDateInUrl = useCallback((next: Date) => {
    setDate(next);

    if (typeof window !== 'undefined') {
      const safe = new Date(next);
      safe.setDate(1);
      const year = safe.getFullYear();
      const month = safe.getMonth() + 1;
      window.history.replaceState(null, '', `/calendar/${year}/${month}`);
    }
  }, []);

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      router.push(`/events/${event.id}`);
    },
    [router],
  );

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to load events');

        const data: DBEvent[] = await res.json();

        const mapped = data.map((e) => {
          const start = new Date(e.dateTime);
          const end = new Date(start.getTime() + defaultDurationMinutes * 60 * 1000);

          return {
            id: e.id,
            title: e.name, // no time here
            start,
            end,
            resource: e,
          };
        });

        setEvents(mapped);
      } catch (err) {
        console.error('Calendar Load Error:', err);
        setEvents([]);
      }
    };

    loadEvents();
  }, []);

  return (
    <main>
      <Container className="py-4">
        <h1 className="mb-4">Calendar</h1>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={updateDateInUrl}
          defaultDate={safeInitialDate}
          views={['month', 'week', 'day']}
          popup
          onSelectEvent={handleSelectEvent}
          components={{
            toolbar: CalendarToolbar,
            event: EventNoTime,
          }}
          formats={{
            eventTimeRangeFormat: () => '', // removes time inside event box
            eventTimeRangeStartFormat: () => '',
            eventTimeRangeEndFormat: () => '',
            timeGutterFormat: () => '', // removes left-side gutter times
          }}
          style={{ minHeight: '70vh' }}
        />
      </Container>
    </main>
  );
}
