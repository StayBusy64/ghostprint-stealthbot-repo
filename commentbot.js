// commentbot.js — AI-Powered YouTube Comment Poster
require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const EMAIL = process.env.YT_EMAIL;
const PASSWORD = process.env.YT_PASSWORD;
const TARGET_URL = process.env.TARGET_URL;
const COMMENT_TEXT = process.env.COMMENT_TEXT || "🔥 Love this content. Thanks for sharing!";
const PROXY = process.env.PROXY;

async function run() {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ];
    if (PROXY) args.push(`--proxy-server=${PROXY}`);

    const browser = await puppeteer.launch({ headless: true, args });
    const page = await browser.newPage();

    try {
        console.log("🔐 Logging into YouTube...");
        await page.goto('https://accounts.google.com/signin/v2/identifier', { waitUntil: 'networkidle2' });

        await page.type('input[type="email"]', EMAIL, { delay: 80 });
        await page.click('#identifierNext');
        await page.waitForTimeout(2000);
        await page.type('input[type="password"]', PASSWORD, { delay: 80 });
        await page.click('#passwordNext');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log(`🧠 Navigating to video: ${TARGET_URL}`);
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

        await page.evaluate(() => window.scrollBy(0, 1000));
        await page.waitForTimeout(2000);

        await page.click('ytd-comments #placeholder-area');
        await page.type('#contenteditable-root', COMMENT_TEXT, { delay: 60 });
        await page.click('#submit-button');

        console.log(`✅ Comment posted: "${COMMENT_TEXT}"`);

    } catch (err) {
        console.error("❌ Failed to post comment:", err.message);
    } finally {
        await browser.close();
    }
}

run();
