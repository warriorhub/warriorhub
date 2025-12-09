'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Alert } from 'react-bootstrap';

type CategoryNew = {
  id: number;
  name: string;
  description?: string;
};

export default function AddEventForm() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageUrl: '',
    categoriesNew: [] as { id: number; name: string }[], // Changed
  });
  const [availableCategories, setAvailableCategories] = useState<CategoryNew[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageUrlError, setImageUrlError] = useState('');

  // Fetch available categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setAvailableCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const looksLikeImageUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname.toLowerCase();
      return /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/.test(pathname);
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryId: number, categoryName: string) => {
    setFormState((prev) => {
      const exists = prev.categoriesNew.some(c => c.id === categoryId);
      return {
        ...prev,
        categoriesNew: exists
          ? prev.categoriesNew.filter((c) => c.id !== categoryId)
          : [...prev.categoriesNew, { id: categoryId, name: categoryName }],
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
      // Convert to API format: [{id: 1}, {id: 2}]
      const categoriesNewForAPI = formState.categoriesNew.map(cat => ({ id: cat.id }));

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formState.name,
          description: formState.description,
          dateTime,
          location: formState.location,
          categoriesNew: categoriesNewForAPI, // Changed
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
        categoriesNew: [],
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
        <Form.Label>Categories</Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {availableCategories.map((cat) => (
            <Form.Check
              key={cat.id}
              type="checkbox"
              id={`cat-${cat.id}`}
              label={cat.name}
              checked={formState.categoriesNew.some(c => c.id === cat.id)}
              onChange={() => handleCategoryToggle(cat.id, cat.name)}
            />
          ))}
        </div>
        {availableCategories.length === 0 && (
          <Form.Text className="text-muted">Loading categories...</Form.Text>
        )}
      </Form.Group>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Create Event'}
      </Button>
    </Form>
  );
}
