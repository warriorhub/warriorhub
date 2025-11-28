'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EditEventForm, { EventForComponent } from '@/components/EditEventForm';
import { Modal, Button } from 'react-bootstrap';

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

      const mappedEvent: EventForComponent = {
        id: data.id,
        title: data.name,
        dateTime: data.dateTime,
        location: data.location,
        organization: data.createdBy?.email ?? 'Unknown',
        categories: data.categories ?? [],
        description: data.description ?? '',
        image: data.imageUrl ?? '/default-event.jpg',
      };

      setEvent(mappedEvent);
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    router.push('/admin/events');
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Event</h1>
      <EditEventForm event={event} />
      <Button
        variant="danger"
        style={{ marginTop: '1rem' }}
        onClick={() => setShowDeleteModal(true)}
      >
        Delete Event
      </Button>

      {/* Delete Confirmation Modal */}
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
    </div>
  );
}
