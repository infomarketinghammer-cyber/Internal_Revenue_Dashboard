const XLSX = require('xlsx');
const workbook = XLSX.readFile('live-sheet.xlsx');
const sheet = workbook.Sheets['Dashboard'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
data.forEach((row, i) => {
  if (row.length > 0) {
    console.log(`Row ${i}:`, row);
  }
});
