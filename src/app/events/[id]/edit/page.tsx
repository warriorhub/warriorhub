import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import EditEventForm, { type EventForComponent } from '@/components/EditEventForm';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';
import { toDateTimeLocalHst } from '@/lib/time';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  // Get session
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session || !session.user) {
    redirect('/not-authorized');
  }

  // Get user role and ID
  const userRole = (session.user as { randomKey?: string })?.randomKey;
  const userId = session.user.id;

  // Check if user is a regular USER (not ORGANIZER or ADMIN)
  if (userRole === 'USER') {
    redirect('/not-authorized');
  }

  // Fetch event
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      createdBy: {
        select: {
          id: true,
          email: true,
          organization: true,
        },
      },
      categoriesNew: true,
    },
  });

  if (!event) return notFound();

  // Authorization check:
  // - Admins can edit any event
  // - Organizers can only edit their own events
  const isAdmin = userRole === 'ADMIN';
  const isOrganizer = userRole === 'ORGANIZER';

  if (isOrganizer && !isAdmin) {
    const eventOwnerId = String(event.createdById);
    if (eventOwnerId !== String(userId)) {
      // Organizer trying to edit someone else's event
      redirect('/not-authorized');
    }
  }

  const mapped: EventForComponent = {
    id: event.id,
    title: event.name,
    dateTime: toDateTimeLocalHst(event.dateTime),
    location: event.location,
    organization: event.createdBy?.organization || event.createdBy?.email || 'Unknown',
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
