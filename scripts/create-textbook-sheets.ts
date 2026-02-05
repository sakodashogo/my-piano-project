
import fs from 'fs';
import path from 'path';

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    console.log("Loading .env from", envPath);
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^"(.*)"$/, '$1'); // Remove quotes if present
            process.env[key] = value;
        }
    });
} else {
    console.log(".env file not found at", envPath);
}

const SHEET_NAMES = ["Textbooks", "TextbookProgress"];

async function createSheets() {
    // Dynamic import to ensure process.env is populated first
    const { getSheetsClient, SPREADSHEET_ID: importedId } = await import("../src/lib/google");

    const SPREADSHEET_ID = importedId || process.env.SPREADSHEET_ID || "12qcNfvHTLISLl3-lmVif9T6eGYWGAhKiwFSXHidSbvk";

    console.log("Using SPREADSHEET_ID:", SPREADSHEET_ID);
    if (!SPREADSHEET_ID) {
        console.error("Error: SPREADSHEET_ID is missing.");
        return;
    }

    console.log("Initializing sheets...");
    const sheets = await getSheetsClient();

    // Get existing sheets
    const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
    });

    const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    console.log("Existing sheets:", existingSheets);

    const requests = [];

    for (const name of SHEET_NAMES) {
        if (!existingSheets.includes(name)) {
            console.log(`Adding sheet: ${name}`);
            requests.push({
                addSheet: {
                    properties: {
                        title: name,
                    },
                },
            });
        } else {
            console.log(`Sheet already exists: ${name}`);
        }
    }

    if (requests.length > 0) {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                requests,
            },
        });
        console.log("Sheets created successfully.");

        // Initialize Textbooks Header & Sample Data
        if (!existingSheets.includes("Textbooks")) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: "Textbooks!A1:F1",
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [["ID", "Title", "Level", "TotalPages", "Publisher", "Description"]],
                },
            });
            console.log("Initialized Textbooks header.");

            // Add sample data
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: "Textbooks!A:A",
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [
                        [1, "バイエル（下）", "Beginner", 106, "全音楽譜出版社", "基本の教本"],
                        [2, "ブルグミュラー25の練習曲", "Intermediate", 25, "全音楽譜出版社", "表現力を鍛える"]
                    ]
                }
            });
            console.log("Added sample textbooks.");
        }

        if (!existingSheets.includes("TextbookProgress")) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: "TextbookProgress!A1:G1",
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [["StudentId", "TextbookId", "Status", "CurrentPage", "StartDate", "CompletedDate", "LastUpdated"]],
                },
            });
            console.log("Initialized TextbookProgress header.");
        }

    } else {
        console.log("All sheets already exist.");
    }
}

createSheets().catch(console.error);
