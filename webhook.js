// webhook.js
const axios = require("axios");
require("dotenv").config();

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const VIDEO_FILE = "Videos.txt";

function sendToDiscord(videoUrl) {
  return axios.post(WEBHOOK_URL, {
    content: `👻 **New View Triggered:** ${videoUrl}`,
  });
}

async function pingWebhooks() {
  const fs = require("fs");
  const videos = fs.readFileSync(VIDEO_FILE, "utf-8").split("\n").filter(Boolean);

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
