// SwarmController.js
require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');

const LOOP_DELAY_MINUTES = parseInt(process.env.LOOP_DELAY_MINUTES || 10);

// UTIL: Run a command with logging
function run(command, label) {
  try {
    console.log(`\n[🎮] Running: ${label}`);
    const output = execSync(command, { stdio: 'inherit' });
    return output;
  } catch (err) {
    console.error(`[💥] Error in ${label}: ${err.message}`);
  }
}

// STEP 1: Pull Trending (or skip if videos.txt exists)
if (!fs.existsSync('videos.txt') || fs.readFileSync('videos.txt', 'utf-8').trim() === '') {
  run('node trend-sniper.js', 'Pull Trending Videos');
} else {
  console.log('[📼] Using existing videos.txt');
}

// STEP 2: Run full swarm per video
const videos = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean);

(async () => {
  for (const video of videos) {
    console.log(`\n🚀 TARGET: ${video}`);

    // TEMPORARILY write single video to temp file for each bot
    fs.writeFileSync('video-temp.txt', video
