// ghostbot.js – View Loop Simulation Bot
require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

puppeteer.use(StealthPlugin());

const PROXY_LIST = process.env.PROXY_LIST || './proxies.txt';
const TARGET_URL = process.env.TARGET_URL || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const VIEW_DURATION = parseInt(process.env.VIEW_DURATION || 30000); // in ms
const LOOP_COUNT = parseInt(process.env.LOOP_COUNT || 10);

async function getProxies() {
    if (!fs.existsSync(PROXY_LIST)) return [];
    return fs.readFileSync(PROXY_LIST, 'utf-8')
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 6);
}

async function launchView(proxy) {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--proxy-server=${proxy}`
    ];

    const browser = await puppeteer.launch({ headless: true, args });
    const page = await browser.newPage();

    try {
        await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
        console.log(`👁 Viewing: ${TARGET_URL} via ${proxy}`);
        await page.waitForTimeout(VIEW_DURATION);
    } catch (err) {
        console.error(`❌ View failed via ${proxy}:`, err.message);
    } finally {
        await browser.close();
    }
}

(async () => {
    const proxies = await getProxies();
    if (proxies.length === 0) {
        console.error("🚫 No proxies found. Aborting ghostbot.");
        process.exit(1);
    }

    for (let i = 0; i < LOOP_COUNT; i++) {
        const proxy = proxies[i % proxies.length];
        await launchView(proxy);
    }

    console.log("✅ ghostbot.js finished all view loops.");
})();
