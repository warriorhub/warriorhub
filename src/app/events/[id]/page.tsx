import { notFound } from 'next/navigation';
import { Badge, Col, Container, Row } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';
import BackLink from '@/components/BackLink';
import LikeButton from '@/components/LikeButton';
import { formatHstDate, formatHstTime } from '@/lib/time';

interface EventDetailsPageProps {
  params: { id: string };
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      createdBy: {
        select: {
          email: true,
          organization: true,
        },
      },
      categoriesNew: true,
    },
  });

  if (!event) {
    return notFound();
  }

  // Get current user session
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  // Get user role and interest status
  let userRole = null;
  let isInterested = false;

  if (userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        interestedEvents: {
          where: { id: params.id },
          select: { id: true },
        },
      },
    });

    if (user) {
      userRole = user.role;
      isInterested = user.interestedEvents.length > 0;
    }
  }

  const dateDisplay = formatHstDate(event.dateTime);
  const timeDisplay = formatHstTime(event.dateTime);

  const displayImage = (() => {
    try {
      const parsed = new URL(event.imageUrl || '');
      const pathname = parsed.pathname.toLowerCase();
      if (/\.(jpe?g|png|gif|webp|avif|bmp|svg)$/.test(pathname)) {
        return event.imageUrl || '/default-event.jpg';
      }
      return '/default-event.jpg';
    } catch {
      return '/default-event.jpg';
    }
  })();

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
                {' at '}
                {timeDisplay}
              </div>
              <div>{event.location}</div>
              <div>
                Hosted by
                {' '}
                {event.createdBy?.organization ?? event.createdBy?.email ?? 'Unknown'}
              </div>
              <div>{event.createdBy.email}</div>
            </div>
            <div className="mb-3">
              {/* Changed to use categoriesNew */}
              {event.categoriesNew && event.categoriesNew.length > 0 ? (
                event.categoriesNew.map((category: { id: number; name: string }) => (
                  <Badge key={category.id} bg="primary" className="me-2">
                    {category.name}
                  </Badge>
                ))
              ) : (
                <span className="text-muted">No categories</span>
              )}
            </div>

            {/* Show Interested button only for USER role */}
            {userRole === 'USER' && (
              <div className="mb-3">
                <LikeButton
                  eventId={params.id}
                  initialInterested={isInterested}
                />
              </div>
            )}

            <p className="lead">
              {event.description || 'No description provided.'}
            </p>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
