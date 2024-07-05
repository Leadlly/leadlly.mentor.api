import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';

interface CreateMeetLinkParams {
  summary: string;
  startDate?: string; // ISO format date string
  endDate?: string;   // ISO format date string
}

async function getOAuth2Client(tokens: any): Promise<OAuth2Client> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

export async function createMeetLink(params: CreateMeetLinkParams, tokens: any): Promise<string> {
  const { summary, startDate, endDate } = params;
  const oauth2Client = await getOAuth2Client(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const startDateTime = startDate || new Date().toISOString();
  const endDateTime = endDate || new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(); // Default to 1 hour later

  const event = {
    summary: summary,
    conferenceData: {
      createRequest: {
        requestId: uuidv4(),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Kolkata',
    },
  };

  const insertParams = {
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1,
  };

  const response = await calendar.events.insert(insertParams);

  return response.data.hangoutLink || "";
}
