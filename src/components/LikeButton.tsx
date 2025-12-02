'use client';

import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { HeartFill, Heart } from 'react-bootstrap-icons';

interface LikeButtonProps {
  eventId: string;
  initialInterested: boolean;
}

export default function LikeButton({ eventId, initialInterested }: LikeButtonProps) {
  const [interested, setInterested] = useState(initialInterested);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInterest = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/events/${eventId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update interest');
      }

      const data = await response.json();
      setInterested(data.interested);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update interest';
      setError(message);
      console.error('Interest toggle error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine button text (avoids nested ternary)
  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    if (interested) return 'Interested';
    return 'Mark as Interested';
  };

  return (
    <>
      <Button
        variant={interested ? 'danger' : 'outline-danger'}
        onClick={handleInterest}
        disabled={isLoading}
        className="d-flex align-items-center gap-2"
      >
        {interested ? <HeartFill size={20} /> : <Heart size={20} />}
        {getButtonText()}
      </Button>
      {error && (
        <div className="text-danger small mt-2">
          {error}
        </div>
      )}
    </>
  );
}
