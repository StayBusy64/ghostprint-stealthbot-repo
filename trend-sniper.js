// trend-sniper.js

const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
require('dotenv').config()

puppeteer.use(StealthPlugin())

const CHANNEL_URL = process.env.CHANNEL_URL || 'https://www.youtube.com/@StayBusy64/videos'
const MAX_VIDEOS = parseInt(process.env.MAX_VIDEOS || 5)

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/nix/store/chromium/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.goto(CHANNEL_URL, { waitUntil: 'networkidle2' })

  await page.waitForSelector('ytd-grid-video-renderer', { timeout: 15000 })

  const videoLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('ytd-grid-video-renderer a#video-title'))
      .map(el => el.href)
      .filter(Boolean)
  })

  const selected = videoLinks.slice(0, MAX_VIDEOS)
  fs.writeFileSync('videos.txt', selected.join('\n'), 'utf-8')

  console.log(`[📦 Sniper] Updated videos.txt with ${selected.length} videos.`)

  await browser.close()
})()
