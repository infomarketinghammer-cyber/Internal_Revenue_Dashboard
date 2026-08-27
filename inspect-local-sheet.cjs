const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('live-sheet.xlsx');
  console.log('Sheet Names:', workbook.SheetNames);
  
  workbook.SheetNames.forEach(name => {
    const sheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`\n--- Sheet: ${name} (Rows: ${data.length}) ---`);
    console.log('Headers:', data[0]);
    console.log('Sample Rows (first 3):');
    data.slice(1, 4).forEach(row => console.log('  ', row));
  });
} catch (e) {
  console.error('Error reading sheet.xlsx:', e.message);
}
