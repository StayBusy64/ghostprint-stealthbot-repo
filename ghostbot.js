// ghostbot.js

const injectEntropy = require('./entropy-injector')
require('dotenv').config()
const fs = require('fs')
const puppeteer = require('puppeteer-core')

const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const videos = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean)

const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN || 45)
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX || 300)

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/nix/store/chromium/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--disable-extensions'
    ]
  })

  const page = await browser.newPage()

  const url = videos[Math.floor(Math.random() * videos.length)]
  console.log(`[👻 Ghosting viewer] View: ${url}`)
  await page.goto(url, { waitUntil: 'networkidle2' })

  await injectEntropy(page)

  const watchTimeSec = Math.floor(Math.random() * (WATCH_TIME_MAX - WATCH_TIME_MIN + 1)) + WATCH_TIME_MIN
  console.log(`[🕒 Watch time] ${watchTimeSec}s`)
  await delay(watchTimeSec * 1000)

  await browser.close()
  console.log('[✅ Session Ended]')
})()
