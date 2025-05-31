// ghostbot.js
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
require("dotenv").config();

puppeteer.use(StealthPlugin());

const VIDEO_FILE = "videos.txt";
const MIN_WATCH = parseInt(process.env.WATCH_TIME_MIN) || 45;
const MAX_WATCH = parseInt(process.env.WATCH_TIME_MAX) || 300;

function getRandomDelay() {
  return Math.floor(Math.random() * (MAX_WATCH - MIN_WATCH + 1) + MIN_WATCH) * 1000;
}

async function watchVideo(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1366,768",
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    console.log(`[VIEW] Loaded video: ${url}`);

    const watchDuration = getRandomDelay();
    console.log(`[TIMER] Watching for ${watchDuration / 1000} seconds...`);
    await page.waitForTimeout(watchDuration);

    console.log(`[DONE] Finished watching ${url}`);
  } catch (err) {
    console.error(`[ERROR] Failed to view ${url} - ${err.message}`);
  } finally {
    await browser.close();
  }
}

async function main() {
  if (!fs.existsSync(VIDEO_FILE)) {
    console.error(`[FATAL] Missing ${VIDEO_FILE}`);
    process.exit(1);
  }

  const urls = fs.readFileSync(VIDEO_FILE, "utf-8").split("\n").filter(Boolean);

  for (const url of urls) {
    await watchVideo(url);
  }
}

main();
