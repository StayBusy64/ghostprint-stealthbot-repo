// phantomdroid.js

require('dotenv').config()
const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const injectEntropy = require('./entropy-injector')

puppeteer.use(StealthPlugin())

const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const videos = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean)

const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN || 60)
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX || 240)

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/nix/store/chromium/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=390,844' // Android phone resolution
    ]
  })

  const page = await browser.newPage()

  await page.setUserAgent(
    'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36'
  )

  await page.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true
  })

  const url = videos[Math.floor(Math.random() * videos.length)]
  console.log(`[📱 PHANTOMDROID] Watching: ${url}`)
  await page.goto(url, { waitUntil: 'networkidle2' })

  await injectEntropy(page)

  const watchTimeSec = Math.floor(Math.random() * (WATCH_TIME_MAX - WATCH_TIME_MIN + 1)) + WATCH_TIME_MIN
  console.log(`[🕒 Watch time] ${watchTimeSec}s`)
  await delay(watchTimeSec * 1000)

  await browser.close()
  console.log('[✅ Mobile Session Complete]')
})()
