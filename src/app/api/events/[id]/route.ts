import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';

const getAuthContext = async (req: NextRequest) => {
  const [token, session] = await Promise.all([
    getToken({ req, secret: process.env.NEXTAUTH_SECRET }),
    getServerSession(authOptions),
  ]);
  const tokenRole = (token as { randomKey?: string } | null)?.randomKey;
  const sessionRole = (session?.user as { randomKey?: string } | undefined)?.randomKey;

  return {
    userId: token?.id ?? session?.user?.id,
    randomKey: tokenRole ?? sessionRole,
  };
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            organization: true, // Add this
          },
        },
        categoriesNew: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await getAuthContext(req);
    if (!auth.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isOwner = String(auth.userId) === String(existing.createdById);
    const isAdmin = auth.randomKey === 'ADMIN';

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      dateTime,
      location,
      categoriesNew, // Changed from categories
      imageUrl,
    } = body;

    if (!name || !dateTime || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = await prisma.event.update({
      where: { id: params.id },
      data: {
        name,
        description: description || null,
        dateTime: new Date(dateTime),
        location,
        categoriesNew: {
          set: [], // Clear existing categories
          connect: categoriesNew || [], // Connect new ones: [{id: 1}, {id: 2}]
        },
        imageUrl: imageUrl || '/default-event.jpg',
      },
      include: {
        createdBy: true,
        categoriesNew: true, // Include in response
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await getAuthContext(req);
    if (!auth.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (auth.randomKey !== 'ADMIN' && Number(auth.userId) !== existing.createdById) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.event.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
