'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

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
  onSave?: (updatedEvent: EventForComponent) => void;
}

// Valid categories for Prisma enum
const validCategories = [
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
const toDatetimeLocal = (isoString: string) => {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset(); // minutes
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

export default function EditEventForm({ event, onSave }: EditEventFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: event.title,
    description: event.description,
    location: event.location,
    dateTime: toDatetimeLocal(event.dateTime),
    categories: event.categories.join(', '),
    imageUrl: event.image,
  });
  const [success, setSuccess] = useState(false);
  const [imageUrlError, setImageUrlError] = useState('');

  const looksLikeImageUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i.test(parsed.pathname);
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setImageUrlError('');

    if (form.imageUrl && !looksLikeImageUrl(form.imageUrl)) {
      setImageUrlError('Image URL must point to an image (e.g., .jpg, .png, .webp).');
      return;
    }

    // Clean categories: trim, remove empty, keep only valid enum values
    const categoriesArray = form.categories
      .split(',')
      .map(c => c.trim())
      .filter(c => c && validCategories.includes(c));

    const res = await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        location: form.location,
        dateTime: form.dateTime,
        categories: categoriesArray,
        imageUrl: form.imageUrl,
      }),
    });

    if (!res.ok) return; // optionally handle error

    const updatedData = await res.json();
    setSuccess(true);

    // Map back to frontend event type
    const updatedEvent: EventForComponent = {
      id: updatedData.id,
      title: updatedData.name,
      dateTime: updatedData.dateTime,
      location: updatedData.location,
      organization: updatedData.createdBy?.email ?? 'Unknown',
      categories: updatedData.categories ?? [],
      description: updatedData.description ?? '',
      image: updatedData.imageUrl ?? '/default-event.jpg',
    };

    if (onSave) onSave(updatedEvent);
    router.push('/myevents');
  };

  return (
    <Form onSubmit={handleSubmit}>
      {success && <Alert variant="success">Event updated successfully!</Alert>}

      <Form.Group className="mb-2">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" name="name" value={form.name} onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" name="location" value={form.location} onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Date & Time</Form.Label>
        <Form.Control type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Categories (comma separated)</Form.Label>
        <Form.Control type="text" name="categories" value={form.categories} onChange={handleChange} />
        <Form.Text className="text-muted">
          Valid categories:
          {' '}
          {validCategories.join(', ')}
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Image URL</Form.Label>
        <Form.Control type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        {imageUrlError && <Form.Text className="text-danger">{imageUrlError}</Form.Text>}
      </Form.Group>

      <Button type="submit">Save</Button>
    </Form>
  );
}

EditEventForm.defaultProps = {
  onSave: undefined,
};
