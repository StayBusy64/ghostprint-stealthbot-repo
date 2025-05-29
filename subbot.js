// subbot.js
const puppeteer = require('puppeteer-core');
const { executablePath } = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // login required
    executablePath: executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const url = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean)[0];
  await page.goto(url);

  await page.waitForTimeout(5000);
  await page.click('ytd-subscribe-button-renderer button');

  console.log(`[✅] Subscribed to channel via: ${url}`);
  await browser.close();
})();
