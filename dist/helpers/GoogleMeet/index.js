"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeetLink = void 0;
const googleapis_1 = require("googleapis");
const uuid_1 = require("uuid");
async function getOAuth2Client(tokens) {
    const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    oauth2Client.setCredentials(tokens);
    return oauth2Client;
}
async function createMeetLink(params, tokens) {
    const { summary, startDate, endDate } = params;
    const oauth2Client = await getOAuth2Client(tokens);
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
    const startDateTime = startDate || new Date().toISOString();
    const endDateTime = endDate || new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(); // Default to 1 hour later
    const event = {
        summary: summary,
        conferenceData: {
            createRequest: {
                requestId: (0, uuid_1.v4)(),
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
exports.createMeetLink = createMeetLink;
