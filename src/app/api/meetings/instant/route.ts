import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { CustomSession, createGoogleCalendarClient, createMeetingEvent } from '@/lib/google-calendar';
import { checkAuth, createErrorResponse } from '@/lib/api-utils';

export async function POST() {
  try {
    const session = await getServerSession(authOptions) as CustomSession;
    
    const authError = checkAuth(session);
    if (authError) return authError;

    const calendar = createGoogleCalendarClient(session.accessToken as string);
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const meetLink = await createMeetingEvent(calendar, {
      summary: 'Instant Meeting',
      startDateTime: now,
      endDateTime: oneHourLater,
    });

    return NextResponse.json({ meetLink });
  } catch (error) {
    return createErrorResponse(error, 'Failed to create meeting');
  }
} 