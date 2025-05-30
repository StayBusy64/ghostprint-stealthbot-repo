require('dotenv').config();
const puppeteer = require('puppeteer-core');
const fs = require('fs');

// Max listeners patch (for Railway memory constraints)
process.setMaxListeners(0);

const delay = (ms) => new Promise(res => setTimeout(res, ms));

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_PATH || '/nix/store/*-chromium-*/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      // Block unnecessary resources for performance testing
      if (['stylesheet', 'image', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const videos = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean);
    const url = videos[Math.floor(Math.random() * videos.length)];

    console.log(`[🎯] Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    await delay(5000); // Wait for page settle

    console.log(`[✅] Benchmark complete`);
    await browser.close();
  } catch (err) {
    console.error(`[❌] Error:`, err);
    process.exit(1);
  }
})();
