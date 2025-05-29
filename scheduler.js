// scheduler.js
require('dotenv').config();
const { exec } = require('child_process');

const MIN_LOOP = 3;  // in minutes
const MAX_LOOP = 8;  // in minutes

function getRandomDelayMs() {
  const minutes = Math.floor(Math.random() * (MAX_LOOP - MIN_LOOP + 1)) + MIN_LOOP;
  console.log(`[⏱] Next run in ${minutes} minutes...\n`);
  return minutes * 60 * 1000;
}

function runGhost() {
  exec('node ghostbot.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`[💥] Ghostbot failed: ${err.message}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);

    // Schedule next run
    setTimeout(runGhost, getRandomDelayMs());
  });
}

console.log(`[🔁] Ghost Scheduler initiated (3–8 min random loop)`);
runGhost();  // First run
