'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Col, Form, Row, Alert } from 'react-bootstrap';

const categoryOptions = [
  'Recreation',
  'Food',
  'Career',
  'Free',
  'Cultural',
  'Academic',
  'Social',
  'Sports',
  'Workshop',
];

export default function AddEventForm() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageUrl: '',
    categories: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageUrlError, setImageUrlError] = useState('');

  const looksLikeImageUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i.test(parsed.pathname);
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormState((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    setImageUrlError('');

    if (formState.imageUrl && !looksLikeImageUrl(formState.imageUrl)) {
      setImageUrlError('Image URL must point to an image (e.g., .jpg, .png, .webp).');
      setSubmitting(false);
      return;
    }

    try {
      const dateTime = new Date(`${formState.date}T${formState.time || '00:00'}`);
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formState.name,
          description: formState.description,
          dateTime,
          location: formState.location,
          categories: formState.categories,
          imageUrl: formState.imageUrl || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to create event (status ${res.status})`);
      }

      setSuccessMessage('Event created successfully.');
      setFormState({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        imageUrl: '',
        categories: [],
      });
      router.push('/myevents');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create event';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="border rounded p-4 shadow-sm bg-white">
      <h2 className="mb-4">Add Event</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form.Group className="mb-3" controlId="event-name">
        <Form.Label>Event Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formState.name}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="event-date">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formState.date}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="event-time">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              name="time"
              value={formState.time}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="event-location">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formState.location}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="event-description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formState.description}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="event-image">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="url"
          name="imageUrl"
          value={formState.imageUrl}
          onChange={handleInputChange}
          placeholder="https://example.com/image.jpg"
        />
        {imageUrlError && <Form.Text className="text-danger">{imageUrlError}</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3" controlId="event-categories">
        <Form.Label>Categories (from schema)</Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <Form.Check
              key={cat}
              type="checkbox"
              id={`cat-${cat}`}
              label={cat}
              checked={formState.categories.includes(cat)}
              onChange={() => handleCategoryToggle(cat)}
            />
          ))}
        </div>
      </Form.Group>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Create Event'}
      </Button>
    </Form>
  );
}
