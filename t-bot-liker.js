// t-bot-liker.js

require('dotenv').config()
const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const injectEntropy = require('./entropy-injector')

puppeteer.use(StealthPlugin())

const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const videos = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean)

const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN || 30)
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX || 120)

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
  console.log(`[👍 T-BOT] Watching: ${url}`)
  await page.goto(url, { waitUntil: 'networkidle2' })

  await injectEntropy(page)

  const watchTimeSec = Math.floor(Math.random() * (WATCH_TIME_MAX - WATCH_TIME_MIN + 1)) + WATCH_TIME_MIN
  console.log(`[⏳ Watch time] ${watchTimeSec}s`)
  await delay(watchTimeSec * 1000)

  // Click the Like button
  try {
    await page.waitForSelector('ytd-toggle-button-renderer:nth-of-type(1) button', { timeout: 10000 })
    await page.click('ytd-toggle-button-renderer:nth-of-type(1) button')
    console.log('[✅ Like Clicked]')
  } catch (err) {
    console.warn('[⚠️ Like Failed]', err.message)
  }

  await delay(2000 + Math.random() * 2000)
  await browser.close()
  console.log('[🔚 Session Complete]')
})()
