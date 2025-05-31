// ghostbot.js
const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();

const VIDEO_FILE = "videos.txt";
const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN, 10) || 45;
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX, 10) || 300;

async function watchVideo(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    const duration = Math.floor(Math.random() * (WATCH_TIME_MAX - WATCH_TIME_MIN + 1)) + WATCH_TIME_MIN;
    console.log(`[GhostBot] Watching ${url} for ${duration}s`);
    await page.waitForTimeout(duration * 1000);
  } catch (err) {
    console.error(`[GhostBot Error] ${url} - ${err.message}`);
  } finally {
    await browser.close();
  }
}

async function runGhostbot() {
  const urls = fs.readFileSync(VIDEO_FILE, "utf-8").split("\n").filter(Boolean);
  for (const url of urls) {
    await watchVideo(url);
  }
}

runGhostbot();
