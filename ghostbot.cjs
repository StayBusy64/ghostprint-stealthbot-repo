// ghostbot.js
const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();

const VIDEO_FILE = "videos.txt";
const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN) || 45;
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX) || 300;

function getRandomWatchTime() {
  const range = WATCH_TIME_MAX - WATCH_TIME_MIN;
  return (Math.floor(Math.random() * (range + 1)) + WATCH_TIME_MIN) * 1000;
}

async function runViewBot(videoUrl) {
  const watchTime = getRandomWatchTime();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(videoUrl, { waitUntil: "networkidle2" });

    console.log(`[GhostBot] Watching: ${videoUrl}`);
    await page.waitForTimeout(watchTime);
    console.log(`[GhostBot] Done watching after ${watchTime / 1000}s`);
  } catch (err) {
    console.error(`[GhostBot ERROR] ${videoUrl} - ${err.message}`);
  } finally {
    await browser.close();
  }
}

(async () => {
  const urls = fs.readFileSync(VIDEO_FILE, "utf-8").split("\n").filter(Boolean);

  for (const url of urls) {
    await runViewBot(url);
  }
})();
