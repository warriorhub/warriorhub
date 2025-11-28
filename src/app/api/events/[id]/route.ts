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

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: {
      name: body.name,
      description: body.description,
      location: body.location,
      dateTime: new Date(body.dateTime),
      categories: body.categories,
      imageUrl: body.imageUrl,
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
