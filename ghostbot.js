// ghostbot.js — GhostBot Free Edition (Full Stealth Mode)
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const useProxy = require("puppeteer-page-proxy");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

puppeteer.use(StealthPlugin());

const VIDEO_LIST = path.join(__dirname, "Videos.txt");
const MAX_RETRIES = 3;
const VIEW_DELAY_MIN = 45 * 1000; // 45s
const VIEW_DELAY_MAX = 300 * 1000; // 5m
const PROXY_LIST_URL = "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/main/http.txt";

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getOpenProxies() {
  try {
    const res = await axios.get(PROXY_LIST_URL);
    return res.data
      .split("\n")
      .filter((proxy) => proxy.includes(":"));
  } catch (err) {
    console.error("[Proxy Fetch Error]", err.message);
    return [];
  }
}

async function simulateView(videoUrl, proxy) {
  console.log(`[View Attempt] Using proxy ${proxy} for ${videoUrl}`);
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      `--proxy-server=http://${proxy}`,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
    ],
  });

  try {
    const page = await browser.newPage();
    await useProxy(page, `http://${proxy}`);
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );
    await page.goto(videoUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    const viewTime = getRandomInt(VIEW_DELAY_MIN, VIEW_DELAY_MAX);
    console.log(`[Viewing] ${videoUrl} for ${viewTime / 1000}s`);
    await sleep(viewTime);
    console.log(`[Success] Viewed: ${videoUrl}`);
  } catch (err) {
    console.error(`[View Failed] ${videoUrl} via ${proxy}: ${err.message}`);
  } finally {
    await browser.close();
  }
}

(async () => {
  const urls = fs.readFileSync(VIDEO_LIST, "utf-8").split("\n").filter(Boolean);
  const proxies = await getOpenProxies();

  if (!proxies.length) {
    console.error("[Fatal] No proxies retrieved. Aborting.");
    return;
  }

  for (const url of urls) {
    let attempt = 0;
    let success = false;

    while (attempt < MAX_RETRIES && !success) {
      const proxy = proxies[Math.floor(Math.random() * proxies.length)];
      try {
        await simulateView(url, proxy);
        success = true;
      } catch (e) {
        console.log(`[Retry] Attempt ${attempt + 1} failed for ${url}`);
      }
      attempt++;
      await sleep(getRandomInt(5000, 15000)); // Cooldown between attempts
    }
  }
})();
