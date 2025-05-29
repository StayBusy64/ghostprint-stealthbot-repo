// ghostbot.js
require('dotenv').config();
const fs = require('fs');
const puppeteer = require('puppeteer-core');
const { executablePath } = require('puppeteer');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const videos = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean);

const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN || 45);
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX || 300);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const url = videos[Math.floor(Math.random() * videos.length)];
  console.log(`[👻] Ghosting view: ${url}`);

  await page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1");
  await page.goto(url, { waitUntil: 'networkidle2' });

  const watchTime = Math.floor(Math.random() * (WATCH_TIME_MAX - WATCH_TIME_MIN + 1)) + WATCH_TIME_MIN;
  console.log(`[⏱] Watching for ${watchTime} seconds...`);

  await delay(watchTime * 1000);
  await browser.close();
  console.log(`[✅] View
