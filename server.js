// server.js
const express = require('express');
const { spawn } = require('child_process');
const app = express();

const PORT = process.env.PORT || 3000;
const RUN_INTERVAL = parseInt(process.env.RUN_INTERVAL || 300000); // 5 minutes default

// Simple health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Ghost bot is running',
    interval: `${RUN_INTERVAL / 1000} seconds`,
    nextRun: new Date(Date.now() + timeUntilNext).toISOString()
  });
});

let timeUntilNext = RUN_INTERVAL;

// Function to run the ghost bot
function runGhostBot() {
  console.log(`[🚀] Starting ghost bot at ${new Date().toISOString()}`);
  
  const ghostBot = spawn('node', ['ghostbot.js']);
  
  ghostBot.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  
  ghostBot.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });
  
  ghostBot.on('close', (code) => {
    console.log(`[🏁] Ghost bot finished with code ${code}`);
    timeUntilNext = RUN_INTERVAL;
  });
}

// Run immediately on start
runGhostBot();

// Schedule periodic runs
setInterval(() => {
  runGhostBot();
}, RUN_INTERVAL);

// Update countdown
setInterval(() => {
  timeUntilNext = Math.max(0, timeUntilNext - 1000);
}, 1000);

app.listen(PORT, () => {
  console.log(`[🌐] Server running on port ${PORT}`);
  console.log(`[⏰] Ghost bot will run every ${RUN_INTERVAL / 1000} seconds`);
});
