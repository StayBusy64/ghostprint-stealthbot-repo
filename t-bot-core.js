// t-bot-core.js

require('dotenv').config()
const { spawn } = require('child_process')

const bots = [
  'ghostbot.js',
  't-bot-liker.js',
  't-bot-commenter.js',
  't-bot-subber.js'
]

function randomDelay(min = 60000, max = 240000) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickBot() {
  const weightedBots = [
    'ghostbot.js', 'ghostbot.js', // weighted to view more often
    't-bot-liker.js',
    't-bot-commenter.js',
    't-bot-subber.js'
  ]
  return weightedBots[Math.floor(Math.random() * weightedBots.length)]
}

async function loopCore() {
  while (true) {
    const chosen = pickBot()
    console.log(`[🎯 T-BOT CORE] Running: ${chosen}`)

    const bot = spawn('node', [chosen], {
      stdio: 'inherit',
      shell: true
    })

    await new Promise(res => bot.on('exit', res))

    const cooldown = randomDelay()
    console.log(`[🕒 Cooling down: ${(cooldown / 1000 / 60).toFixed(1)} minutes]`)
    await new Promise(res => setTimeout(res, cooldown))
  }
}

loopCore()
