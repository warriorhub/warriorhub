'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Container, Modal } from 'react-bootstrap';
import EditEventForm, { EventForComponent } from '@/components/EditEventForm';

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventForComponent | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();

      if (!data) return router.push('/admin/list-events');

      setEvent({
        id: data.id,
        title: data.name,
        dateTime: data.dateTime,
        location: data.location,
        organization: data.createdBy?.email ?? 'Unknown',
        categoriesNew: data.categoriesNew ?? [], // Changed from categories
        description: data.description ?? '',
        image: data.imageUrl ?? '/default-event.jpg',
      });
    };
    fetchEvent();
  }, [id, router]);

  const handleDelete = async () => {
    if (!id) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    router.push('/admin/list-events');
  };

  const handleSave = async (updatedEvent: EventForComponent) => {
    setEvent(updatedEvent);

    // Convert categoriesNew to the format the API expects
    const categoriesNewForAPI = updatedEvent.categoriesNew?.map(cat => ({ id: cat.id })) || [];

    await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updatedEvent.title,
        description: updatedEvent.description,
        location: updatedEvent.location,
        dateTime: updatedEvent.dateTime,
        categoriesNew: categoriesNewForAPI, // Changed from categories
        imageUrl: updatedEvent.image,
      }),
    });
    router.push('/admin/list-events');
  };

  if (!event) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="secondary" onClick={() => router.push('/admin/list-events')}>
          Back
        </Button>
        <h1 className="text-center flex-grow-1">Edit Event</h1>
        <div style={{ width: '75px' }} />
      </div>

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
