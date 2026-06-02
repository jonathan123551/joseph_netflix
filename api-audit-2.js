const http = require('https');

const BASE_URL = 'https://backend-production-1871f.up.railway.app';
const endpoints = [
  { path: '/ministries', method: 'GET' },
  { path: '/movies', method: 'GET' },
  { path: '/auth/register', method: 'POST', body: JSON.stringify({ name: "AuditUser2", email: `audit2${Date.now()}@example.com`, password: "password123" }) },
  { path: '/favorites', method: 'POST', body: JSON.stringify({ movieId: "1" }), requiresAuth: true },
  { path: '/favorites', method: 'GET', requiresAuth: true }
];

async function request(endpoint, cookie = null) {
  return new Promise((resolve) => {
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (cookie) {
      options.headers['Cookie'] = cookie;
    }
    const req = http.request(BASE_URL + endpoint.path, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let setCookie = res.headers['set-cookie'] ? res.headers['set-cookie'].join('; ') : null;
        resolve({ status: res.statusCode, data, setCookie });
      });
    });
    req.on('error', (e) => resolve({ status: 500, error: e.message }));
    if (endpoint.body) req.write(endpoint.body);
    req.end();
  });
}

async function audit() {
  const results = {};
  let cookie = null;

  for (const ep of endpoints) {
    const res = await request(ep, cookie);
    
    if (ep.path === '/auth/register' && res.status === 201) {
      cookie = res.setCookie;
      results[ep.method + ' ' + ep.path] = 'PASS';
    } else if (res.status >= 200 && res.status < 400) {
      results[ep.method + ' ' + ep.path] = 'PASS';
      if (res.setCookie) cookie = res.setCookie;
    } else {
      results[ep.method + ' ' + ep.path] = `FAIL (${res.status})`;
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

audit();
