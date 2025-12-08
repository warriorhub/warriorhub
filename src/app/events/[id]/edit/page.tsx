import { notFound } from 'next/navigation';
import EditEventForm, { type EventForComponent } from '@/components/EditEventForm';
import { prisma } from '@/lib/prisma';

const formatDateTimeLocal = (date: Date) => date.toISOString().slice(0, 16);

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      createdBy: true,
      categoriesNew: true,
    },
  });

  if (!event) return notFound();

  const mapped: EventForComponent = {
    id: event.id,
    title: event.name,
    dateTime: formatDateTimeLocal(new Date(event.dateTime)),
    location: event.location,
    organization: event.createdBy?.email ?? 'Unknown',
    categoriesNew: event.categoriesNew ?? [],
    description: event.description ?? '',
    image: event.imageUrl ?? '/default-event.jpg',
  };

  return (
    <main>
      <div className="container py-4">
        <h1 className="mb-4">Edit Event</h1>
        <EditEventForm event={mapped} />
      </div>
    </main>
  );
}
