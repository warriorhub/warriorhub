import { Badge, Button, Card } from 'react-bootstrap';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  organization: string;
  categories: string[];
  image: string;
  onView: () => void;
}

export default function EventCard({
  title,
  date,
  location,
  organization,
  categories,
  image,
  onView,
}: EventCardProps) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Img
        variant="top"
        src={image}
        alt={title}
        className="rounded-top"
        style={{ height: '180px', objectFit: 'cover' }}
      />

      <Card.Body>
        {categories.map((c) => (
          <Badge
            key={c}
            className="me-2"
            style={{ backgroundColor: '#007bff', color: 'white' }}
          >
            {c}
          </Badge>
        ))}

        <Card.Title className="mt-2">{title}</Card.Title>

        <Card.Text>
          {date}
          {' '}
          •
          {location}
          <br />
          {organization}
        </Card.Text>

        <div className="mt-3">
          <Button variant="primary" onClick={onView}>
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
