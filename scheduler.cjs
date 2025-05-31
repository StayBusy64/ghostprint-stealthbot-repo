// scheduler.cjs
const { exec } = require("child_process");

function startGhostbot() {
  console.log(`[Scheduler] Launching ghostbot.js`);
  exec("node ghostbot.js", (err, stdout, stderr) => {
    if (err) {
      console.error(`[Scheduler Error] ${err.message}`);
      return;
    }
    if (stderr) console.error(`[STDERR] ${stderr}`);
    if (stdout) console.log(`[STDOUT]\n${stdout}`);
  });
}

// Run ghostbot every X minutes (5–10 minute randomized delay)
function loopGhostbot() {
  startGhostbot();
  const delay = Math.floor(Math.random() * 6 + 5) * 60 * 1000; // 5–10 min
  console.log(`[Scheduler] Next run in ${delay / 60000} min\n`);
  setTimeout(loopGhostbot, delay);
}

loopGhostbot();
