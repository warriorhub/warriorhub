'use client';

import { useSession } from 'next-auth/react';
import LandingPage from '@/components/LandingPage';
// import UserHome from '@/components/UserHome';
import { Container } from 'react-bootstrap';

/** The Home/Root page */
export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Container className="py-5 text-center">
        <p>Loading...</p>
      </Container>
    );
  }

  // Show UserHome if logged in, otherwise show LandingPage
  return session ? <UserHome /> : <LandingPage />;
}
