// trend-sniper.js
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const OUTPUT_FILE = "Videos.txt";
const YT_TRENDING_URL = "https://www.youtube.com/feed/trending";

async function scrapeTrendingVideos() {
  try {
    const { data: html } = await axios.get(YT_TRENDING_URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(html);
    const videoLinks = new Set();

    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href && href.startsWith("/watch?v=")) {
        const fullUrl = `https://www.youtube.com${href.split("&")[0]}`;
        videoLinks.add(fullUrl);
      }
    });

    const uniqueVideos = Array.from(videoLinks).slice(0, 15);
    fs.writeFileSync(OUTPUT_FILE, uniqueVideos.join("\n"));
    console.log(`[Trend Sniper] Seeded ${uniqueVideos.length} trending URLs.`);
  } catch (err) {
    console.error("[Trend Sniper] Scrape failed:", err.message);
  }
}

scrapeTrendingVideos();
