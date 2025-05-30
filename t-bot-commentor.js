// t-bot-commenter.js

require('dotenv').config()
const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const injectEntropy = require('./entropy-injector')

puppeteer.use(StealthPlugin())

const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const videos = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean)

const comments = [
  "Insane. Deserves way more views.",
  "This needs to blow up 🔥🔥🔥",
  "Underrated masterpiece fr",
  "Another one from StayBusy64?? I'm locked in.",
  "Popped up on my recs — glad it did",
  "Vibes on another level"
]

const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN || 40)
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX || 180)

async function typeLikeHuman(page, selector, text) {
  for (let char of text) {
    await page.type(selector, char)
    await delay(40 + Math.random() * 90)
  }
}

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
  console.log(`[💬 T-BOT] Commenting on: ${url}`)
  await page.goto(url, { waitUntil: 'networkidle2' })

  await injectEntropy(page)

  const watchTimeSec = Math.floor(Math.random() * (WATCH_TIME_MAX - WATCH_TIME_MIN + 1)) + WATCH_TIME_MIN
  console.log(`[⏱️ Watch time before comment] ${watchTimeSec}s`)
  await delay(watchTimeSec * 1000)

  try {
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight))
    await delay(4000)

    await page.waitForSelector('ytd-comment-simplebox-renderer', { timeout: 10000 })
    await page.click('ytd-comment-simplebox-renderer')
    await delay(1000)

    const inputSelector = '#contenteditable-root'
    const randomComment = comments[Math.floor(Math.random() * comments.length)]
    await typeLikeHuman(page, inputSelector, randomComment)
    await delay(1000)

    await page.click('#submit-button')
    console.log(`[✅ Comment Posted] "${randomComment}"`)
  } catch (err) {
    console.warn('[⚠️ Comment Failed]', err.message)
  }

  await delay(3000)
  await browser.close()
  console.log('[🔚 Session Complete]')
})()
