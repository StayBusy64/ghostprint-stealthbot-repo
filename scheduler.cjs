require('dotenv').config()
const { spawn } = require('child_process')

function randomDelay(min = 60000, max = 300000) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function loopGhostbot() {
  while (true) {
    console.log(`[Scheduler] Launching ghostbot.js @ ${new Date().toLocaleTimeString()}`)

    const bot = spawn('node', ['ghostbot.cjs'], {
      stdio: 'inherit',
      shell: true
    })

    await new Promise(resolve => {
      bot.on('exit', code => {
        console.log(`[Scheduler] ghostbot.js exited with code ${code}`)
        resolve()
      })
    })

    const waitTime = randomDelay(
      process.env.MIN_DELAY ? parseInt(process.env.MIN_DELAY) : 90000,
      process.env.MAX_DELAY ? parseInt(process.env.MAX_DELAY) : 300000
    )

    console.log(`[Scheduler] Waiting ${(waitTime / 1000 / 60).toFixed(1)} min before next run...\n`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
}

loopGhostbot()
