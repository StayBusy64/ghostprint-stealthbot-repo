// ghostbot.js
const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

const VIDEO_LIST = 'videos.txt';
const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN || '45');
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX || '300');

function getRandomWatchTime() {
  const range = WATCH_TIME_MAX - WATCH_TIME_MIN;
  return (Math.floor(Math.random() * (range + 1)) + WATCH_TIME_MIN) * 1000;
}

async function simulateView(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const watchTime = getRandomWatchTime();
    console.log(`[ghostbot] Watching ${url} for ${(watchTime / 1000).toFixed(1)} seconds`);

    await new Promise(res => setTimeout(res, watchTime));
  } catch (err) {
    console.error(`[ghostbot] Failed to load ${url}: ${err.message}`);
  } finally {
    await browser.close();
  }
}

(async () => {
  if (!fs.existsSync(VIDEO_LIST)) {
    console.error(`[ghostbot] videos.txt not found`);
    process.exit(1);
  }

  const videoUrls = fs.readFileSync(VIDEO_LIST, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.startsWith('http'));

  for (const url of videoUrls) {
    await simulateView(url);
  }

  console.log('[ghostbot] Finished watching all videos.');
})();
