// liker.js — Human-Mimic YouTube Like Bot
require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const VIDEO_URL = process.env.TARGET_URL;
const PROXY = process.env.PROXY;

async function run() {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ];
    if (PROXY) args.push(`--proxy-server=${PROXY}`);

    const browser = await puppeteer.launch({
        headless: true,
        args
    });
    const page = await browser.newPage();

    try {
        console.log("📺 Opening video page...");
        await page.goto(VIDEO_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });

        await page.waitForSelector('ytd-toggle-button-renderer[is-icon-button]', { timeout: 15000 });

        await page.evaluate(() => window.scrollBy(0, 500));
        await page.waitForTimeout(3000); // simulate hesitation

        const likeButton = await page.$('ytd-toggle-button-renderer[is-icon-button]');
        if (likeButton) {
            await likeButton.click();
            console.log("👍 Video liked successfully.");
        } else {
            console.warn("❌ Like button not found.");
        }

        await page.waitForTimeout(2000);

    } catch (err) {
        console.error("🚫 liker.js failed:", err.message);
    } finally {
        await browser.close();
    }
}

run();
