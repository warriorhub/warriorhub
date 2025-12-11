'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { toDateTimeLocalHst, toUtcFromDateTimeLocal } from '@/lib/time';

export type EventForComponent = {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  organization: string;
  categoriesNew: { id: number; name: string }[]; // Changed from categories: string[]
  description: string;
  image: string;
};

interface EditEventFormProps {
  event: EventForComponent;
  onSave?: (updatedEvent: EventForComponent) => void;
}

type CategoryNew = {
  id: number;
  name: string;
  description?: string;
};

export default function EditEventForm({ event, onSave }: EditEventFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: event.title,
    description: event.description,
    location: event.location,
    dateTime: toDateTimeLocalHst(event.dateTime),
    categoriesNew: event.categoriesNew || [],
    imageUrl: event.image,
  });
  const [availableCategories, setAvailableCategories] = useState<CategoryNew[]>([]);
  const [success, setSuccess] = useState(false);
  const [imageUrlError, setImageUrlError] = useState('');

  // Fetch available categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setAvailableCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Keep form in sync if the event prop changes (ensures datetime-local shows HST)
  useEffect(() => {
    setForm({
      name: event.title,
      description: event.description,
      location: event.location,
      dateTime: toDateTimeLocalHst(event.dateTime),
      categoriesNew: event.categoriesNew || [],
      imageUrl: event.image,
    });
  }, [event]);

  const looksLikeImageUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname.toLowerCase();
      return /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/.test(pathname);
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setForm(prev => {
      const current = prev.categoriesNew || [];
      if (checked) {
        // Add category
        const categoryToAdd = availableCategories.find(c => c.id === categoryId);
        if (categoryToAdd && !current.some(c => c.id === categoryId)) {
          return {
            ...prev,
            categoriesNew: [...current, { id: categoryToAdd.id, name: categoryToAdd.name }],
          };
        }
      } else {
        // Remove category
        return {
          ...prev,
          categoriesNew: current.filter(c => c.id !== categoryId),
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setImageUrlError('');

    if (form.imageUrl && !looksLikeImageUrl(form.imageUrl)) {
      setImageUrlError('Image URL must point to an image (e.g., .jpg, .png, .webp).');
      return;
    }

    // Convert categoriesNew to API format: [{id: 1}, {id: 2}]
    const categoriesNewForAPI = form.categoriesNew.map(cat => ({ id: cat.id }));

    const res = await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        location: form.location,
        dateTime: toUtcFromDateTimeLocal(form.dateTime),
        categoriesNew: categoriesNewForAPI,
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
      categoriesNew: updatedData.categoriesNew ?? [],
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

      <Form.Group className="mb-3">
        <Form.Label>Categories</Form.Label>
        <div className="d-flex flex-wrap gap-3">
          {availableCategories.map(category => (
            <Form.Check
              key={category.id}
              type="checkbox"
              id={`category-${category.id}`}
              label={category.name}
              checked={form.categoriesNew.some(c => c.id === category.id)}
              onChange={e => handleCategoryChange(category.id, e.target.checked)}
            />
          ))}
        </div>
        {availableCategories.length === 0 && (
          <Form.Text className="text-muted">Loading categories...</Form.Text>
        )}
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
