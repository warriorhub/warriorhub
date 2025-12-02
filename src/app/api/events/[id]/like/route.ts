import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';

/**
 * POST /api/events/[id]/like
 * Mark interest in or remove interest from an event
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { interestedEvents: { where: { id: params.id } } },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    // Only allow USER role to mark interest
    if (user.role !== 'USER') {
      return NextResponse.json(
        { error: 'Only users can mark interest in events' },
        { status: 403 },
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 },
      );
    }

    // Check if already interested
    const alreadyInterested = user.interestedEvents.length > 0;

    if (alreadyInterested) {
      // Remove interest - disconnect the relation
      await prisma.user.update({
        where: { id: user.id },
        data: {
          interestedEvents: {
            disconnect: { id: params.id },
          },
        },
      });

      return NextResponse.json({
        success: true,
        interested: false,
        message: 'Interest removed',
      });
    }

    // Add interest - connect the relation
    await prisma.user.update({
      where: { id: user.id },
      data: {
        interestedEvents: {
          connect: { id: params.id },
        },
      },
    });

    return NextResponse.json({
      success: true,
      interested: true,
      message: 'Interest marked',
    });
  } catch (error) {
    console.error('Interest toggle error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle interest' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/events/[id]/like
 * Check if current user is interested in this event
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ interested: false });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        interestedEvents: {
          where: { id: params.id },
          select: { id: true },
        },
      },
    });

    const interested = (user?.interestedEvents.length ?? 0) > 0;

    return NextResponse.json({ interested });
  } catch (error) {
    console.error('Check interest status error:', error);
    return NextResponse.json({ interested: false });
  }
}
