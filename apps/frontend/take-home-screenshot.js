const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Jonathan-pc\\.gemini\\antigravity\\brain\\84eecaa6-eb6e-405f-b55d-dd6d7c17427c';
const BASE_URL = 'https://frontend-production-e5ae.up.railway.app';

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  
  const page = await context.newPage();
  
  try {
    console.log(`Navigating to ${BASE_URL}/`);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000); // Wait for animations and videos
    const dest = path.join(ARTIFACT_DIR, 'live_home_desktop.png');
    await page.screenshot({ path: dest, fullPage: true });
    console.log(`Saved live_home_desktop.png`);
  } catch (e) {
    console.log(`Failed to capture home: ${e.message}`);
  }

  await browser.close();
}

run();
