'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import { EnvelopeFill, Github } from 'react-bootstrap-icons';

const teamMembers = [
  {
    name: 'Sakura Takahashi',
    email: 'sakuraet@hawaii.edu',
    role: 'Project Manager',
    bio: 'Sakura is a senior studying Mathematics.',
  },
  {
    name: 'Jiayi Liu',
    email: 'liujiayi@hawaii.edu',
    role: 'Back-End Developer',
    bio: 'Jiayi is a senior studying Mechanical Engineering.',
  },
  {
    name: 'Kacy Kuniyoshi',
    email: 'kacykuni@hawaii.edu',
    role: 'Front-End Developer',
    bio: 'Kacy is a fourth-year studying Information and Computer Science.',
  },
  {
    name: 'Jordan Wong',
    email: 'jordanww@hawaii.edu',
    role: 'Systems Integrator',
    bio: 'Jordan is a fourth-year studying Computer Science.',
  },
  {
    name: 'Alicia Luck',
    email: 'luckmana@hawaii.edu',
    role: 'Developer',
    bio: 'Alicia is a fourth-year studying Information Technology.',
  },
];

export default function ContactPage() {
  return (
    <main>
      <div
        style={{
          backgroundImage: 'linear-gradient(rgba(2, 71, 49, 0.7), rgba(2, 71, 49, 0.7)), url("/campus.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '80px 0',
          textAlign: 'center',
        }}
      >
        <Container>
          <h1 style={{ fontWeight: 600, marginBottom: '20px' }}>About WarriorHub</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            WarriorHub is a centralized platform for UH Mānoa students to discover,
            connect, and experience campus events all in one place. Our goal is to make
            it easier for students to stay engaged with campus life.
          </p>
          <a
            href="https://warriorhub.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-light mt-4"
            style={{ fontWeight: 500 }}
          >
            <Github className="me-2" />
            View Project Documentation
          </a>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center mb-5">
          <Col md={8} className="text-center">
            <h2 style={{ color: '#024731', fontWeight: 600 }}>Contact Us</h2>
            <p className="text-muted">
              Have questions or feedback? Want to become an event organizer and post events
              on WarriorHub? Reach out to any of our team members below by clicking on their
              name to send an email.
            </p>
          </Col>
        </Row>

        <h3 className="text-center mb-4" style={{ color: '#024731', fontWeight: 600 }}>
          Meet the Team
        </h3>
        <Row className="justify-content-center g-4">
          {teamMembers.map((member) => (
            <Col key={member.email} xs={12} sm={6} md={4}>
              <Card className="h-100 text-center shadow-sm">
                <Card.Body>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#024731',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px',
                      fontSize: '2rem',
                      fontWeight: 600,
                    }}
                  >
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <Card.Title>
                    <a
                      href={`mailto:${member.email}`}
                      style={{ color: '#024731', textDecoration: 'none' }}
                    >
                      {member.name}
                    </a>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
                  <Card.Text style={{ fontSize: '0.9rem' }}>{member.bio}</Card.Text>
                  <a
                    href={`mailto:${member.email}`}
                    className="btn btn-outline-success btn-sm"
                  >
                    <EnvelopeFill className="me-1" />
                    Email
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="justify-content-center mt-5">
          <Col md={8}>
            <Card style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
              <Card.Body className="text-center py-4">
                <h5 style={{ color: '#024731' }}>Are you an Event Organizer?</h5>
                <p className="text-muted mb-0">
                  If you represent a student organization or department and would like to
                  post events on WarriorHub, please contact any of our team members to
                  request elevated permissions.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
