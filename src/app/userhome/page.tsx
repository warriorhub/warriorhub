'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import EventCard from '@/components/EventCard';
import LikeButton from '@/components/LikeButton';

type DBEvent = {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  description?: string | null;
  imageUrl?: string | null;
  categoriesNew?: { id: number; name: string }[];
  createdBy?: { organization?: string | null; email?: string | null };
  potentialAttendees?: { id: string | number }[];
};

type EventForDisplay = {
  id: string;
  title: string;
  date: string;
  location: string;
  organization: string;
  categories: string[];
  image: string;
  initialInterested: boolean;
};

export default function UserHome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<EventForDisplay[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const role = (session?.user as { randomKey?: string } | null)?.randomKey;
  const isUser = role === 'USER';
  const userId = session?.user?.id;

  // Guard: only USER role may access this page/likes
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/userhome');
      return;
    }
    if (status === 'authenticated' && role && role !== 'USER') {
      router.replace('/not-authorized');
    }
  }, [status, role, router]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/events?futureOnly=true');
        if (!res.ok) throw new Error(`Failed to fetch events (${res.status})`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid events response');

        const mapped: EventForDisplay[] = data.map((e: DBEvent) => {
          const date = new Date(e.dateTime);
          const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          });
          const interested = Boolean(
            isUser
            && userId
            && (e.potentialAttendees ?? []).some(
              (att) => String(att.id) === String(userId),
            ),
          );

          return {
            id: e.id,
            title: e.name,
            date: formatter.format(date),
            location: e.location,
            organization: e.createdBy?.organization || e.createdBy?.email || 'Unknown',
            categories: (e.categoriesNew ?? []).map((c) => c.name),
            image: e.imageUrl ?? '/default-event.jpg',
            initialInterested: interested,
          };
        });

        setEvents(mapped);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load events';
        setError(message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    // Only start fetching once we know the session status so interest flags can be set correctly
    if (status !== 'loading') {
      fetchEvents();
    }
  }, [status, isUser, userId]);

  if (status === 'loading' || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
        <div className="mt-3">Loading events...</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4 text-dark">Featured Events</h2>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {!events.length && !error && (
        <p className="text-center text-muted">No events available yet.</p>
      )}

      <Row xs={1} md={2} lg={3} className="g-4 align-items-start">
        {events.map((event) => (
          <Col key={event.id} className="d-flex flex-column gap-3">
            <div className="w-100 d-flex flex-column gap-3">
              <EventCard
                title={event.title}
                date={event.date}
                location={event.location}
                organization={event.organization}
                categories={event.categories}
                image={event.image}
                onView={() => router.push(`/events/${event.id}`)}
                onVisit={() => router.push(`/events/${event.id}`)}
              />
              {isUser && (
                <div className="d-flex mt-2">
                  <LikeButton eventId={event.id} initialInterested={event.initialInterested} />
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
