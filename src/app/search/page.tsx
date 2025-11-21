'use client';

import { useState } from 'react';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import EventDetailsForm from '../../components/EventDetailsForm';
import EventCard from '../../components/EventCard';

const SearchEventsMockup = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const closeModal = () => setShowDetails(false);

  const featuredEvents = [
    {
      title: 'Board Game Night',
      date: 'Nov 14, 2025',
      location: 'Hamilton Library',
      organization: 'Game Dev',
      description: 'Join us for a fun night of board games!',
      categories: ['Recreation', 'Free-Food'],
      image: '/StockImgBoardGame.jpg',
    },
    {
      title: 'Career Prep Workshop',
      date: 'Nov 20, 2025',
      location: 'Campus Center',
      organization: 'NATSCI',
      description: 'Learn skills to prep for your future career!',
      categories: ['Career', 'RSVP'],
      image: '/StockImgCareerFair.jpg',
    },
    {
      title: 'Japan Culture Festival',
      date: 'Dec 2, 2025',
      location: 'Campus Center',
      organization: 'Student Success Center',
      description: 'Experience traditional Japanese culture and food!',
      categories: ['Cultural', 'Free'],
      image: '/StockImgJapanCultureFest.jpg',
    },
  ];

  return (
    <main>
      <Container id="search-events" fluid className="py-4">
        <Row className="mb-4">
          {' '}
          <h1 className="mb-3">Search Events</h1>
          {' '}
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
              <Button variant="secondary" className="mt-2">
                Reset Filters
              </Button>
            </Col>
          </Row>
        </Form>
        <Col className="mb-4">
          <h5>Categories</h5>
          {['Recreation', 'Food', 'Career', 'Free', 'Cultural', 'RSVP'].map((c, i) => (
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
        <Row>
          <Col className="text-center">
            <h3 className="mb-3">Upcoming Events</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Organization</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {featuredEvents.map((event) => (
                  <tr key={event.title}>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.categories.join(' / ')}</td>
                    <td>{event.organization}</td>
                    <td>{event.location}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row className="mt-5 g-4">
          {featuredEvents.map((event) => (
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
    </main>
  );
};

export default SearchEventsMockup;
