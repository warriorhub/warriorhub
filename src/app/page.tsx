'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';
import { Container } from 'react-bootstrap';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <Container className="py-5 text-center">
        <p>Loading...</p>
      </Container>
    );
  }

  if (session) {
    const role = (session.user)?.randomKey;
    if (role === 'ADMIN') {
      router.push('/admin');
      return null; // stop rendering
    }
    if (role === 'ORGANIZER') {
      router.push('/organizer');
      return null;
    }
    router.push('/userhome');
    return null;
  }

  return <LandingPage />;
}
