'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type EventForTesting = {
  id: string;
  name: string;
  dateTime: string;
  location: string;
};

export default function ListEventsPage() {
  const [events, setEvents] = useState<EventForTesting[]>([]);
  const router = useRouter();

  // Fetch events from your API
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents);
  }, []);

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>List Events</h1>
      <ul>
        {events.map(e => (
          <li key={e.id} style={{ marginBottom: '1rem' }}>
            <strong>{e.name}</strong>
            {' '}
            -
            {e.location}
            {' '}
            -
            {new Date(e.dateTime).toLocaleString()}
            <br />
            <button
              type="button"
              onClick={() => router.push(`/admin/events/${e.id}`)}
            >
              Edit
            </button>
            {' '}
            <button type="button" onClick={() => handleDelete(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
