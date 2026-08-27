const fs = require('fs');
const https = require('https');

const sheetId = '1yxEUtw98KyfkFzMY1YnghD1_SUP1E_hhLDdNu1j0Pm4';
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    // Look for bootstrap data in the Google Sheets HTML
    const match = data.match(/bootstrapData\s*=\s*({.+?});/);
    if (match) {
      try {
        const bootstrap = JSON.parse(match[1]);
        const sheets = bootstrap.changes.changesTestCase.workspaceNavigationInfo.rawSheets;
        console.log('Found sheets via rawSheets:');
        sheets.forEach(s => {
          console.log(`- Name: "${s[1]}", ID: ${s[0]}`);
        });
      } catch (e) {
        console.log('Error parsing bootstrapData:', e.message);
      }
    } else {
      console.log('Could not find bootstrapData, trying regex for sheet names...');
    }

    // Fallback regex search for sheet names in the HTML
    const sheetNameRegex = /"name"\s*:\s*"([^"]+)"/g;
    let m;
    const names = new Set();
    while ((m = sheetNameRegex.exec(data)) !== null) {
      if (m[1] && m[1].length < 50 && !m[1].includes('{')) {
        names.add(m[1]);
      }
    }
    console.log('All matched "name" strings (potential sheets):', Array.from(names));
    
    // Also extract sheet tabs list from the standard HTML structure
    const tabMatch = data.match(/class="grid-shift-tab"[^>]*>([^<]+)/g);
    if (tabMatch) {
      console.log('Found tabs via class grid-shift-tab:', tabMatch.map(t => t.replace(/<[^>]*>/g, '').trim()));
    }
  });
}).on('error', (err) => {
  console.error('Error fetching sheet:', err);
});
