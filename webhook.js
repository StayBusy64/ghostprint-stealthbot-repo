import axios from 'axios';
import 'dotenv/config';

const webhookURL = process.env.DISCORD_WEBHOOK;

async function sendWebhook(message) {
  try {
    await axios.post(webhookURL, {
      content: message
    });
    console.log('📡 Webhook sent!');
  } catch (error) {
    console.error('❌ Webhook failed:', error.message);
  }
}

sendWebhook(`[🚨] New video view cycle started at ${new Date().toLocaleTimeString()}`);
