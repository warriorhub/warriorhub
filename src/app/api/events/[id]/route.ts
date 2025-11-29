import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { adminProtectedPage } from '@/lib/page-protection';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const eventId = params.id;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  return NextResponse.json(event);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as { user: { email: string; id: string; randomKey: string } } | null,
  );

  const eventId = params.id;
  const body = await req.json();

  const validCategories = [
    'Recreation',
    'Food',
    'Career',
    'Free',
    'Cultural',
    'Academic',
    'Social',
    'Sports',
    'Workshop',
  ];
  const categoriesCleaned = Array.isArray(body.categories)
    ? body.categories.filter((c: string) => validCategories.includes(c))
    : [];

  const cleanedDate = new Date(body.dateTime);
  if (Number.isNaN(cleanedDate.getTime())) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: {
      name: body.name,
      description: body.description ?? '',
      location: body.location,
      dateTime: cleanedDate.toISOString(),
      categories: categoriesCleaned,
      imageUrl: body.imageUrl || null,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as { user: { email: string; id: string; randomKey: string } } | null,
  );

  const eventId = params.id;

  await prisma.event.delete({ where: { id: eventId } });

  return NextResponse.json({ message: 'Event deleted' });
}
