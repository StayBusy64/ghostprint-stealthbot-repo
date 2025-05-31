// subbot.js
const puppeteer = require("puppeteer");
require("dotenv").config();

const YT_URL = "https://www.youtube.com/watch?v=";
const VIDEO_FILE = "Videos.txt";
const USER_EMAIL = process.env.GOOGLE_EMAIL;
const USER_PASS = process.env.GOOGLE_PASSWORD;

async function simulateSub(videoId) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  try {
    await page.goto("https://accounts.google.com/signin", { waitUntil: "networkidle2" });

    await page.type("input[type='email']", USER_EMAIL);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);

    await page.type("input[type='password']", USER_PASS);
    await page.keyboard.press("Enter");
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    const targetUrl = `${YT_URL}${videoId}`;
    await page.goto(targetUrl, { waitUntil: "networkidle2" });

    await page.waitForSelector("ytd-subscribe-button-renderer tp-yt-paper-button", { timeout: 8000 });
    await page.click("ytd-subscribe-button-renderer tp-yt-paper-button");

    console.log(`[Subscribed] ${targetUrl}`);
  } catch (err) {
    console.error(`[Subbot Error] ${videoId} - ${err.message}`);
  } finally {
    await browser.close();
  }
}

(async () => {
  const fs = require("fs");
  const videoList = fs.readFileSync(VIDEO_FILE, "utf-8").split("\n").filter(Boolean);

  for (const url of videoList) {
    const videoId = url.split("v=")[1] || url;
    await simulateSub(videoId);
  }
})();
