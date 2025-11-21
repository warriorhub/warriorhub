'use client';

import Image from 'next/image';
import { Button } from 'react-bootstrap';

interface Event {
  title: string;
  date: string;
  location: string;
  description: string;
  categories: string[];
  organization: string;
  image: string;
}

interface EventDetailsFormProps {
  show: boolean;
  event: Event | null;
  onClose: () => void;
}

export default function EventDetailsForm({ show, event, onClose }: EventDetailsFormProps) {
  if (!show || !event) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          maxWidth: '500px',
          width: '90%',
        }}
      >
        <h2>{event.title}</h2>
        <p>
          {event.date}
          {' '}
          •
          {' '}
          {event.location}
        </p>
        <p>
          <strong>Organization:</strong>
          {' '}
          {event.organization}
        </p>
        <Image
          src={event.image}
          alt={event.title}
          width={600}
          height={400}
          className="mb-3 rounded"
          style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
        />
        <p className="mt-3">{event.description}</p>
        <div className="mt-2">
          {event.categories.map((c) => (
            <span
              key={c}
              style={{
                marginRight: '0.5rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '0.25rem',
                fontSize: '0.8rem',
              }}
            >
              {c}
            </span>
          ))}
        </div>
        <Button
          onClick={onClose}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '0.25rem' }}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
