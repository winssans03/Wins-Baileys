import { createReconnectController } from '../src/index.js'

const reconnect = createReconnectController({
  initialDelayMs: 100,
  maxDelayMs: 500,
  maxRetries: 3
})

let attempts = 0

function testReconnect() {
  const scheduled = reconnect.schedule(async () => {
    attempts++
    console.log(`[WINS TEST] Percobaan: ${attempts}`)

    if (attempts < 3) {
      testReconnect()
    } else {
      console.log('[WINS TEST] Pengujian selesai.')
      reconnect.stop()
    }
  })

  if (!scheduled) {
    console.log('[WINS TEST] Jadwal tidak diterima.')
  }
}

testReconnect()
