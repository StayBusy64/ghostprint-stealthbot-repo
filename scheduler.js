// scheduler.js
require('dotenv').config();
const { exec } = require('child_process');

const LOOP_DELAY_MINUTES = parseInt(process.env.LOOP_DELAY_MINUTES || 10);

console.log(`[🔁] Starting scheduler: running ghostbot every ${LOOP_DELAY_MINUTES} minutes...\n`);

const runGhost = () => {
  exec('node ghostbot.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`[💥] Bot error: ${err.message}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
};

runGhost();
setInterval(runGhost, LOOP_DELAY_MINUTES * 60 * 1000);
