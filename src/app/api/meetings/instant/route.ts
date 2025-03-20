import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { CustomSession, createGoogleCalendarClient, createInstantMeetOnly } from '@/lib/google-calendar';
import { checkAuth, createErrorResponse } from '@/lib/api-utils';

export async function POST() {
  try {
    const session = await getServerSession(authOptions) as CustomSession;
    
    const authError = checkAuth(session);
    if (authError) return authError;

    const calendar = createGoogleCalendarClient(session.accessToken as string);
    const meetLink = await createInstantMeetOnly(calendar);

    return NextResponse.json({ meetLink });
  } catch (error) {
    return createErrorResponse(error, 'Failed to create meeting');
  }
} 