import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import AddEventForm from '@/components/AddEventForm';
import authOptions from '@/lib/authOptions';

export default async function AddEventPage() {
  // Get session
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session || !session.user) {
    redirect('/not-authorized');
  }

  // Get user role
  const userRole = session.user?.randomKey;

  // Only ORGANIZER and ADMIN can create events
  if (userRole !== 'ORGANIZER' && userRole !== 'ADMIN') {
    redirect('/not-authorized');
  }

  return (
    <main>
      <div className="container py-4">
        <AddEventForm />
      </div>
    </main>
  );
}
