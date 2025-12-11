'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { formatHstShortDate } from '@/lib/time';
import EventCard from '../../components/EventCard';
import EventDetailsForm from '../../components/EventDetailsForm';

type CategoryNew = {
  id: number;
  name: string;
  description?: string;
};

type DBEvent = {
  createdBy: any;
  id: string;
  name: string;
  dateTime: string;
  location: string;
  organizer: string;
  description: string | null;
  categoriesNew: CategoryNew[]; // Changed
  imageUrl: string | null;
};

type EventForComponent = {
  id: string;
  title: string;
  dateTime: string;
  date: string;
  location: string;
  organization: string;
  categoriesNew: CategoryNew[]; // Changed
  description: string;
  image: string;
};

const isSameDate = (date1: string, date2: string) => formatHstShortDate(date1) === formatHstShortDate(date2);

const SearchEvents = () => {
  const router = useRouter();
  const [events, setEvents] = useState<EventForComponent[]>([]);
  const [availableCategories, setAvailableCategories] = useState<CategoryNew[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventForComponent | null>(null);

  const [searchFilters, setSearchFilters] = useState({
    name: '',
    organization: '',
    location: '',
    date: '',
    categoryId: 0, // Changed to store category ID
  });

  const openModal = (event: EventForComponent) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const closeModal = () => setShowDetails(false);

  // Fetch available categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setAvailableCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Fetch events from DB
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events?futureOnly=true');
        if (!res.ok) throw new Error(`Events request failed: ${res.status}`);

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid events response');

        const mapped: EventForComponent[] = data.map((e: DBEvent) => {
          return {
            id: e.id,
            title: e.name,
            dateTime: e.dateTime,
            date: formatHstShortDate(e.dateTime),
            location: e.location,
            organization: e.createdBy?.organization || e.createdBy?.email || 'Unknown',
            categoriesNew: e.categoriesNew || [], // Changed
            description: e.description ?? '',
            image: e.imageUrl ?? '/default-event.jpg',
          };
        });

        setEvents(mapped);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category selection
  const handleCategoryClick = (categoryId: number) => {
    setSearchFilters((prev) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? 0 : categoryId,
    }));
  };

  // Reset all filters
  const handleReset = () => {
    setSearchFilters({
      name: '',
      organization: '',
      location: '',
      date: '',
      categoryId: 0,
    });
  };

  // Helper function for button colors
  const getCategoryButtonColor = (categoryId: number, index: number) => {
    if (searchFilters.categoryId === categoryId) return 'rgb(0,150,136)'; // selected
    if (index % 2 === 0) return 'rgb(42,78,223)'; // even
    return 'rgb(255,99,71)'; // odd
  };

  // Filter events based on search criteria
  const filteredEvents = events.filter((event) => {
    const matchesName = event.title.toLowerCase().includes(searchFilters.name.toLowerCase());
    const matchesOrg = event.organization.toLowerCase().includes(searchFilters.organization.toLowerCase());
    const matchesLocation = event.location.toLowerCase().includes(searchFilters.location.toLowerCase());
    const matchesDate = searchFilters.date
      ? isSameDate(event.dateTime, searchFilters.date)
      : true;
    const matchesCategory = searchFilters.categoryId
      ? event.categoriesNew.some(c => c.id === searchFilters.categoryId)
      : true;

    return matchesName && matchesOrg && matchesLocation && matchesDate && matchesCategory;
  });

  return (
    <Container id="search-events" fluid className="py-4">
      <Row className="mb-4">
        <h1 className="mb-3">Search Events</h1>
      </Row>

      <Form className="mb-4 p-3 border rounded shadow-sm" onSubmit={(e) => e.preventDefault()}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by event name"
                name="name"
                value={searchFilters.name}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Organization</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by organization"
                name="organization"
                value={searchFilters.organization}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by location"
                name="location"
                value={searchFilters.location}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={searchFilters.date}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Button variant="primary" className="me-2">
              Search
            </Button>
            <Button variant="secondary" className="me-2" onClick={handleReset}>
              Reset Filters
            </Button>
          </Col>
        </Row>
      </Form>

      <Col className="mb-4">
        <h5>Categories</h5>
        {availableCategories.map((c, i) => (
          <Button
            key={c.id}
            style={{
              backgroundColor: getCategoryButtonColor(c.id, i),
              color: 'white',
              border: 'none',
            }}
            size="sm"
            className="me-2 rounded-pill mb-2"
            onClick={() => handleCategoryClick(c.id)}
          >
            {c.name}
          </Button>
        ))}
      </Col>

      <Row className="mt-5 g-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Col md={4} key={event.id}>
              <EventCard
                title={event.title}
                date={event.date}
                location={event.location}
                organization={event.organization}
                categories={event.categoriesNew.map(c => c.name)} // Convert to string array for EventCard
                image={event.image}
                onView={() => openModal(event)}
                onVisit={() => router.push(`/events/${event.id}`)}
              />
            </Col>
          ))
        ) : (
          <Col>
            <p>No events match your search criteria.</p>
          </Col>
        )}
      </Row>

      <EventDetailsForm show={showDetails} event={selectedEvent} onClose={closeModal} />
    </Container>
  );
};

export default SearchEvents;
