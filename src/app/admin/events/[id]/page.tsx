'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button, Container, Modal, Spinner, Alert } from 'react-bootstrap';
import EditEventForm, { EventForComponent } from '@/components/EditEventForm';

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [event, setEvent] = useState<EventForComponent | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user role
  const userRole = (session?.user as { randomKey?: string })?.randomKey;
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    // Check authentication first
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/not-authorized');
      return;
    }

    // Only admins can access this page
    if (!isAdmin) {
      router.push('/not-authorized');
      return;
    }

    const fetchEvent = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/events/${id}`); // Fixed syntax

        if (res.status === 401 || res.status === 403) {
          router.push('/not-authorized');
          return;
        }

        if (res.status === 404) {
          setError('Event not found');
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to load event');
        }

        const data = await res.json();

        if (!data) {
          router.push('/admin/list-events');
          return;
        }

        setEvent({
          id: data.id,
          title: data.name,
          dateTime: data.dateTime,
          location: data.location,
          organization: data.createdBy?.organization || data.createdBy?.email || 'Unknown',
          categoriesNew: data.categoriesNew ?? [],
          description: data.description ?? '',
          image: data.imageUrl ?? '/default-event.jpg',
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load event';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, router, status, isAdmin]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' }); // Fixed syntax

      if (res.status === 401 || res.status === 403) {
        router.push('/not-authorized');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to delete event');
      }

      router.push('/admin/list-events');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      setError(message);
    }
  };

  const handleSave = async (updatedEvent: EventForComponent) => {
    setEvent(updatedEvent);

    const categoriesNewForAPI = updatedEvent.categoriesNew?.map(cat => ({ id: cat.id })) || [];

    try {
      const res = await fetch(`/api/events/${id}`, { // Fixed syntax
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedEvent.title,
          description: updatedEvent.description,
          location: updatedEvent.location,
          dateTime: updatedEvent.dateTime,
          categoriesNew: categoriesNewForAPI,
          imageUrl: updatedEvent.image,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        router.push('/not-authorized');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to update event');
      }

      router.push('/admin/list-events');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update event';
      setError(message);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => router.push('/admin/list-events')}>
            Back to List Events
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading event...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="secondary" onClick={() => router.push('/admin/list-events')}>
          Back
        </Button>
        <h1 className="text-center flex-grow-1">Edit Event</h1>
        <div style={{ width: '75px' }} />
      </div>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

      <EditEventForm event={event} onSave={handleSave} />

      <Button variant="danger" className="mt-3" onClick={() => setShowDeleteModal(true)}>
        Delete Event
      </Button>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this event? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete();
              setShowDeleteModal(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
