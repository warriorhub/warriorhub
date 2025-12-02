import { Badge, Button, Card } from 'react-bootstrap';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  organization: string;
  categories: string[];
  image: string;
  onView: () => void;
  onVisit?: () => void;
}

export default function EventCard({
  title,
  date,
  location,
  organization,
  categories,
  image,
  onView,
  onVisit,
}: EventCardProps) {
  const handleVisit = onVisit ?? onView;
  const isLikelyImage = (() => {
    try {
      const parsed = new URL(image);
      const pathname = parsed.pathname.toLowerCase();
      return /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/.test(pathname);
    } catch {
      return /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i.test(image || '');
    }
  })();
  const displayImage = isLikelyImage ? image : '/default-event.jpg';

  return (
    <Card
      className="mb-3 shadow-sm h-100 d-flex flex-column"
      style={{ minHeight: '100%', maxHeight: '100%' }}
    >
      <div
        className="rounded-top"
        role="img"
        aria-label={title}
        style={{
          height: '200px',
          width: '100%',
          backgroundImage: `url(${displayImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#f5f5f5',
        }}
      />

      <Card.Body className="d-flex flex-column">
        <div className="d-flex flex-wrap gap-2 mb-2">
          {categories.map((c) => (
            <Badge
              key={c}
              style={{ backgroundColor: '#007bff', color: 'white', display: 'inline-block' }}
            >
              {c}
            </Badge>
          ))}
        </div>

        <Card.Title className="mt-3">{title}</Card.Title>

        <Card.Text className="flex-grow-1">
          {date}
          {' '}
          •
          {location}
          <br />
          {organization}
        </Card.Text>

        <div className="mt-3 d-flex gap-2 flex-wrap">
          <Button variant="primary" onClick={handleVisit}>
            Visit Page
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

EventCard.defaultProps = {
  onVisit: undefined,
};
