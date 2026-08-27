const XLSX = require('xlsx');
const workbook = XLSX.readFile('live-sheet.xlsx');
const sheet = workbook.Sheets['Summary'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
data.forEach((row, i) => {
  if (row.length > 0 && i < 30) {
    console.log(`Row ${i}:`, row);
  }
});
