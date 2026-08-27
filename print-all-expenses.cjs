const XLSX = require('xlsx');
const workbook = XLSX.readFile('live-sheet.xlsx');
const sheet = workbook.Sheets['Expenses'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
data.forEach((row, i) => {
  // If row has any non-empty value
  if (row.some(c => c !== null && c !== '')) {
    console.log(`Row ${i}:`, row);
  }
});
