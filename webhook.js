// webhook.js
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const VIDEO_FILE = "videos.txt";

if (!WEBHOOK_URL) {
  console.error("[Webhook] ERROR: Missing DISCORD_WEBHOOK_URL in .env");
  process.exit(1);
}

function sendToDiscord(videoUrl) {
  return axios.post(WEBHOOK_URL, {
    content: `👻 **New View Triggered:** ${videoUrl}`,
  });
}

async function pingWebhooks() {
  if (!fs.existsSync(VIDEO_FILE)) {
    console.error(`[Webhook] ERROR: ${VIDEO_FILE} not found.`);
    return;
  }

  const videos = fs.readFileSync(VIDEO_FILE, "utf-8")
    .split("\n")
    .map(v => v.trim())
    .filter(Boolean);

  for (const url of videos) {
    try {
      await sendToDiscord(url);
      console.log(`[Webhook Sent] ${url}`);
    } catch (err) {
      console.error(`[Webhook Failed] ${url} - ${err.message}`);
    }
  }
}

pingWebhooks();
