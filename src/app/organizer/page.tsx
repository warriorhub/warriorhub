'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    organization: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const role = (session?.user as any)?.randomKey;
  const isOrganizer = role === 'ORGANIZER' || role === 'ADMIN';

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Fetch current user data
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          setFormData({
            email: data.email || '',
            organization: data.organization || '',
          });
        })
        .catch(err => console.error('Error loading profile:', err));
    }
  }, [status, session]);

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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Update failed');
      }

      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (status === 'loading') return <Container className="py-5">Loading...</Container>;
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Profile Settings</h2>

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

        {isOrganizer && (
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
        )}

        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}
