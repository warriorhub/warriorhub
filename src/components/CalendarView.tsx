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
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

type DBEvent = {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  description: string | null;
  categoriesNew: { id: number; name: string }[];
  imageUrl: string | null;
  createdBy?: { email?: string };
};

type CalendarEvent = {
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
  startOfWeek: (currentDate: Date) => startOfWeek(currentDate, { weekStartsOn: 0 }),
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

type CalendarViewProps = {
  initialDate?: Date;
};

const CalendarToolbar: React.FC<ToolbarProps<CalendarEvent>> = ({
  date,
  label,
  onNavigate,
  onView,
}) => {
  const currentMonth = date.getMonth();

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number(e.target.value);
    const newDate = new Date(date);
    newDate.setDate(1); // prevent month overflow (e.g., Jan 31 -> Mar 3)
    newDate.setMonth(newMonth);
    onNavigate('DATE', newDate);
  };

  return (
    <div className="rbc-toolbar" style={{ gap: '0.5rem' }}>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>Back</button>
        <button type="button" onClick={() => onNavigate('TODAY')}>Today</button>
        <button type="button" onClick={() => onNavigate('NEXT')}>Next</button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group" style={{ alignItems: 'center' }}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="me-2" style={{ marginBottom: 0 }}>
          Month:
          <select value={currentMonth} onChange={handleMonthChange} className="ms-2">
            {monthNames.map((name, idx) => (
              <option key={name} value={idx}>{name}</option>
            ))}
          </select>
        </label>
      </span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onView('month')}>Month</button>
        <button type="button" onClick={() => onView('week')}>Week</button>
        <button type="button" onClick={() => onView('day')}>Day</button>
      </span>
    </div>
  );
};

export default function CalendarView({ initialDate }: CalendarViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const router = useRouter();

  const defaultDate = useMemo(() => initialDate || new Date(), [initialDate]);

  useEffect(() => {
    setDate(defaultDate);
  }, [defaultDate]);

  const setDateAndUrl = useCallback((nextDate: Date) => {
    setDate(nextDate);
    if (typeof window !== 'undefined') {
      const safeDate = new Date(nextDate);
      safeDate.setDate(1);
      const year = safeDate.getFullYear();
      const month = safeDate.getMonth() + 1; // 1-12
      window.history.replaceState(null, '', `/calendar/${year}/${month}`);
    }
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    const eventId = event.resource?.id || event.id;
    if (eventId) {
      router.push(`/events/${eventId}`);
    }
  }, [router]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error(`Failed to load events: ${res.status}`);
        const data: DBEvent[] = await res.json();

        const mapped: CalendarEvent[] = data.map((event) => {
          const start = new Date(event.dateTime);
          const end = new Date(start.getTime() + defaultDurationMinutes * 60 * 1000);
          return {
            id: event.id,
            title: event.name,
            start,
            end,
            resource: event,
          };
        });

        setEvents(mapped);
      } catch (error) {
        console.error('Error loading events for calendar:', error);
        setEvents([]);
      }
    };

    fetchEvents();
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
          style={{ minHeight: '70vh' }}
          views={['month', 'week', 'day'] as View[]}
          view={view}
          onView={(nextView) => setView(nextView)}
          date={date}
          onNavigate={(nextDate) => setDateAndUrl(nextDate)}
          defaultView="month"
          defaultDate={defaultDate}
          popup
          onSelectEvent={handleSelectEvent}
          components={{ toolbar: CalendarToolbar }}
        />
      </Container>
    </main>
  );
}

CalendarView.defaultProps = {
  initialDate: undefined,
};

CalendarToolbar.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  label: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

CalendarView.propTypes = {
  initialDate: PropTypes.instanceOf(Date),
};
