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
    router.push('/UserHome');
    return null; // stop rendering
  }

  return <LandingPage />;
}
