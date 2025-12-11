'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Image from 'next/image';
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

  // Only true for actual organizers
  const isOrganizer = role === 'ORGANIZER';

  // Authorization check
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/not-authorized');
      return;
    }

    if (!isOrganizer) {
      router.push('/not-authorized');
    }
  }, [status, isOrganizer, router]);

  // Fetch profile
  useEffect(() => {
    if (status === 'authenticated' && isOrganizer) {
      setLoading(true);
      fetch('/api/user/profile')
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to load profile');
          const data = await res.json();

          setFormData({
            email: data.email ?? '',
            organization: data.organization ?? '',
          });
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
        .finally(() => setLoading(false));
    }
  }, [status, isOrganizer]);

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
        throw new Error('Update failed');
      }

      setSuccess('Organization name updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  return (
    <main>
      <section
        className="hero-section position-relative d-flex align-items-center"
        style={{
          minHeight: '450px',
          backgroundImage: 'url(/campus.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}
        />

        <Container className="position-relative text-center" style={{ zIndex: 1 }}>
          <Image
            src="/uhlogo.png"
            alt="UH Logo"
            width={180}
            height={180}
            priority
            style={{
              filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.7))',
              marginBottom: '1rem',
            }}
          />

          <h1
            className="fw-bold text-white"
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
            }}
          >
            Welcome to WarriorHub
          </h1>
        </Container>

      </section>
      <Container className="py-5" style={{ maxWidth: '650px' }}>
        <h2 className="mb-4 text-center">Organizer Profile Settings</h2>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={formData.email} disabled />
            <Form.Text className="text-muted">Email cannot be changed</Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Organization Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="e.g., IEEE UH Mānoa Chapter"
            />
            <Form.Text className="text-muted">
              This will be displayed as the organizer for your events
            </Form.Text>
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>

        </Form>
      </Container>

    </main>
  );
}
