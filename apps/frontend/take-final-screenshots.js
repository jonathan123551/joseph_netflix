const { chromium } = require('playwright');
const path = require('path');
const crypto = require('crypto');

const ARTIFACT_DIR = 'C:\\Users\\Jonathan-pc\\.gemini\\antigravity\\brain\\84eecaa6-eb6e-405f-b55d-dd6d7c17427c';
// Using localhost instead of live URL since we just built this locally and haven't pushed to Railway yet!
const BASE_URL = 'http://localhost:3000';

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
      await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000); // Wait for animations
      const dest = path.join(ARTIFACT_DIR, name);
      await page.screenshot({ path: dest, fullPage: true });
      console.log(`Saved ${name}`);
    } catch (e) {
      console.log(`Failed to capture ${urlPath}: ${e.message}`);
    }
  };

  // Login as admin first so we can see everything
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  try {
    // If we can register a new user... wait, I need ADMIN access to see Admin pages.
    // I can just intercept API requests to return an admin profile.
    await page.route('**/auth/me', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: '1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' })
    }));
  } catch(e) {}

  await take('final_home.png', '/');
  await take('final_movie_details.png', '/movie/1');
  await take('final_my_list.png', '/my-list');
  await take('final_profile.png', '/profile');
  
  await take('final_ministries.png', '/ministries');
  await take('final_ministry_details.png', '/ministries/hope-worldwide');
  await take('final_donate.png', '/donate?ministry=hope-worldwide');
  
  await take('final_admin_dashboard.png', '/admin');
  await take('final_admin_movies.png', '/admin/movies');
  await take('final_admin_analytics.png', '/admin/analytics');

  await browser.close();
}

run();
