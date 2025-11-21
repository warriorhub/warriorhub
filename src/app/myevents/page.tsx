'use client';

import { Container, Row, Col, Table, Button, Form, Dropdown } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, Check } from 'react-bootstrap-icons';

// StatusIcon component moved outside to avoid defining during render
const StatusIcon = ({ eventStatus }: { eventStatus: string }) => {
  if (eventStatus === 'attending' || eventStatus === 'attended') {
    return <Check size={24} className="text-success" />;
  }
  return <FileText size={24} className="text-muted" />;
};

export default function MyEventsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Container className="py-5 text-center">
        <p>Loading...</p>
      </Container>
    );
  }

  // Sample data - replace with actual API call
  const upcomingEvents = [
    {
      id: 1,
      status: 'registered',
      title: 'Board Game Night',
      organizer: 'Game Dev Club',
      venue: 'Hamilton Library',
      category: 'Recreation',
      isRecurring: false,
      startDate: 'November 25, 2025',
      startTime: '6:00 PM',
      endDate: 'November 25, 2025',
      endTime: '9:00 PM',
    },
    {
      id: 2,
      status: 'attending',
      title: 'Career Prep Workshop',
      organizer: 'Career Services',
      venue: 'Campus Center, Room 301',
      category: 'Career',
      isRecurring: false,
      startDate: 'November 28, 2025',
      startTime: '2:00 PM',
      endDate: 'November 28, 2025',
      endTime: '4:00 PM',
    },
    {
      id: 3,
      status: 'attending',
      title: 'Study Session: ICS 314',
      organizer: 'ICS Department',
      venue: 'POST 318',
      category: 'Academic',
      isRecurring: true,
      startDate: 'November 30, 2025',
      startTime: '4:00 PM',
      endDate: 'November 30, 2025',
      endTime: '6:00 PM',
    },
  ];

  const pastEvents = [
    {
      id: 4,
      status: 'attended',
      title: 'Welcome Week Social',
      organizer: 'Student Life',
      venue: 'Campus Center Courtyard',
      category: 'Social',
      isRecurring: false,
      startDate: 'August 15, 2025',
      startTime: '5:00 PM',
      endDate: 'August 15, 2025',
      endTime: '8:00 PM',
    },
  ];

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  // Filter events based on search
  const filteredEvents = currentEvents.filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main>
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h1 className="mb-0">My Events</h1>
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              size="lg"
              style={{ backgroundColor: '#0d6efd', fontWeight: '600' }}
            >
              ADD NEW
            </Button>
          </Col>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search Event Titles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '300px' }}
            />
          </Col>
        </Row>

        {/* Tabs and Display Options */}
        <Row className="mb-3 align-items-center">
          <Col>
            <div className="d-flex gap-2">
              <Button
                variant={activeTab === 'upcoming' ? 'dark' : 'outline-secondary'}
                onClick={() => setActiveTab('upcoming')}
                style={{ fontWeight: activeTab === 'upcoming' ? '600' : '400' }}
              >
                UPCOMING EVENTS
              </Button>
              <Button
                variant={activeTab === 'past' ? 'dark' : 'outline-secondary'}
                onClick={() => setActiveTab('past')}
                style={{ fontWeight: activeTab === 'past' ? '600' : '400' }}
              >
                PAST EVENTS
              </Button>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="display-dropdown">
                  DISPLAY OPTION ▼
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Table View</Dropdown.Item>
                  <Dropdown.Item>Card View</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2 align-items-center">
              <Button variant="light" size="sm" style={{ minWidth: '40px' }}>
                1
              </Button>
              <Button variant="outline-primary" size="sm" style={{ minWidth: '40px' }}>
                2
              </Button>
              <Button variant="outline-primary" size="sm" style={{ minWidth: '40px' }}>
                3
              </Button>
              <Button variant="outline-primary" size="sm" style={{ minWidth: '40px' }}>
                4
              </Button>
            </div>
          </Col>
        </Row>

        {/* Events Table */}
        <Row>
          <Col>
            <Table hover responsive className="bg-white">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>STATUS</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>TITLE</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>ORGANIZER</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>VENUE</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>CATEGORY</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>RECURRING?</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>START DATE</th>
                  <th style={{ fontWeight: '600', color: '#6c757d' }}>END DATE</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="text-center">
                        <StatusIcon eventStatus={event.status} />
                      </td>
                      <td>
                        <div>
                          <strong>{event.title}</strong>
                          <div className="text-muted small">
                            <a href={`/events/${event.id}`} className="text-primary me-2">
                              View
                            </a>
                            |
                            <a href={`/events/${event.id}/edit`} className="text-primary ms-2">
                              Edit
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>{event.organizer}</td>
                      <td>{event.venue || '—'}</td>
                      <td>{event.category}</td>
                      <td>{event.isRecurring ? 'Yes' : 'No'}</td>
                      <td>
                        {event.startDate}
                        {event.startTime && (
                          <>
                            <br />
                            <span className="text-muted small">{event.startTime}</span>
                          </>
                        )}
                      </td>
                      <td>
                        {event.endDate}
                        {event.endTime && (
                          <>
                            <br />
                            <span className="text-muted small">{event.endTime}</span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <p className="text-muted mb-3">No events found</p>
                      {searchQuery && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear Search
                        </Button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
