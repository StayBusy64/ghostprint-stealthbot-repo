// entropy-injector.js

module.exports = async function entropyInject(page) {
  const delay = ms => new Promise(res => setTimeout(res, ms))

  // Move mouse around randomly
  for (let i = 0; i < 6 + Math.floor(Math.random() * 5); i++) {
    const x = Math.random() * 1280
    const y = Math.random() * 720
    await page.mouse.move(x, y, { steps: 12 })
    await delay(300 + Math.random() * 700)
  }

  // Random scroll behavior
  const scrollAmount = 300 + Math.floor(Math.random() * 800)
  await page.evaluate(y => window.scrollBy(0, y), scrollAmount)
  await delay(2000 + Math.random() * 3000)

  // Simulate volume changes
  if (Math.random() > 0.6) {
    await page.keyboard.press('ArrowUp')
    await delay(250)
    await page.keyboard.press('ArrowUp')
  }

  // Random pause/play (simulate distraction)
  if (Math.random() > 0.7) {
    await page.keyboard.press('k') // Pause
    await delay(1500 + Math.random() * 3000)
    await page.keyboard.press('k') // Resume
  }

  // Random fullscreen toggle
  if (Math.random() > 0.8) {
    await page.keyboard.press('f')
    await delay(3000 + Math.random() * 4000)
    await page.keyboard.press('f')
  }

  console.log('[Entropy] Entropy injected into session.')
}
