// liker.js
const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();

const VIDEO_FILE = "Videos.txt";

async function likeVideo(url) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Wait for like button and click (generic selector, may need tuning)
    await page.waitForSelector("ytd-toggle-button-renderer[is-icon-button]", { timeout: 5000 });
    const buttons = await page.$$("ytd-toggle-button-renderer[is-icon-button]");
    if (buttons.length > 0) {
      await buttons[0].click();
      console.log(`[Liked] ${url}`);
    } else {
      console.log(`[Like Skipped] ${url} - Button not found`);
    }
  } catch (err) {
    console.error(`[Error] ${url} - ${err.message}`);
  } finally {
    await browser.close();
  }
}

(async () => {
  const links = fs.readFileSync(VIDEO_FILE, "utf-8").split("\n").filter(Boolean);
  for (const link of links) {
    await likeVideo(link);
  }
})();
