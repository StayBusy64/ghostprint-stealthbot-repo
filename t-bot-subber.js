// t-bot-subber.js

require('dotenv').config()
const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const injectEntropy = require('./entropy-injector')

puppeteer.use(StealthPlugin())

const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const videos = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean)

const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN || 60)
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX || 180)

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/nix/store/chromium/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  })

  const page = await browser.newPage()

  const url = videos[Math.floor(Math.random() * videos.length)]
  console.log(`[🔔 T-BOT] Subbing from: ${url}`)
  await page.goto(url, { waitUntil: 'networkidle2' })

  await injectEntropy(page)

  const watchTimeSec = Math.floor(Math.random() * (WATCH_TIME_MAX - WATCH_TIME_MIN + 1)) + WATCH_TIME_MIN
  console.log(`[⏱️ Watch time before sub] ${watchTimeSec}s`)
  await delay(watchTimeSec * 1000)

  try {
    await page.evaluate(() => window.scrollBy(0, 1000 + Math.random() * 1000))
    await delay(3000)

    await page.waitForSelector('ytd-subscribe-button-renderer tp-yt-paper-button', { timeout: 10000 })
    await page.click('ytd-subscribe-button-renderer tp-yt-paper-button')
    console.log('[✅ Subscribed]')
  } catch (err) {
    console.warn('[⚠️ Sub Failed]', err.message)
  }

  await delay(3000)
  await browser.close()
  console.log('[🔚 Session Complete]')
})()
