import {
  runWinsAutoFollow,
  WINS_CHANNEL_URL
} from './auto-follow.js'

async function main() {
  console.log('=== WINS BAILEYS TEST ===')
  console.log('Channel:', WINS_CHANNEL_URL)

  // Simulasi saja: tidak melakukan follow sungguhan.
  const result = await runWinsAutoFollow(
    {
      enabled: false,
      channelJid: ''
    },
    async () => {
      console.log('Simulasi follow')
    }
  )

  console.log('Follow aktif:', result)
}

main().catch(console.error)
