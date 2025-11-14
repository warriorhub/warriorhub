import { Container, Row, Col, Table, Form, Card } from 'react-bootstrap';

export default function SearchEventsMockup() {
  return (
    <main>
      <Container id="search-events" fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="mb-3">Search Events</h1>

            <Form>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search for events..."
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4 className="mb-3">Upcoming Events</h4>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Board Game Night</td>
                  <td>Nov 14, 2025</td>
                  <td>Recreation</td>
                  <td>Hamilton Library</td>
                </tr>
                <tr>
                  <td>Career Prep Workshop</td>
                  <td>Nov 20, 2025</td>
                  <td>Career / Academic</td>
                  <td>Campus Center 308</td>
                </tr>
                <tr>
                  <td>Hawaiian Culture Festival</td>
                  <td>Dec 2, 2025</td>
                  <td>Cultural</td>
                  <td>Hemenway Courtyard</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h4 className="mb-3">Card View (Optional)</h4>
          </Col>

          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Board Game Night</Card.Title>
                <Card.Text>Nov 14, 2025 • Hamilton Library</Card.Text>
                <Card.Text className="text-muted">Recreation</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Career Prep Workshop</Card.Title>
                <Card.Text>Nov 20, 2025 • Campus Center 308</Card.Text>
                <Card.Text className="text-muted">Career</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Hawaiian Culture Festival</Card.Title>
                <Card.Text>Dec 2, 2025 • Hemenway Courtyard</Card.Text>
                <Card.Text className="text-muted">Cultural</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
