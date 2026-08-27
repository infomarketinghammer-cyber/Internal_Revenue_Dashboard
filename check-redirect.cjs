const https = require('https');
const url = 'https://docs.google.com/spreadsheets/d/1yxEUtw98KyfkFzMY1YnghD1_SUP1E_hhLDdNu1j0Pm4/export?format=xlsx';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    console.log('Redirect location:', res.headers.location);
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});
