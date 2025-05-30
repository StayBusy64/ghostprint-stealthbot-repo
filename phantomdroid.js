// phantomdroid.js
require('dotenv').config();
const fs = require('fs');
const puppeteer = require('puppeteer-core');
const injectEntropy = require('./entropy-injector');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const videos = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean);

const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN || 45);
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX || 180);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/nix/store/chromium/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=375,667',
      '--user-agent=Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
    ]
  });

  const page = await browser.newPage();
  const url = videos[Math.floor(Math.random() * videos.length)];
  console.log(`[PHANTOMDROID] Watching mobile: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2' });
  await injectEntropy(page);

  const watchTimeSec = Math.floor(Math.random() * (WATCH_TIME_MAX - WATCH_TIME_MIN + 1)) + WATCH_TIME_MIN;
  console.log(`[PHANTOMDROID] Mobile watch duration: ${watchTimeSec}s`);
  await delay(watchTimeSec * 1000);

  const logLine = `[${new Date().toISOString()}] Bot: phantomdroid | Video: ${url} | WatchTime: ${watchTimeSec}s\n`;
  fs.appendFileSync('logs/swarm.log', logLine);

  await browser.close();
})();
