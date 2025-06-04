const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

require('dotenv').config();

const videoUrl = process.env.TARGET_URL;
const username = process.env.YT_EMAIL;
let password = process.env.YT_PASSWORD;

// DEBUG CHECK
if (!password || typeof password !== 'string') {
    console.error('❌ YT_PASSWORD is missing or invalid!');
    process.exit(1);
}

const comments = [
    "🔥 This deserves way more recognition.",
    "Ain’t no way this isn’t viral yet.",
    "W vid, slept on fr.",
    "Algorithm needs to wake up on this.",
    "Sheeshh this heat different."
];

(async () => {
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto('https://accounts.google.com/');

    // Login
    await page.type('input[type="email"]', username);
    await page.click('#identifierNext');
    await page.waitForTimeout(3000);
    await page.type('input[type="password"]', password);
    await page.click('#passwordNext');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Navigate to target
    await page.goto(videoUrl, { waitUntil: 'networkidle2' });

    // Leave comment
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForSelector('ytd-comment-simplebox-renderer', { visible: true });
    await page.click('ytd-comment-simplebox-renderer');
    await page.type('ytd-comment-simplebox-renderer #contenteditable-root', comments[Math.floor(Math.random() * comments.length)]);
    await page.click('#submit-button');

    console.log('✅ Comment posted.');

    await browser.close();
})();
