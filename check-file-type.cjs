const fs = require('fs');
try {
  const content = fs.readFileSync('live-sheet.xlsx', 'utf8');
  console.log('File size:', fs.statSync('live-sheet.xlsx').size);
  console.log('First 500 characters:');
  console.log(content.slice(0, 500));
} catch (e) {
  console.log('Binary or error reading as utf8:', e.message);
}
