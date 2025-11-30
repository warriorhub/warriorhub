'use client';

import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Dropdown,
  Alert,
} from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FileText, Check, Trash } from 'react-bootstrap-icons';
import { useSession } from 'next-auth/react';

type EventTableRow = {
  id: string;
  status: string;
  title: string;
  organizer: string;
  venue: string;
  category: string;
  isRecurring: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

// StatusIcon component
const StatusIcon = ({ eventStatus }: { eventStatus: string }) => {
  if (eventStatus === 'attending' || eventStatus === 'attended') {
    return <Check size={24} className="text-success" />;
  }
  return <FileText size={24} className="text-muted" />;
};

export default function MyEventsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<EventTableRow[]>([]);
  const [error, setError] = useState<string>('');
  const now = useMemo(() => new Date(), []);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch events
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events', { credentials: 'include' });
        if (!res.ok) throw new Error(`Failed to load events (${res.status})`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid events response');

        const mapped: EventTableRow[] = data.map((e) => {
          const start = new Date(e.dateTime);
          const end = new Date(start.getTime() + 60 * 60 * 1000); // assume 1 hour
          const dateFormatter = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
          const timeFormatter = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          });
          return {
            id: e.id,
            status: 'registered',
            title: e.name,
            organizer: e.createdBy?.email ?? 'Unknown',
            venue: e.location,
            category: e.categories?.[0] ?? '—',
            isRecurring: false,
            startDate: dateFormatter.format(start),
            startTime: timeFormatter.format(start),
            endDate: dateFormatter.format(end),
            endTime: timeFormatter.format(end),
          };
        });

        // Filter events for admins and organizers: only show their own events
        const userEmail = session?.user?.email;
        const filteredByOwner = mapped.filter((e) => {
          if (!userEmail) return false;
          const role = session?.user?.randomKey; // 'ADMIN' | 'ORGANIZER' | 'USER'
          if (role === 'USER') return false; // users should not see this page?
          return e.organizer === userEmail;
        });

        setEvents(filteredByOwner);
        setError('');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load events';
        setError(message);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [status, session]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Container className="py-5 text-center">
        <p>Loading...</p>
      </Container>
    );
  }

  if (status === 'unauthenticated') {
    return null; // redirect will happen in useEffect
  }

  const currentEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    const isUpcoming = eventDate >= now;
    return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
  });

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this event?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to delete (${res.status})`);
      }
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEvents = currentEvents.filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main>
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h1 className="mb-0">My Events</h1>
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              size="lg"
              style={{ backgroundColor: '#0d6efd', fontWeight: '600' }}
              onClick={() => router.push('/myevents/add')}
            >
              ADD NEW
            </Button>
          </Col>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search Event Titles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '300px' }}
            />
          </Col>
        </Row>

        {/* Tabs */}
        <Row className="mb-3 align-items-center">
          <Col>
            <div className="d-flex gap-2">
              <Button
                variant={activeTab === 'upcoming' ? 'dark' : 'outline-secondary'}
                onClick={() => setActiveTab('upcoming')}
                style={{ fontWeight: activeTab === 'upcoming' ? '600' : '400' }}
              >
                UPCOMING EVENTS
              </Button>
              <Button
                variant={activeTab === 'past' ? 'dark' : 'outline-secondary'}
                onClick={() => setActiveTab('past')}
                style={{ fontWeight: activeTab === 'past' ? '600' : '400' }}
              >
                PAST EVENTS
              </Button>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="display-dropdown">
                  DISPLAY OPTION ▼
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Table View</Dropdown.Item>
                  <Dropdown.Item>Card View</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>

        {error && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger" className="mb-0">
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Events Table */}
        <Row>
          <Col>
            <Table hover responsive className="bg-white">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>STATUS</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>TITLE</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>ORGANIZER</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>VENUE</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>CATEGORY</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>RECURRING?</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>START DATE</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>END DATE</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="text-center">
                        <StatusIcon eventStatus={event.status} />
                      </td>
                      <td>
                        <div>
                          <strong>{event.title}</strong>
                          <div className="text-muted small">
                            <a href={`/events/${event.id}`} className="text-primary me-2">
                              View
                            </a>
                            |
                            <a href={`/events/${event.id}/edit`} className="text-primary ms-2 me-2">
                              Edit
                            </a>
                            |
                            <button
                              type="button"
                              className="btn btn-link p-0 ms-2 text-danger"
                              onClick={() => handleDelete(event.id)}
                              disabled={deletingId === event.id}
                            >
                              <Trash size={16} />
                              {' '}
                              {deletingId === event.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>{event.organizer}</td>
                      <td>{event.venue || '—'}</td>
                      <td>{event.category}</td>
                      <td>{event.isRecurring ? 'Yes' : 'No'}</td>
                      <td>
                        {event.startDate}
                        {event.startTime && (
                          <>
                            <br />
                            <span className="text-muted small">{event.startTime}</span>
                          </>
                        )}
                      </td>
                      <td>
                        {event.endDate}
                        {event.endTime && (
                          <>
                            <br />
                            <span className="text-muted small">{event.endTime}</span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <p className="text-muted mb-3">No events found</p>
                      {searchQuery && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear Search
                        </Button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
