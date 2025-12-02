/* eslint-disable import/prefer-default-export */
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { dateTime: 'asc' },
      include: {
        createdBy: true,
        categoriesNew: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const [token, session] = await Promise.all([
      getToken({ req, secret: process.env.NEXTAUTH_SECRET }),
      getServerSession(authOptions),
    ]);
    const userId = (token as any)?.id ?? (token as any)?.sub ?? (session as any)?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // todo: validate shape of data with Zod, especially for new category object
    const {
      name,
      description,
      dateTime,
      location,
      categories,
      categoriesNew,
      imageUrl,
    } = body;

    if (!name || !dateTime || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await prisma.event.create({
      data: {
        name,
        description: description || null,
        dateTime: new Date(dateTime),
        location,
        categories: categories || [],
        categoriesNew: {
          // use connect to prevent users from creating new categories
          // Prisma Client will throw an exception if any record cannot be found
          connect: categoriesNew,
        },
        imageUrl: imageUrl || '/default-event.jpg',
        createdById: Number(userId),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 },
    );
  }
}
