import { NextResponse } from "next/server";
import { getSheetsClient, SPREADSHEET_ID } from "../../../lib/google";

export async function GET() {
    try {
        const sheets = await getSheetsClient();
        const spreadsheetId = SPREADSHEET_ID;

        // Fetch existing sheets
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
        const sheetsToCreate = [
            "LessonNotes",
            "ReportTemplates",
            "Recitals",
            "SheetMusic",
            "SheetMusicAssignments",
            "ParentTokens"
        ];

        const requests = [];

        for (const sheetName of sheetsToCreate) {
            if (!existingSheets.includes(sheetName)) {
                requests.push({
                    addSheet: {
                        properties: {
                            title: sheetName,
                        },
                    },
                });
            }
        }

        const results = [];

        if (requests.length > 0) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests,
                },
            });
            results.push(`Created sheets: ${requests.map(r => r.addSheet.properties.title).join(", ")}`);

            // Allow some time for propagation before header initialization
            await new Promise(r => setTimeout(r, 1000));
        } else {
            results.push("All sheets already exist.");
        }

        // Initialize headers for new sheets
        const headerRequests = [];

        // Headers definitions
        const headers = {
            "LessonNotes": ["ID", "Student ID", "Date", "Content", "Pieces"],
            "ReportTemplates": ["ID", "Title", "Content"],
            "Recitals": ["ID", "Title", "Date", "Location", "Description", "Participants"],
            "SheetMusic": ["ID", "Title", "Composer", "Difficulty", "Genre", "PDF URL", "Notes"],
            "SheetMusicAssignments": ["SheetMusicID", "StudentID", "StudentName", "AssignedAt", "Status"],
            "ParentTokens": ["StudentID", "Token"]
        };

        for (const [sheetName, headerRow] of Object.entries(headers)) {
            // Check if sheet is empty (rudimentary check, just overwrite/ensure header row exists)
            // Ideally we check if A1 is empty, but appending to an empty sheet works too if we clear first or just use update.
            // Let's use update to force headers at A1.

            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${sheetName}!A1:${String.fromCharCode(65 + headerRow.length - 1)}1`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [headerRow]
                }
            });
            results.push(`Initialized headers for ${sheetName}`);
        }

        return NextResponse.json({ success: true, message: "Setup completed", details: results });

    } catch (error: any) {
        console.error("Setup error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
