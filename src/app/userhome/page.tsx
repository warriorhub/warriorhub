'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import EventCard from '@/components/EventCard';
import LikeButton from '@/components/LikeButton';
import { formatHstDate, formatHstTime } from '@/lib/time';

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

  // Guard: only USER role may access
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/userhome');
      return;
    }

    if (status === 'authenticated' && role !== 'USER') {
      router.replace('/not-authorized');
    }
  }, [status, role, router]);

  // Fetch events
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
          const interested = Boolean(
            isUser
            && userId
            && (e.potentialAttendees ?? []).some(
              (att) => String(att.id) === String(userId),
            );

          return {
            id: e.id,
            title: e.name,
            date: `${formatHstDate(e.dateTime)} ${formatHstTime(e.dateTime)}`,
            location: e.location,
            organization:
              e.createdBy?.organization || e.createdBy?.email || 'Unknown',
            categories: (e.categoriesNew ?? []).map((c) => c.name),
            image: e.imageUrl ?? '/default-event.jpg',
            initialInterested: Boolean(interested),
          };
        });

        setEvents(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') fetchEvents();
  }, [status, isUser, userId]);

  if (status === 'loading' || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading events...</p>
      </Container>
    );
  }

  return (
    <main>

      {/* ------------------------------------------------------ */}
      {/* HERO SECTION (same as landing page) */}
      {/* ------------------------------------------------------ */}
      <section
        className="hero-section position-relative d-flex align-items-center"
        style={{
          minHeight: '450px',
          backgroundImage: 'url(/campus.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0,0,0,0.35)',
          }}
        />

        <Container className="position-relative text-center text-white" style={{ zIndex: 2 }}>
          <Row className="justify-content-center">
            <Col xs={12} className="mb-3">
              <Image
                src="/uhlogo.png"
                alt="UH Logo"
                width={160}
                height={160}
                style={{
                  filter: 'drop-shadow(0px 0px 8px rgba(0,0,0,0.7))',
                }}
              />
            </Col>

            <Col lg={10}>
              <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
                Welcome to WarriorHub
              </h1>

              <p
                className="lead fs-4 d-inline-block px-4 py-2"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.45)',
                  borderRadius: '8px',
                  textShadow: '1px 1px 6px rgba(0,0,0,0.8)',
                }}
              >
                Discover, connect, and experience UH Mānoa events all in one place
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* EVENTS SECTION */}
      <Container className="py-5">
        <h2 className="text-center mb-4 text-dark">Featured Events</h2>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {!events.length && !error && (
          <p className="text-center text-muted">No events available yet.</p>
        )}

        <Row xs={1} md={2} lg={3} className="g-4">
          {events.map((event) => (
            <Col key={event.id} className="d-flex flex-column gap-3">
              <EventCard
                title={event.title}
                date={event.date}
                location={event.location}
                organization={event.organization}
                categories={event.categories}
                image={event.image}
                onView={() => router.push(`/events/${event.id}`)}
                onVisit={() => router.push(`/events/${event.id}`)}
                likeButton={
                  isUser ? (
                    <LikeButton
                      eventId={event.id}
                      initialInterested={event.initialInterested}
                    />
                  ) : null
                }
              />
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
}
