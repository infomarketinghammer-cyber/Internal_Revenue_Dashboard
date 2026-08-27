const fs = require('fs');

async function download() {
  const sheetId = '1yxEUtw98KyfkFzMY1YnghD1_SUP1E_hhLDdNu1j0Pm4';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
  
  console.log('Downloading via native fetch from:', url);
  try {
    const res = await fetch(url);
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      throw new Error(`Failed to download: ${res.statusText}`);
    }
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync('live-sheet.xlsx', buffer);
    console.log('Successfully saved live-sheet.xlsx. Size:', buffer.length);
  } catch (err) {
    console.error('Error downloading:', err.message);
  }
}

download();
