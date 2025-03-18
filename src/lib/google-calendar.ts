import { google } from 'googleapis';
import { Session } from 'next-auth';

export interface CustomSession extends Session {
  accessToken?: string;
}

export function createGoogleCalendarClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID!,
    process.env.GOOGLE_SECRET!,
    process.env.NEXTAUTH_URL + '/api/auth/callback/google'
  );

  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export interface MeetingEvent {
  summary: string;
  startDateTime: Date;
  endDateTime: Date;
}

export async function createMeetingEvent(calendar: any, event: MeetingEvent) {
  const calendarEvent = {
    summary: event.summary,
    start: {
      dateTime: event.startDateTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: event.endDateTime.toISOString(),
      timeZone: 'UTC',
    },
    conferenceData: {
      createRequest: {
        requestId: Date.now().toString(),
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: calendarEvent,
  });

  const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;
  
  if (!meetLink) {
    throw new Error('Failed to create meeting link');
  }

  return meetLink;
} 