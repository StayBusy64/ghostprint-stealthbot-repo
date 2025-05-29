// liker.js
const puppeteer = require('puppeteer-core');
const { executablePath } = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const url = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean)[0];
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.waitForTimeout(5000);
  await page.click('ytd-toggle-button-renderer:nth-of-type(1) button');

  console.log(`[👍] Liked video: ${url}`);
  await browser.close();
})();
