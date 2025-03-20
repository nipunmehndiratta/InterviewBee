import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { CustomSession, createGoogleCalendarClient, createMeetingEvent } from '@/lib/google-calendar';
import { checkAuth, createErrorResponse } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as CustomSession;
    
    const authError = checkAuth(session);
    if (authError) return authError;

    const { date, time, timezone } = await request.json();

    // Combine date and time into a single ISO string with timezone
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    const calendar = createGoogleCalendarClient(session.accessToken as string);

    const meetLink = await createMeetingEvent(calendar, {
      summary: 'Scheduled Meeting',
      startDateTime,
      endDateTime,
      timezone: timezone || 'UTC', // Use provided timezone or fallback to UTC
    });

    return NextResponse.json({ meetLink });
  } catch (error) {
    return createErrorResponse(error, 'Failed to schedule meeting');
  }
} 