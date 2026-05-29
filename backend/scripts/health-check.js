const http = require('http');

const BASE_URL = process.env.CHECK_URL || 'http://localhost:5000';
const endpoints = [
  { path: '/api/health', label: 'Health check' },
  { path: '/api/auth/seed', label: 'Seed user', method: 'POST' },
];

let allPassed = true;

async function checkEndpoint({ path, label, method = 'GET' }) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const passed = res.statusCode >= 200 && res.statusCode < 400;
        console.log(`${passed ? 'PASS' : 'FAIL'} ${label} (${res.statusCode})`);
        if (!passed) allPassed = false;
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log(`FAIL ${label} — ${err.message}`);
      allPassed = false;
      resolve();
    });

    req.end();
  });
}

(async () => {
  console.log(`\nTouchGuard32 Health Check — ${new Date().toISOString()}`);
  console.log(`Target: ${BASE_URL}\n`);

  for (const ep of endpoints) {
    await checkEndpoint(ep);
  }

  console.log(`\n${allPassed ? 'All checks passed' : 'Some checks failed'}`);
  process.exit(allPassed ? 0 : 1);
})();
