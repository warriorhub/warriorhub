'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import EventCard from '@/components/EventCard';

// --------------------- ADD THIS FUNCTION HERE ---------------------
async function getOrganizationsBatch(emails: string[]) {
  const response = await fetch(`/api/organizations?emails=${emails.join('', '')}`);
  const data = await response.json(); // expects [{ email, name }]
  const orgMap: Record<string, string> = {};
  data.forEach((org: { email: string; name: string }) => {
    orgMap[org.email] = org.name;
  });
  return orgMap;
}
// -------------------------------------------------------------------

type EventCardItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  organization: string;
  categories: string[];
  image: string;
};

type DBEvent = {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  createdBy?: { email?: string };
  categories?: string[];
  imageUrl?: string | null;
};

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [featuredEvents, setFeaturedEvents] = useState<EventCardItem[]>([]);

  const [orgNames, setOrgNames] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchOrgNames() {
      if (featuredEvents.length === 0) return;

      const emails = featuredEvents.map(event => event.organization);
      const namesMap = await getOrganizationsBatch(emails);
      setOrgNames(namesMap);
    }

    fetchOrgNames();
  }, [featuredEvents]);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error(`Events request failed: ${res.status}`);

        const data: DBEvent[] = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid events response');

        const mapped: EventCardItem[] = data.slice(0, 3).map((event) => ({
          id: event.id,
          title: event.name,
          date: new Date(event.dateTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          location: event.location,
          organization: event.createdBy?.email ?? 'Unknown',
          categories: event.categories ?? [],
          image: event.imageUrl ?? '/default-event.jpg',
        }));

        setFeaturedEvents(mapped);
      } catch (error) {
        console.error('Error loading featured events:', error);
        setFeaturedEvents([]);
      }
    };

    fetchFeaturedEvents();
  }, []);

  const goToEvent = (id: string) => router.push(`/events/${id}`);

  return (
    <main>
      {/* Hero Section */}
      <section
        className="hero-section position-relative d-flex align-items-center"
        style={{
          minHeight: '600px',
          backgroundImage: 'url(/campus.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        />
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <Row className="justify-content-center text-center align-items-center">
            {/* UH Logo */}
            <Col xs={12} className="mb-4">
              <Image
                src="/uhlogo.png"
                alt="UH Logo"
                width={200}
                height={200}
                style={{
                  filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.7))',
                  maxWidth: '200px',
                  height: 'auto',
                }}
                priority
              />
            </Col>
            <Col lg={10}>
              <h1
                className="display-2 fw-bold text-white mb-3"
                style={{
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
                  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                }}
              >
                Welcome to WarriorHub
              </h1>
              <div
                className="mx-auto mb-4"
                style={{
                  width: '300px',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, white, transparent)',
                }}
              />
              <p
                className="lead fs-3 text-white mb-0"
                style={{
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  padding: '15px 30px',
                  display: 'inline-block',
                  borderRadius: '8px',
                }}
              >
                Discover, connect, and experience UH Mānoa events all in one place
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Events Section */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-5" style={{ fontSize: '2.5rem', fontWeight: 600 }}>
            Featured Events
          </h2>
          <Row className="g-4">
            {featuredEvents.length > 0 ? (
              featuredEvents.map((event) => (
                <Col md={4} key={event.id}>
                  <EventCard
                    title={event.title}
                    date={event.date}
                    location={event.location}
                    organization={orgNames[event.organization] || event.organization}
                    categories={event.categories}
                    image={event.image}
                    onView={() => goToEvent(event.id)}
                    onVisit={() => goToEvent(event.id)}
                  />
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-center text-muted">
                  No featured events yet. Check the search page for more.
                </p>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">Features</h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="text-center">
                <div className="mb-3">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 d-inline-flex
                  align-items-center justify-content-center"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <span className="fs-1">📅</span>
                  </div>
                </div>
                <h4>Browse Events</h4>
                <p className="text-muted">
                  Students can browse and RSVP for events that interest them
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="mb-3">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center
                  justify-content-center"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <span className="fs-1">✏️</span>
                  </div>
                </div>
                <h4>Create Events</h4>
                <p className="text-muted">
                  Organizers can create and manage their events
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="mb-3">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 d-inline-flex
                  align-items-center justify-content-center"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <span className="fs-1">🛡️</span>
                  </div>
                </div>
                <h4>Quality Control</h4>
                <p className="text-muted">
                  Admins validate new events and maintain event quality
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default LandingPage;
