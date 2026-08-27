const XLSX = require('xlsx');
const workbook = XLSX.readFile('live-sheet.xlsx');
const sheet = workbook.Sheets['Expenses'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
data.forEach((row, i) => {
  if (row.length > 0 && i >= 40 && i < 120) {
    console.log(`Row ${i}:`, row);
  }
});
