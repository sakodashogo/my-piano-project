"use server";

import { getSheetsClient, SPREADSHEET_ID } from "../lib/google";

interface Piece {
    id: number;
    title: string;
    progress: number;
    status: "active" | "completed";
    startedAt: string;
    completedAt?: string;
    coverImage?: string;
}

interface LessonNote {
    id: number;
    date: string;
    content: string;
    pieces?: string[];
}

export interface Student {
    id: number;
    name: string;
    phone: string;
    address: string;
    lessonDay: string;
    pieces: Piece[];
    color: string;
    email?: string;
    parentName?: string;
    parentPhone?: string;
    birthDate?: string;
    memo?: string;
    archived?: boolean;
    lessonNotes?: LessonNote[];
    parentAccessToken?: string;
}

const SHEET_NAME = "Students";
const NOTES_SHEET = "LessonNotes";
const TOKENS_SHEET = "ParentTokens";

// Get student by parent access token
export async function getStudentByToken(token: string): Promise<Student | null> {
    try {
        const sheets = await getSheetsClient();

        // First, find the student ID for this token
        const tokenResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${TOKENS_SHEET}!A2:B`,
        });

        const tokenRows = tokenResponse.data.values;
        if (!tokenRows) return null;

        const tokenRow = tokenRows.find(row => row[1] === token);
        if (!tokenRow) return null;

        const studentId = Number(tokenRow[0]);

        // Now get student data
        const studentResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A2:M`,
        });

        const studentRows = studentResponse.data.values;
        if (!studentRows) return null;

        const studentRow = studentRows.find(row => Number(row[0]) === studentId);
        if (!studentRow) return null;

        // Get lesson notes for this student
        const notesResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${NOTES_SHEET}!A2:E`,
        });

        const notesRows = notesResponse.data.values || [];
        const studentNotes = notesRows
            .filter(row => Number(row[1]) === studentId)
            .map(row => ({
                id: Number(row[0]),
                date: row[2] || "",
                content: row[3] || "",
                pieces: row[4] ? JSON.parse(row[4]) : [],
            }));

        return {
            id: Number(studentRow[0]),
            name: studentRow[1] || "",
            phone: studentRow[2] || "",
            address: studentRow[3] || "",
            lessonDay: studentRow[4] || "",
            pieces: JSON.parse(studentRow[5] || "[]"),
            color: studentRow[6] || "bg-violet-500",
            email: studentRow[7] || "",
            parentName: studentRow[8] || "",
            parentPhone: studentRow[9] || "",
            birthDate: studentRow[10] || "",
            memo: studentRow[11] || "",
            archived: studentRow[12] === "true",
            lessonNotes: studentNotes,
        };
    } catch (error) {
        console.error("Error getting student by token:", error);
        return null;
    }
}

// Generate a random access token
function generateToken(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 16; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

// Create or get parent access token for a student
export async function getOrCreateParentToken(studentId: number): Promise<string> {
    try {
        const sheets = await getSheetsClient();

        // Check if token already exists
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${TOKENS_SHEET}!A2:B`,
        });

        const rows = response.data.values || [];
        const existingRow = rows.find(row => Number(row[0]) === studentId);

        if (existingRow && existingRow[1]) {
            return existingRow[1];
        }

        // Generate new token
        const token = generateToken();

        // Save token
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${TOKENS_SHEET}!A:A`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[studentId, token]],
            },
        });

        return token;
    } catch (error) {
        console.error("Error creating parent token:", error);
        return "";
    }
}
