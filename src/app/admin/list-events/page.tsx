'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Table, Button, Spinner, Row, Col } from 'react-bootstrap';

type DBEvent = {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  organizer?: string;
  description?: string | null;
  categories?: string[];
  createdBy?: any;
  imageUrl?: string | null;
};

export default function ListEventsPage() {
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchEvents = async () => {
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

  // Fetch once on mount and when ?refresh=1 is present
  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('refresh')]);

  // Delete event
  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const stripedValue: boolean | string = true;
  const hoverValue: boolean = true;
  const borderedValue: boolean = true;

  let content;
  if (loading) {
    content = (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading events...</p>
      </div>
    );
  } else if (events.length === 0) {
    content = <p className="text-muted fst-italic">No events found.</p>;
  } else {
    content = (
      <Table
        striped={stripedValue}
        hover={hoverValue}
        bordered={borderedValue}
        responsive
        className="shadow-sm"
      >
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Date & Time</th>
            <th>Location</th>
            <th style={{ width: '150px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e.id}>
              <td className="fw-semibold">{e.name}</td>
              <td>{new Date(e.dateTime).toLocaleString()}</td>
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
          ))}
        </tbody>
      </Table>
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

      {content}
    </Container>
  );
}
