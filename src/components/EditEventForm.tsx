'use client';

import { useState } from 'react';
import { Button, Form, Alert, Card, Row, Col, Image } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export type EventForComponent = {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  organization: string;
  categories: string[];
  description: string;
  image: string;
};

interface EditEventFormProps {
  event: EventForComponent;
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();

  // Format dateTime for input[type=datetime-local]
  const formatDateTime = (dt: string) => {
    const date = new Date(dt);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  };

  const [form, setForm] = useState({
    name: event.title,
    description: event.description,
    location: event.location,
    dateTime: formatDateTime(event.dateTime),
    categories: event.categories.join(', '),
    imageUrl: event.image,
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        location: form.location,
        dateTime: new Date(form.dateTime).toISOString(),
        categories: form.categories.split(',').map(c => c.trim()),
        imageUrl: form.imageUrl,
      }),
    });

    setSuccess(true);
  };

  return (
    <Card className="shadow-sm p-4">
      {/* Back button and title */}
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="secondary"
          size="sm"
          className="me-3"
          onClick={() => router.back()}
        >
          &larr; Back
        </Button>
      </div>

      {/* Success message */}
      {success && (
        <Alert
          variant="success"
          onClose={() => setSuccess(false)}
          dismissible
        >
          Event updated successfully!
        </Alert>
      )}

      {/* Image preview */}
      <div className="text-center mb-4">
        <Image
          src={form.imageUrl || '/default-event.jpg'}
          alt="Event Image"
          fluid
          rounded
          style={{ maxHeight: '300px', objectFit: 'cover' }}
        />
      </div>

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Event name"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Event location"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="dateTime"
                value={form.dateTime}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Categories (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="categories"
                value={form.categories}
                onChange={handleChange}
                placeholder="e.g., Food, Workshop"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter event description"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </Form>
    </Card>
  );
}
