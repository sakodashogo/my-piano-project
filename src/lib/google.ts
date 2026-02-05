import { google } from 'googleapis';
import path from 'path';

// Define scopes
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
];

// Load credentials from Environment Variable (for Vercel) or File (for Local)
const getAuthOptions = () => {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        try {
            const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
            return {
                credentials,
                scopes: SCOPES,
            };
        } catch (error) {
            console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY", error);
        }
    }

    // Fallback to local file
    return {
        keyFile: path.join(process.cwd(), 'service-account.json'),
        scopes: SCOPES,
    };
};

const auth = new google.auth.GoogleAuth(getAuthOptions());

export const getSheetsClient = async () => {
    const client = await auth.getClient();
    return google.sheets({ version: 'v4', auth: client as any });
};

export const getCalendarClient = async () => {
    const client = await auth.getClient();
    return google.calendar({ version: 'v3', auth: client as any });
};

export const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "";
