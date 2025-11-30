import { notFound } from 'next/navigation';
import { Badge, Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import BackLink from '@/components/BackLink';

interface EventDetailsPageProps {
  params: { id: string };
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const event = await (prisma as any).event.findUnique({
    where: { id: params.id },
    include: { createdBy: true },
  });

  if (!event) {
    return notFound();
  }

  const date = new Date(event.dateTime);
  const dateDisplay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeDisplay = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const isLikelyImage = /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i.test(event.imageUrl || '');
  const displayImage = isLikelyImage ? event.imageUrl ?? '/default-event.jpg' : '/default-event.jpg';

  return (
    <main>
      <Container className="py-4">
        <div className="mb-3">
          <BackLink label="← Back" fallbackHref="/search" />
        </div>

        <Row className="align-items-start g-4">
          <Col md={6}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%',
                overflow: 'hidden',
                borderRadius: '0.5rem',
                boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.1)',
                backgroundColor: '#f5f5f5',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={event.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </Col>
          <Col md={6}>
            <h1 className="mb-2">{event.name}</h1>
            <div className="mb-3 text-muted">
              <div>
                {dateDisplay}
                {' '}
                at
                {' '}
                {timeDisplay}
              </div>
              <div>{event.location}</div>
              <div>
                Hosted by
                {' '}
                {event.createdBy?.email ?? 'Unknown organizer'}
              </div>
            </div>

            <div className="mb-3">
              {event.categories.map((category: string) => (
                <Badge key={category} bg="primary" className="me-2">
                  {category}
                </Badge>
              ))}
            </div>

            <p className="lead">{event.description || 'No description provided.'}</p>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
