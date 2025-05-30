// t-bot-commenter.js

require('dotenv').config()
const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const injectEntropy = require('./entropy-injector')

puppeteer.use(StealthPlugin())

const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const videos = fs.readFileSync('videos.txt', 'utf-8').split('\n').filter(Boolean)

// 🔁 Comment bank: feel free to expand this
const comments = [
  "This one hit different 🔥",
  "Crazy how underrated this is",
  "Back again, still a banger.",
  "This needs way more views",
  "StayBusy64 never misses!",
  "A hidden gem on YouTube fr"
]

const WATCH_TIME_MIN = parseInt(process.env.WATCH_TIME_MIN || 40)
const WATCH_TIME_MAX = parseInt(process.env.WATCH_TIME_MAX || 180)

function typeLikeHuman(page, selector, message) {
  return new Promise(async (res) => {
    for (let char of message) {
      await page.type(selector, char)
      await delay(50 + Math.random() * 100)
    }
    res()
  })
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
  console.log(`[⏳ Watch time before comment] ${watchTimeSec}s`)
  await delay(watchTimeSec * 1000)

  try {
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight)) // scroll to comment section
    await delay(4000)

    const commentBtnSelector = 'ytd-comment-simplebox-renderer'
    await page.waitForSelector(commentBtnSelector, { timeout: 10000 })
    await page.click(commentBtnSelector)
    await delay(1000)

    const inputSelector = '#contenteditable-root'
    const randomComment = comments[Math.floor(Math.random() * comments.length)]
    await typeLikeHuman(page, inputSelector, randomComment)
    await delay(1000)

    const submitButton = '#submit-button'
    await page.click(submitButton)
    console.log(`[✅ Comment Posted] "${randomComment}"`)
  } catch (err) {
    console.warn('[⚠️ Comment Failed]', err.message)
  }

  await delay(3000)
  await browser.close()
  console.log('[🔚 Session Complete]')
})()
