const fs = require('fs');
const path = require('path');

try {
  fs.copyFileSync(path.join(__dirname, 'app', 'favicon.ico'), path.join(__dirname, 'src', 'app', 'favicon.ico'));
  fs.rmSync(path.join(__dirname, 'app'), { recursive: true, force: true });
  console.log('Successfully moved favicon and deleted app directory');
} catch (e) {
  console.error(e);
}
