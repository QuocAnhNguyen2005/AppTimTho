const fetch = require('node-fetch');

async function testBackend() {
  console.log('Testing backend login API at localhost:5000...');
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 5000);

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: '0901234567', password: '123456' }),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Data:', data);
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

testBackend();
