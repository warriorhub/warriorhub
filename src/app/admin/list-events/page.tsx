/* eslint-disable no-nested-ternary */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Container, Table, Button, Spinner, Row, Col, Badge, Alert } from 'react-bootstrap';
import { formatHstDateTime } from '@/lib/time';

type DBEvent = {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  categoriesNew?: { id: number; name: string }[];
  imageUrl?: string | null;
  createdBy?: {
    organization?: string | null;
    email?: string | null;
  };
};

export default function ListEventsPage() {
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  // Get user role
  const userRole = (session?.user as { randomKey?: string })?.randomKey;
  const isAdmin = userRole === 'ADMIN';

  // Authorization check
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/not-authorized');
      return;
    }

    // Only admins can access this page
    if (!isAdmin) {
      router.push('/not-authorized');
    }
  }, [status, isAdmin, router]);

  // Wrap fetchEvents in useCallback to prevent infinite loop
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/events');

      if (res.status === 401 || res.status === 403) {
        router.push('/not-authorized');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load events');
      }

      const data = await res.json();
      setEvents(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load events';
      setError(message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [router]); // Only depends on router

  useEffect(() => {
    // Only fetch events if user is authenticated and admin
    if (status === 'authenticated' && isAdmin) {
      fetchEvents();
    }
  }, [status, isAdmin, fetchEvents]); // Now safe to include fetchEvents

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });

      if (res.status === 401 || res.status === 403) {
        router.push('/not-authorized');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete event');
      }

      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      setError(message);
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Checking authorization...</p>
      </Container>
    );
  }

  // This shouldn't render because of the redirect, but just in case
  if (status === 'unauthenticated' || !isAdmin) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Redirecting...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-center">Manage Events</h2>
          <p className="text-muted text-center">View, edit, and remove events.</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <p className="text-muted fst-italic">No events found.</p>
      ) : (
        <Table striped hover bordered responsive className="shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Event</th>
              <th>Organization</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Categories</th>
              <th style={{ width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td className="fw-semibold">{e.name}</td>
                <td>{e.createdBy?.organization || e.createdBy?.email || 'Unknown'}</td>
                <td>{formatHstDateTime(e.dateTime)}</td>
                <td>{e.location}</td>
                <td>
                  {e.categoriesNew && e.categoriesNew.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {e.categoriesNew.map(cat => (
                        <Badge key={cat.id} bg="secondary">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">No categories</span>
                  )}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => router.push(`/admin/events/${e.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(e.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
