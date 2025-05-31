// scheduler.cjs
const { exec } = require("child_process");
require("dotenv").config();

const INTERVAL_MINUTES_MIN = parseInt(process.env.SCHEDULE_INTERVAL_MIN) || 20;
const INTERVAL_MINUTES_MAX = parseInt(process.env.SCHEDULE_INTERVAL_MAX) || 45;

function getRandomInterval() {
  const range = INTERVAL_MINUTES_MAX - INTERVAL_MINUTES_MIN;
  return (
    Math.floor(Math.random() * (range + 1)) + INTERVAL_MINUTES_MIN
  ) * 60 * 1000; // in milliseconds
}

function launchGhostbot() {
  const timestamp = new Date().toLocaleString();
  console.log(`[Scheduler] Launching ghostbot.js @ ${timestamp}`);

  const process = exec("node ghostbot.js");

  process.stdout.on("data", (data) => {
    process.stdout.write(`[ghostbot] ${data}`);
  });

  process.stderr.on("data", (data) => {
    process.stderr.write(`[ghostbot:ERROR] ${data}`);
  });

  process.on("exit", (code) => {
    const nextDelay = getRandomInterval();
    console.log(`\n[Scheduler] ghostbot.js exited with code ${code}`);
    console.log(`[Scheduler] Next run in ${(nextDelay / 60000).toFixed(1)} min\n`);
    setTimeout(launchGhostbot, nextDelay); // loop again
  });
}

// Run forever
launchGhostbot();
