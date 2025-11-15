'use client';

import { Container, Row, Col, Table, Form, Card, Badge, Button } from 'react-bootstrap';

export default function SearchEventsMockup() {
  return (
    <main>
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
              <Button variant="secondary" className="mt-2">
                Reset Filters
              </Button>
            </Col>
          </Row>
        </Form>
        <Col className="mb-4">
          <h5>Categories</h5>
          <Button
            style={{ backgroundColor: 'rgb(42, 78, 223)', color: 'white', border: 'none' }}
            size="sm"
            className="me-2 rounded-pill"
          >
            Recreation
          </Button>
          <Button
            style={{ backgroundColor: 'rgb(255, 99, 71)', color: 'white', border: 'none' }}
            size="sm"
            className="me-2 rounded-pill"
          >
            Food
          </Button>
          <Button
            style={{ backgroundColor: 'rgb(0, 166, 0)', color: 'white', border: 'none' }}
            size="sm"
            className="me-2 rounded-pill"
          >
            Career
          </Button>
          <Button
            style={{ backgroundColor: 'rgb(0, 239, 255)', color: 'black', border: 'none' }}
            size="sm"
            className="me-2 rounded-pill"
          >
            Free
          </Button>
          <Button
            style={{ backgroundColor: 'rgb(255, 165, 0)', color: 'white', border: 'none' }}
            size="sm"
            className="me-2 rounded-pill"
          >
            Cultural
          </Button>
          <Button
            style={{ backgroundColor: 'rgb(154, 174, 172)', color: 'black', border: 'none' }}
            size="sm"
            className="me-2 rounded-pill"
          >
            RSVP
          </Button>
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
                <tr>
                  <td>Board Game Night</td>
                  <td>Nov 14, 2025</td>
                  <td>Recreation / Food</td>
                  <td>Game Dev</td>
                  <td>Hamilton Library</td>
                </tr>
                <tr>
                  <td>Career Prep Workshop</td>
                  <td>Nov 20, 2025</td>
                  <td>Career / RSVP</td>
                  <td>NATSCI</td>
                  <td>Campus Center</td>
                </tr>
                <tr>
                  <td>Japan Culture Festival</td>
                  <td>Dec 2, 2025</td>
                  <td>Cultural / Free</td>
                  <td>Student Success Center</td>
                  <td>Campus Center</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="text-center">
            <h3 className="mb-2">Featured Events</h3>
          </Col>
          <Row>
            <Col md={4}>
              <Card className="mb-3 shadow-sm">
                <Card.Img
                  variant="top"
                  src="/StockImgBoardGame.jpg"
                  alt="Board Game Night"
                  className="rounded-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Badge
                    style={{ backgroundColor: 'rgb(42, 78, 223) !important', color: 'white' }}
                    className="me-2"
                  >
                    Recreation
                  </Badge>
                  <Badge
                    style={{ backgroundColor: 'rgb(255, 99, 71) !important', color: 'white' }}
                    className="me-2"
                  >
                    Food
                  </Badge>
                  <Card.Title className="mt-2">Board Game Night</Card.Title>
                  <Card.Text className="mb-1">Game Dev</Card.Text>
                  <Card.Text>Nov 14, 2025 • Hamilton Library</Card.Text>
                  <div className="mt-3">
                    <Button variant="primary">
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="mb-3 shadow-sm">
                <Card.Img
                  variant="top"
                  src="/StockImgCareerFair.jpg"
                  alt="Career Prep Workshop"
                  className="rounded-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Badge
                    style={{ backgroundColor: 'rgb(0, 166, 0) !important', color: 'white' }}
                    className="me-2"
                  >
                    Career
                  </Badge>
                  <Badge
                    style={{ backgroundColor: 'rgb(154, 174, 172) !important', color: 'white' }}
                    className="me-2"
                  >
                    RSVP
                  </Badge>
                  <Card.Title className="mt-2">Career Prep Workshop</Card.Title>
                  <Card.Text className="mb-1">NATSCI</Card.Text>
                  <Card.Text>Nov 20, 2025 • Campus Center</Card.Text>
                  <div className="mt-3">
                    <Button variant="primary">
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="mb-3 shadow-sm">
                <Card.Img
                  variant="top"
                  src="/StockImgJapanCultureFest.jpg"
                  alt="Japan Culture Festival"
                  className="rounded-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Badge
                    style={{ backgroundColor: 'rgb(255, 165, 0) !important', color: 'white' }}
                    className="me-2"
                  >
                    Cultural
                  </Badge>
                  <Badge
                    style={{ backgroundColor: 'rgb(0, 239, 255) !important', color: 'black' }}
                    className="me-2"
                  >
                    Free
                  </Badge>
                  <Card.Title className="mt-2">Japan Culture Festival</Card.Title>
                  <Card.Text className="mb-1">Student Success Center</Card.Text>
                  <Card.Text>Dec 2, 2025 • Campus Center</Card.Text>
                  <div className="mt-3">
                    <Button variant="primary">
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Row>
      </Container>
    </main>
  );
}
