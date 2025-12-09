'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function OrganizerProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    organization: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Get user role
  const role = (session?.user as any)?.randomKey;
  const isOrganizer = role === 'ORGANIZER' || role === 'ADMIN';

  // Authorization check
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/not-authorized');
      return;
    }

    // Only ORGANIZER and ADMIN can access this page
    if (!isOrganizer) {
      router.push('/not-authorized');
    }
  }, [status, isOrganizer, router]);

  // Fetch profile data
  useEffect(() => {
    if (status === 'authenticated' && isOrganizer) {
      setLoading(true);
      fetch('/api/user/profile')
        .then(async (res) => {
          if (res.status === 401 || res.status === 403) {
            router.push('/not-authorized');
            return;
          }

          if (!res.ok) {
            throw new Error('Failed to load profile');
          }

          const data = await res.json();
          setFormData({
            email: data.email || '',
            organization: data.organization || '',
          });
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to load profile';
          console.error('Error loading profile:', err);
          setError(message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [status, isOrganizer, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization: formData.organization }),
      });

      if (res.status === 401 || res.status === 403) {
        router.push('/not-authorized');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Update failed');
      }

      setSuccess('Organization name updated successfully!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
    }
  };

  // Show loading while checking authentication
  if (status === 'loading' || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  // This shouldn't render because of the redirect, but just in case
  if (status === 'unauthenticated' || !isOrganizer) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Redirecting...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Organizer Profile Settings</h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            disabled
          />
          <Form.Text className="text-muted">
            Email cannot be changed
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Organization Name</Form.Label>
          <Form.Control
            type="text"
            name="organization"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            placeholder="e.g., IEEE UH Mānoa Chapter"
          />
          <Form.Text className="text-muted">
            This will be displayed as the organizer for your events
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}
