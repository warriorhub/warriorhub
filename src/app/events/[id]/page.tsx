import Image from 'next/image';
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

  return (
    <main>
      <Container className="py-4">
        <div className="mb-3">
          <BackLink label="← Back" fallbackHref="/search" />
        </div>

        <Row className="align-items-start g-4">
          <Col md={6}>
            <Image
              src={event.imageUrl || '/default-event.jpg'}
              alt={event.name}
              width={800}
              height={500}
              className="rounded shadow-sm"
              style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            />
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
