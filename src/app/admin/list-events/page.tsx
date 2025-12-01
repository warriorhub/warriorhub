/* eslint-disable no-nested-ternary */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Table, Button, Spinner, Row, Col } from 'react-bootstrap';

type DBEvent = {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  categories?: string[];
  imageUrl?: string | null;
};

export default function ListEventsPage() {
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-center">Manage Events</h2>
          <p className="text-muted text-center">View, edit, and remove events.</p>
        </Col>
      </Row>

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
              <th>Name</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th style={{ width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => {
              const eventDate = new Date(e.dateTime);
              const formattedDate = eventDate.toLocaleDateString(undefined, {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              });
              const formattedTime = eventDate.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });
              return (
                <tr key={e.id}>
                  <td className="fw-semibold">{e.name}</td>
                  <td>{`${formattedDate} ${formattedTime}`}</td>
                  <td>{e.location}</td>
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
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
