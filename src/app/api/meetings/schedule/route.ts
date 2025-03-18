import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { CustomSession, createGoogleCalendarClient, createMeetingEvent } from '@/lib/google-calendar';
import { checkAuth, createErrorResponse } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as CustomSession;
    
    const authError = checkAuth(session);
    if (authError) return authError;

    const { date, time } = await request.json();

    // Combine date and time into a single ISO string
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    const calendar = createGoogleCalendarClient(session.accessToken as string);

    const meetLink = await createMeetingEvent(calendar, {
      summary: 'Scheduled Meeting',
      startDateTime,
      endDateTime,
    });

    return NextResponse.json({ meetLink });
  } catch (error) {
    return createErrorResponse(error, 'Failed to schedule meeting');
  }
} 