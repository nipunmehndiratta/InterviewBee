import { google } from 'googleapis';
import { Session } from 'next-auth';
import { calendar_v3 } from 'googleapis';

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
  timezone?: string;
}

export async function createMeetingEvent(calendar: calendar_v3.Calendar, event: MeetingEvent) {
  const calendarEvent = {
    summary: event.summary,
    start: {
      dateTime: event.startDateTime.toISOString(),
      timeZone: event.timezone || 'UTC',
    },
    end: {
      dateTime: event.endDateTime.toISOString(),
      timeZone: event.timezone || 'UTC',
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

export async function createInstantMeetOnly(calendar: calendar_v3.Calendar) {
  const conference = {
    createRequest: {
      requestId: Date.now().toString(),
      conferenceSolutionKey: { type: 'hangoutsMeet' }
    }
  };

  // Create a temporary event that will be immediately deleted
  const tempEvent = {
    summary: 'Instant Meeting',
    start: {
      dateTime: new Date().toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      timeZone: 'UTC',
    },
    conferenceData: conference,
    visibility: 'private',
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: tempEvent,
  });

  const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;
  
  if (!meetLink) {
    throw new Error('Failed to create meeting link');
  }

  // Delete the temporary event immediately
  if (response.data.id) {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: response.data.id,
    });
  }

  return meetLink;
} 