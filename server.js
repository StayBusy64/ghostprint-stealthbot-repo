const express = require('express');
const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

const VERSION_LOG = './version.log';
const VERIFY_LOG = './verify-log.json';
const SYNC_URL = process.env.ZIP_SYNC_URL || 'https://yourdomain.com/your-latest.zip';

app.get('/', (req, res) => res.send('🧠 GhostPrint StealthBot Hybrid Deploy is live.'));

app.get('/version', (req, res) => {
  if (!fs.existsSync(VERSION_LOG)) return res.send("No version log yet.");
  const log = fs.readFileSync(VERSION_LOG, 'utf-8').split('\n').filter(Boolean).slice(-5).reverse();
  res.send(`<pre>${log.join('\n')}</pre>`);
});

app.get('/sync', async (req, res) => {
  const filename = 'update.zip';
  const path = `./${filename}`;

  try {
    const writer = fs.createWriteStream(path);
    const response = await axios({ method: 'get', url: SYNC_URL, responseType: 'stream' });
    response.data.pipe(writer);

    writer.on('finish', () => {
      exec(`unzip -o ${filename}`, (err, stdout, stderr) => {
        if (err) return res.send('❌ Unzip failed: ' + stderr);

        const timestamp = new Date().toISOString();
        fs.appendFileSync(VERSION_LOG, `✅ Sync at ${timestamp}\n`);
        res.send(`✅ Updated bot from ZIP at ${timestamp}`);
      });
    });

    writer.on('error', () => res.send('❌ Failed to download ZIP.'));
  } catch (e) {
    res.send('❌ Sync failed: ' + e.message);
  }
});

app.get('/verify-log', (req, res) => {
  if (!fs.existsSync(VERIFY_LOG)) return res.send("No verifier logs yet.");
  const data = fs.readFileSync(VERIFY_LOG, 'utf-8');
  try {
    const parsed = JSON.parse(data);
    res.json(parsed.slice(-10).reverse());
  } catch {
    res.send("❌ Log corrupt or unreadable.");
  }
});

app.listen(PORT, () => console.log(`🧠 GhostPrint running at http://localhost:${PORT}`));