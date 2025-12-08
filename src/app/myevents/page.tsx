/* eslint-disable max-len */

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
import { FileText, Check, Trash, HeartFill } from 'react-bootstrap-icons';
import { useSession } from 'next-auth/react';
import EventCard from '@/components/EventCard';

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
  categoriesNew?: { id: number; name: string }[];
  image?: string;
  isInterested?: boolean;
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
  const { status, data: session } = useSession();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<EventTableRow[]>([]);
  const [error, setError] = useState<string>('');
  const now = useMemo(() => new Date(), []);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'table' | 'card'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Get user role
  const role = (session?.user as { randomKey?: string } | null)?.randomKey;
  const isOrganizer = role === 'ORGANIZER' || role === 'ADMIN';
  const isUser = role === 'USER';

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (!session?.user?.id) {
      setEvents([]);
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events', { credentials: 'include' });
        if (!res.ok) throw new Error(`Failed to load events (${res.status})`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid events response');

        let eventsToShow = [];

        if (isUser) {
          // For USERS: Show interested events (potentialAttendees contains this user)
          eventsToShow = data.filter((e) => e.potentialAttendees?.some(
            (u: any) => String(u.id) === String(session.user.id),
          ));
        } else {
          // For ORGANIZERS/ADMINS: Show created events
          eventsToShow = data.filter(
            (e) => String(e.createdById ?? e.createdBy?.id) === String(session.user.id),
          );
        }

        const mapped: EventTableRow[] = eventsToShow.map((e) => {
          const start = new Date(e.dateTime);
          const end = new Date(start.getTime() + 60 * 60 * 1000);
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
            category: e.categoriesNew?.[0]?.name ?? '—',
            isRecurring: false,
            startDate: dateFormatter.format(start),
            startTime: timeFormatter.format(start),
            endDate: dateFormatter.format(end),
            endTime: timeFormatter.format(end),
            categoriesNew: e.categoriesNew ?? [],
            image: e.imageUrl ?? '/default-event.jpg',
            isInterested: isUser,
          };
        });

        setEvents(mapped);
        setError('');
        setCurrentPage(1);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load events';
        setError(message);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [status, session?.user?.id, isUser]);

  const currentEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    const isUpcoming = eventDate >= now;
    return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
  });

  const filteredEvents = currentEvents.filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIdx, startIdx + itemsPerPage);

  if (status === 'loading') {
    return (
      <Container className="py-5 text-center">
        <p>Loading...</p>
      </Container>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Container className="py-5 text-center">
        <h2 className="mb-3">Sign in required</h2>
        <p className="text-muted mb-4">You need to sign in to view My Events.</p>
        <Button variant="primary" onClick={() => router.push('/auth/signin?callbackUrl=/myevents')}>
          Go to Sign In
        </Button>
      </Container>
    );
  }

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

  const handleRemoveInterest = async (id: string) => {
    setRemovingId(id);
    try {
      const res = await fetch(`/api/events/${id}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to remove interest');
      }
      // Remove from list
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove interest';
      setError(message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main>
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h1 className="mb-0">
              {isUser ? 'My Interested Events' : 'My Events'}
            </h1>
          </Col>
          {/* Only show ADD NEW button for Organizers */}
          {isOrganizer && (
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
          )}
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

        {/* Tabs and Display Options */}
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
                  <Dropdown.Item onClick={() => setDisplayMode('table')}>Table View</Dropdown.Item>
                  <Dropdown.Item onClick={() => setDisplayMode('card')}>Card View</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2 align-items-center">
              {totalPages > 1 && (
                [...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <Button
                      key={pageNum}
                      variant={isActive ? 'light' : 'outline-primary'}
                      size="sm"
                      style={{ minWidth: '40px' }}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })
              )}
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

        {displayMode === 'table' ? (
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
                  {paginatedEvents.length > 0 ? (
                    paginatedEvents.map((event) => (
                      <tr key={event.id}>
                        <td className="text-center">
                          {event.isInterested ? (
                            <HeartFill size={24} className="text-danger" />
                          ) : (
                            <StatusIcon eventStatus={event.status} />
                          )}
                        </td>
                        <td>
                          <div>
                            <strong>{event.title}</strong>
                            <div className="text-muted small">
                              <a href={`/events/${event.id}`} className="text-primary me-2">
                                View
                              </a>
                              {/* Show Edit/Delete for Organizers, Remove Interest for Users */}
                              {isOrganizer && (
                                <>
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
                                </>
                              )}
                              {isUser && (
                                <>
                                  |
                                  <button
                                    type="button"
                                    className="btn btn-link p-0 ms-2 text-danger"
                                    onClick={() => handleRemoveInterest(event.id)}
                                    disabled={removingId === event.id}
                                  >
                                    <HeartFill size={16} />
                                    {' '}
                                    {removingId === event.id ? 'Removing...' : 'Remove Interest'}
                                  </button>
                                </>
                              )}
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
                        <p className="text-muted mb-3">
                          {isUser
                            ? 'No interested events yet. Browse events and mark your interest!'
                            : 'No events found'}
                        </p>
                        {searchQuery && (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setSearchQuery('')}
                          >
                            Clear Search
                          </Button>
                        )}
                        {isUser && !searchQuery && (
                          <Button
                            variant="primary"
                            onClick={() => router.push('/search')}
                          >
                            Browse Events
                          </Button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        ) : (
          <div style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden', paddingRight: '0.25rem' }}>
            <Row className="g-3 align-items-stretch">
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event) => (
                  <Col lg={3} md={4} sm={6} key={event.id} className="d-flex flex-column">
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      {event.isInterested && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                          <HeartFill size={24} className="text-danger" />
                        </div>
                      )}
                      <EventCard
                        title={event.title}
                        date={event.startDate}
                        location={event.venue || '—'}
                        organization={event.organizer}
                        categories={event.categoriesNew?.map(c => c.name) || (event.category !== '—' ? [event.category] : [])}
                        image={event.image || '/default-event.jpg'}
                        onView={() => router.push(`/events/${event.id}`)}
                        onVisit={() => router.push(`/events/${event.id}`)}
                      />
                    </div>
                    {/* Show Edit/Delete for Organizers, Remove Interest for Users */}
                    {isOrganizer && (
                      <div className="mt-2 d-flex gap-3 position-relative">
                        <a href={`/events/${event.id}/edit`} className="text-primary">
                          Edit
                        </a>
                        <button
                          type="button"
                          className="btn btn-link p-0 text-danger"
                          onClick={() => handleDelete(event.id)}
                          disabled={deletingId === event.id}
                        >
                          <Trash size={16} />
                          {' '}
                          {deletingId === event.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    )}
                    {isUser && (
                      <div className="mt-2">
                        <button
                          type="button"
                          className="btn btn-link p-0 text-danger"
                          onClick={() => handleRemoveInterest(event.id)}
                          disabled={removingId === event.id}
                        >
                          <HeartFill size={16} />
                          {' '}
                          {removingId === event.id ? 'Removing...' : 'Remove Interest'}
                        </button>
                      </div>
                    )}
                  </Col>
                ))
              ) : (
                <Col>
                  <p className="text-center text-muted">
                    {isUser ? 'No interested events yet.' : 'No events found.'}
                  </p>
                  {isUser && (
                    <div className="text-center">
                      <Button variant="primary" onClick={() => router.push('/search')}>
                        Browse Events
                      </Button>
                    </div>
                  )}
                </Col>
              )}
            </Row>
          </div>
        )}
      </Container>
    </main>
  );
}
