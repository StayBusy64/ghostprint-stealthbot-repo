// scheduler.cjs
const { exec } = require("child_process");
const path = require("path");

const WATCH_INTERVAL = process.env.WATCH_INTERVAL || 1000 * 60 * 10; // 10 minutes default
const GHOSTBOT_PATH = path.join(__dirname, "ghostbot.js");

function runGhostBot() {
  console.log(`[Scheduler] Launching ghostbot.js at ${new Date().toISOString()}`);
  exec(`node ${GHOSTBOT_PATH}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`[Scheduler] Error: ${err.message}`);
      return;
    }
    if (stderr) console.error(`[Scheduler] STDERR: ${stderr}`);
    if (stdout) console.log(`[Scheduler] STDOUT: ${stdout}`);
  });
}

runGhostBot();
setInterval(runGhostBot, WATCH_INTERVAL);
