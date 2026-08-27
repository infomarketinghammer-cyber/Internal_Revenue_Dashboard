const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('live-sheet.xlsx');
  const sheet = workbook.Sheets['Dashboard'];
  
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  console.log('Total parsed rows:', rows.length);
  console.log('Row 0:', rows[0]);
  console.log('Row 2:', rows[2]);
  console.log('Row 3:', rows[3]);
  console.log('Row 4:', rows[4]);
} catch (e) {
  console.error('Error:', e.message);
}
