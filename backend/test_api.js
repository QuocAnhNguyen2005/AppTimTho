const http = require('http');

http.get('http://localhost:5000/api/workers/search?q=sửa+bồn+cầu', (res) => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', data);
  });
}).on('error', err => {
  console.error('Request error:', err.message);
});
