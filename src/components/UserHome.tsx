'use client';

import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import Image from 'next/image';

const UserHome: React.FC = () => (
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
          {/* Board Game Night */}
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src="/StockImgBoardGame.jpg"
                alt="Board Game Night"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <div className="mb-2">
                  <Badge
                    className="me-1"
                    style={{ backgroundColor: 'rgb(42, 78, 223) !important', color: 'white' }}
                  >
                    Recreation
                  </Badge>
                  <Badge
                    style={{ backgroundColor: 'rgb(255, 99, 71) !important', color: 'white' }}
                  >
                    Food
                  </Badge>
                </div>
                <Card.Title className="fw-bold">Board Game Night</Card.Title>
                <Card.Text className="text-muted small mb-1">
                  Nov 14, 2025 • Hamilton Library
                </Card.Text>
                <Card.Text className="mb-3">
                  Join us for an evening of board games, snacks, and fun with fellow students!
                </Card.Text>
                <Button variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Career Prep Workshop */}
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src="/StockImgCareerFair.jpg"
                alt="Career Prep Workshop"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <div className="mb-2">
                  <Badge
                    className="me-1"
                    style={{ backgroundColor: 'rgb(0, 166, 0) !important', color: 'white' }}
                  >
                    Career
                  </Badge>
                  <Badge
                    style={{ backgroundColor: 'rgb(154, 174, 172) !important', color: 'white' }}
                  >
                    RSVP
                  </Badge>
                </div>
                <Card.Title className="fw-bold">Career Prep Workshop</Card.Title>
                <Card.Text className="text-muted small mb-1">
                  Nov 20, 2025 • Campus Center
                </Card.Text>
                <Card.Text className="mb-3">
                  Get ready for career fair season with resume reviews and interview tips.
                </Card.Text>
                <Button variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Japan Culture Festival */}
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src="/StockImgJapanCultureFest.jpg"
                alt="Japan Culture Festival"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <div className="mb-2">
                  <Badge
                    className="me-1"
                    style={{ backgroundColor: 'rgb(255, 165, 0) !important', color: 'white' }}
                  >
                    Cultural
                  </Badge>
                  <Badge
                    style={{ backgroundColor: 'rgb(0, 239, 255) !important', color: 'white' }}
                  >
                    Free
                  </Badge>
                </div>
                <Card.Title className="fw-bold">Japan Culture Festival</Card.Title>
                <Card.Text className="text-muted small mb-1">
                  Dec 2, 2025 • Campus Center
                </Card.Text>
                <Card.Text className="mb-3">
                  Experience Japanese culture through food, performances, and activities.
                </Card.Text>
                <Button variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
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

export default UserHome;
