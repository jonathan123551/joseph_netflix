const http = require('https');

const BASE_URL = 'https://backend-production-1871f.up.railway.app';
const endpoints = [
  { path: '/health', method: 'GET' },
  { path: '/movies', method: 'GET' },
  { path: '/movies/featured', method: 'GET' },
  { path: '/movies/categories', method: 'GET' },
  { path: '/movies/search?q=test', method: 'GET' },
  { path: '/auth/register', method: 'POST', body: JSON.stringify({ name: "AuditUser", email: `audit${Date.now()}@example.com`, password: "password123" }) },
  { path: '/auth/login', method: 'POST', body: JSON.stringify({ email: "audit@example.com", password: "password123" }) },
  { path: '/auth/me', method: 'GET', requiresAuth: true },
  { path: '/favorites', method: 'POST', body: JSON.stringify({ movieId: "1" }), requiresAuth: true },
  { path: '/favorites', method: 'GET', requiresAuth: true },
  { path: '/watch-history', method: 'POST', body: JSON.stringify({ movieId: "1", progressSecs: 10 }), requiresAuth: true },
  { path: '/watch-history', method: 'GET', requiresAuth: true },
  { path: '/purchases/buy', method: 'POST', body: JSON.stringify({ movieId: "1" }), requiresAuth: true },
  { path: '/purchases/rent', method: 'POST', body: JSON.stringify({ movieId: "1" }), requiresAuth: true },
  { path: '/admin/stats', method: 'GET', requiresAuth: true },
  { path: '/movies/1/playback', method: 'GET' }
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
    if (ep.requiresAuth && !cookie) {
      // Trying without auth to see if it blocks correctly or fails gracefully
      const res = await request(ep, null);
      results[ep.method + ' ' + ep.path] = (res.status === 401 || res.status === 403) ? 'PASS (Protected)' : `FAIL (${res.status})`;
      continue;
    }

    const res = await request(ep, cookie);
    
    // For registration, we get the cookie for subsequent requests
    if (ep.path === '/auth/register' && res.status === 201) {
      cookie = res.setCookie;
      results[ep.method + ' ' + ep.path] = 'PASS';
    } else if (res.status >= 200 && res.status < 400) {
      results[ep.method + ' ' + ep.path] = 'PASS';
      if (res.setCookie) cookie = res.setCookie; // Update cookie if logging in
    } else if (res.status === 404) {
      results[ep.method + ' ' + ep.path] = 'FAIL (404 Not Found)';
    } else if (res.status === 401 || res.status === 403) {
      results[ep.method + ' ' + ep.path] = `FAIL (Auth: ${res.status})`;
    } else {
      results[ep.method + ' ' + ep.path] = `PARTIAL/FAIL (${res.status})`;
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

audit();
