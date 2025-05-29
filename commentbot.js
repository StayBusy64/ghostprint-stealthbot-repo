// commentbot.js
const puppeteer = require('puppeteer-core');
const { executablePath } = require('puppeteer');
const fs = require('fs');

const comments = [
  "🔥🔥🔥 insane drop!",
  "This one hits different 💯",
  "Woke up and chose greatness 😤",
  "Algorithm better push this 🙌",
  "Ain't no way this ain't viral"
];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const url = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean)[0];
  await page.goto(url);

  await page.waitForTimeout(5000); // simulate view delay

  // Simulated comment drop (selector may vary)
  const comment = comments[Math.floor(Math.random() * comments.length)];
  await page.type('#placeholder-area', comment); // Adjust selector per YT layout
  await page.click('#submit-button');

  console.log(`[💬] Comment dropped: "${comment}"`);
  await browser.close();
})();
