// webhook.js
require('dotenv').config();
const axios = require('axios');

function sendWebhook(message) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return;

  axios.post(webhook, {
    content: message
  }).then(() => {
    console.log(`[🔔] Discord alert sent.`);
  }).catch((err) => {
    console.error(`[🚨] Discord alert failed:`, err.message);
  });
}

module.exports = sendWebhook;
