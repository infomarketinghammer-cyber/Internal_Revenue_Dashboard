const fs = require('fs');
const https = require('https');

const sheetId = '1yxEUtw98KyfkFzMY1YnghD1_SUP1E_hhLDdNu1j0Pm4';
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;

console.log('Downloading live sheet from:', url);

const file = fs.createWriteStream('live-sheet.xlsx');

https.get(url, (response) => {
  if (response.statusCode === 302 || response.statusCode === 301) {
    console.log('Redirecting to:', response.headers.location);
    https.get(response.headers.location, (res2) => {
      res2.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download complete (redirected path)!');
      });
    });
  } else {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download complete!');
    });
  }
}).on('error', (err) => {
  fs.unlink('live-sheet.xlsx', () => {});
  console.error('Error downloading sheet:', err.message);
});
