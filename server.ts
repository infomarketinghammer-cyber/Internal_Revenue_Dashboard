import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import XLSX from "xlsx";

dotenv.config();

const app = express();
const PORT = 3000;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || "1yxEUtw98KyfkFzMY1YnghD1_SUP1E_hhLDdNu1j0Pm4";

app.use(express.json());

// API routes FIRST
app.get("/api/sheets/metadata", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized: Missing bearer token" });
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;
    const response = await fetch(url, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Google API Error: ${errText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/sheets/metadata:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/sheets/values", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized: Missing bearer token" });
    }

    const range = req.query.range as string;
    if (!range) {
      return res.status(400).json({ error: "Missing range query parameter" });
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Google API Error: ${errText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/sheets/values:", error);
    res.status(500).json({ error: error.message });
  }
});

let cachedData: any = null;
let cacheTime = 0;
const CACHE_DURATION_MS = 2 * 60 * 1000; // 2 minutes in-memory cache

async function getLiveSpreadsheetData(): Promise<any> {
  const now = Date.now();
  if (cachedData && now - cacheTime < CACHE_DURATION_MS) {
    console.log("Serving spreadsheet data from cache");
    return cachedData;
  }

  console.log(`Fetching live spreadsheet from Google Sheets export URL for SPREADSHEET_ID: ${SPREADSHEET_ID}`);
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=xlsx`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch spreadsheet from Google: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Parse with SheetJS
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const parsedSheets = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null }) as any[][];
    
    const headers = rows.length > 0 ? rows[0].map(h => String(h || "").trim()) : [];
    const contentRows = rows.slice(1);
    
    return {
      title: name,
      headers,
      rows: contentRows,
      rawRows: contentRows
    };
  });

  cachedData = { sheets: parsedSheets };
  cacheTime = now;
  console.log("Successfully cached parsed spreadsheet data");
  return cachedData;
}

app.get("/api/sheets/all", async (req, res) => {
  // 1. If we have a Google Apps Script Web App URL, use it first!
  // This bypasses any authorization issue or file download permissions entirely.
  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (appsScriptUrl) {
    try {
      console.log(`Fetching live spreadsheet from Google Apps Script: ${appsScriptUrl}`);
      const response = await fetch(appsScriptUrl);
      if (response.ok) {
        const data = await response.json();
        console.log("Successfully fetched and served Google Sheets data via Apps Script");
        return res.json(data);
      }
      console.warn(`Google Apps Script web app returned status ${response.status}. Falling back...`);
    } catch (scriptErr: any) {
      console.error("Error fetching from Google Apps Script:", scriptErr.message);
    }
  }

  const authHeader = req.headers.authorization;
  
  // 2. If we have an Authorization header, try the Google Sheets REST API next
  if (authHeader) {
    try {
      console.log("Authorization header present. Querying Google REST API...");
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?includeGridData=true`;
      const response = await fetch(url, {
        headers: {
          Authorization: authHeader,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
      
      console.warn(`Google REST API returned status ${response.status}. Falling back to public XLSX download...`);
    } catch (apiError) {
      console.error("Google REST API failed, falling back to public XLSX download:", apiError);
    }
  }

  // 3. Fallback or Default: Public server-side XLSX download (no authorization required!)
  try {
    const data = await getLiveSpreadsheetData();
    res.json(data);
  } catch (error: any) {
    console.error("Error fetching live sheet via server-side XLSX:", error);
    res.status(500).json({ error: `Server error fetching live sheet: ${error.message}` });
  }
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
