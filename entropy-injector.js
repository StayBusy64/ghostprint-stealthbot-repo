module.exports = async function entropyInject(page) {
  const delay = ms => new Promise(res => setTimeout(res, ms))

  // Mouse wiggle
  const width = 1280
  const height = 720

  for (let i = 0; i < 5 + Math.floor(Math.random() * 10); i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    await page.mouse.move(x, y, { steps: 15 })
    await delay(500 + Math.random() * 1000)
  }

  // Scroll a few times
  const scrollAmount = 300 + Math.floor(Math.random() * 800)
  await page.evaluate(scrollY => window.scrollBy(0, scrollY), scrollAmount)
  await delay(3000 + Math.random() * 3000)

  // Random volume adjustments
  if (Math.random() > 0.6) {
    await page.keyboard.press('ArrowUp')
    await delay(200)
    await page.keyboard.press('ArrowUp')
    await delay(200)
  }

  // Occasionally pause/play like tab switchers
  if (Math.random() > 0.7) {
    await page.keyboard.press('k') // pause
    await delay(2000 + Math.random() * 4000)
    await page.keyboard.press('k') // play
  }

  // Maybe fullscreen toggle
  if (Math.random() > 0.8) {
    await page.keyboard.press('f')
    await delay(4000 + Math.random() * 5000)
    await page.keyboard.press('f')
  }

  console.log('[Entropy] Entropy injected into session.')
}
