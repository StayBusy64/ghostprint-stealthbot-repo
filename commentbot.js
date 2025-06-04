const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

require('dotenv').config()
const videoUrl = process.env.TARGET_URL
const username = process.env.YT_EMAIL
const password = process.env.YT_PASSWORD

if (!password || typeof password !== 'string') {
    console.error('❌ YT_PASSWORD is missing or invalid!')
    process.exit(1)
}

const comments = [
    "🔥 This deserves way more recognition.",
    "Ain’t no way this isn’t viral yet.",
    "W vid, slept on fr.",
    "Algorithm needs to wake up on this.",
    "Sheeshh this heat different."
]

;(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    await page.goto('https://accounts.google.com/', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('input[type="email"]', { timeout: 10000 })
    await page.type('input[type="email"]', username)
    await page.click('#identifierNext')
    await page.waitForTimeout?.(3000) || await new Promise(r => setTimeout(r, 3000))

    await page.waitForSelector('input[type="password"]', { visible: true, timeout: 10000 })
    await page.type('input[type="password"]', password)
    const nextBtn = await page.$('#passwordNext')
    if (nextBtn) await nextBtn.click()

    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    await page.goto(videoUrl, { waitUntil: 'networkidle2' })
    await page.evaluate(() => window.scrollBy(0, window.innerHeight))

    await page.waitForSelector('ytd-comment-simplebox-renderer', { visible: true, timeout: 10000 })
    await page.click('ytd-comment-simplebox-renderer')
    await page.type('#contenteditable-root', comments[Math.floor(Math.random() * comments.length)])
    await page.click('#submit-button')

    console.log('✅ Comment posted successfully.')
    await browser.close()
})()
