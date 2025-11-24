'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import EventCard from '../../components/EventCard';
import EventDetailsForm from '../../components/EventDetailsForm';

type DBEvent = {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  organizer: string;
  description: string | null;
  categories: string[];
  imageUrl: string | null;
};

type EventForComponent = {
  title: string;
  date: string;
  location: string;
  organization: string;
  categories: string[];
  description: string;
  image: string;
};

const SearchEvents = () => {
  const [events, setEvents] = useState<EventForComponent[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventForComponent | null>(null);

  const openModal = (event: EventForComponent) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const closeModal = () => setShowDetails(false);

  // Category buttons
  const categoryButtons = ['Recreation', 'Food', 'Career', 'Free', 'Cultural', 'RSVP'];

  // Fetch events from DB
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/events');
      const data: DBEvent[] = await res.json();

      // Map database events to EventForComponent shape
      const mapped: EventForComponent[] = data.map((e) => ({
        title: e.name,
        date: new Date(e.dateTime).toLocaleDateString(),
        location: e.location,
        organization: e.organizer,
        categories: e.categories,
        description: e.description ?? '', // replace null with empty string
        image: e.imageUrl ?? '/default-event.jpg', // placeholder
      }));

      setEvents(mapped);
    };

    fetchEvents();
  }, []);

  return (
    <Container id="search-events" fluid className="py-4">
      <Row className="mb-4">
        <h1 className="mb-3">Search Events</h1>
      </Row>

      <Form className="mb-4 p-3 border rounded shadow-sm">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Event Name</Form.Label>
              <Form.Control type="text" placeholder="Search by event name" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Organization</Form.Label>
              <Form.Control type="text" placeholder="Search by organization" />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" placeholder="Search by location" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Button variant="primary" className="me-2">
              Search
            </Button>
            <Button variant="secondary" className="me-2">
              Reset Filters
            </Button>
          </Col>
        </Row>
      </Form>

      <Col className="mb-4">
        <h5>Categories</h5>
        {categoryButtons.map((c, i) => (
          <Button
            key={c}
            style={{
              backgroundColor: i % 2 === 0 ? 'rgb(42,78,223)' : 'rgb(255,99,71)',
              color: 'white',
              border: 'none',
            }}
            size="sm"
            className="me-2 rounded-pill mb-2"
          >
            {c}
          </Button>
        ))}
      </Col>

      <Row className="mt-5 g-4">
        {events.map((event) => (
          <Col md={4} key={event.title}>
            <EventCard
              title={event.title}
              date={event.date}
              location={event.location}
              organization={event.organization}
              categories={event.categories}
              image={event.image}
              onView={() => openModal(event)}
            />
          </Col>
        ))}
      </Row>

      <EventDetailsForm
        show={showDetails}
        event={selectedEvent}
        onClose={closeModal}
      />
    </Container>
  );
};

export default SearchEvents;
