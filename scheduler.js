// scheduler.js
require('dotenv').config();
const { exec } = require('child_process');

// Define each module and its optional custom loop range (in minutes)
const modules = [
  { name: 'ghostbot.js', min: 3, max: 8 },
  { name: 'commentbot.js', min: 5, max: 10 },
  { name: 'liker.js', min: 7, max: 12 },
  { name: 'subbot.js', min: 10, max: 15 },
  { name: 'trend-sniper.js', min: 15, max: 25 },
  { name: 'webhook.js', min: 2, max: 5 }
];

// Randomized delay function
function getRandomDelay(min, max) {
  const minutes = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`[⏱] Next "${this}" run in ${minutes} minutes...\n`);
  return minutes * 60 * 1000;
}

// Repeating loop for each module
function scheduleModule(module) {
  const { name, min, max } = module;

  const run = () => {
    console.log(`[🧠] Running ${name}...`);
    exec(`node ${name}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`[💥] ${name} failed: ${err.message}`);
      } else {
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
      }

      // Schedule next loop
      setTimeout(run, getRandomDelay.call(name, min, max));
    });
  };

  run(); // Initial run
}

console.log(`[🔁] Multi-bot Scheduler initialized (${modules.length} modules spinning up...)\n`);

modules.forEach(scheduleModule);
