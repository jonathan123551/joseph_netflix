const { chromium } = require('playwright');
const path = require('path');
const crypto = require('crypto');

const ARTIFACT_DIR = 'C:\\Users\\Jonathan-pc\\.gemini\\antigravity\\brain\\84eecaa6-eb6e-405f-b55d-dd6d7c17427c';
const BASE_URL = 'https://frontend-production-e5ae.up.railway.app';

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  
  const page = await context.newPage();
  
  const take = async (name, urlPath) => {
    try {
      console.log(`Navigating to ${BASE_URL}${urlPath}`);
      await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1500); // Wait for animations
      const dest = path.join(ARTIFACT_DIR, name);
      await page.screenshot({ path: dest, fullPage: true });
      console.log(`Saved ${name}`);
    } catch (e) {
      console.log(`Failed to capture ${urlPath}: ${e.message}`);
    }
  };

  // 1. Home Page
  await take('live_home_desktop.png', '/');
  
  // 2. Register Page
  await take('live_register.png', '/register');
  
  // 3. Register a user to access authenticated routes
  try {
    const email = `test${crypto.randomBytes(4).toString('hex')}@example.com`;
    await page.fill('input[type="text"], input[name="name"]', 'Audit User');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    const dest = path.join(ARTIFACT_DIR, 'live_after_register.png');
    await page.screenshot({ path: dest });
    console.log(`Saved live_after_register.png`);
  } catch(e) {
    console.log("Could not register via UI: ", e.message);
  }

  // 4. Movie Details Page
  await take('live_movie_details.png', '/movie/1');
  
  // 5. Watch Page (might be protected/error)
  await take('live_watch_page.png', '/watch/1');
  
  // 6. Admin Page (will fail or redirect since we aren't ADMIN)
  await take('live_admin_dashboard.png', '/admin');
  
  // 7. Non-existent pages to prove they don't exist
  await take('live_ministries.png', '/ministries/1');
  await take('live_donations.png', '/donations');
  await take('live_profile.png', '/profile');

  await browser.close();
}

run();
