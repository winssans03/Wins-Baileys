import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from '../src/index.js'

import { createReconnectController } from '../src/index.js'

const reconnect = createReconnectController({
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  maxRetries: 8
})

const authDir = './wins-session'
let isConnecting = false
let shouldReconnect = true

async function connect() {
  if (isConnecting || !shouldReconnect) return

  isConnecting = true

  try {
    const { state, saveCreds } =
      await useMultiFileAuthState(authDir)

    const socket = makeWASocket({
      auth: state
    })

    socket.ev.on('creds.update', saveCreds)

    socket.ev.on('connection.update', ({ connection, lastDisconnect }) => {
      if (connection === 'open') {
        console.log('[WINS] WhatsApp terhubung.')
        reconnect.reset()
      }

      if (connection === 'close') {
        const statusCode = (
          lastDisconnect?.error as any
        )?.output?.statusCode

        if (statusCode === DisconnectReason.loggedOut) {
          console.log('[WINS] Sesi logout. Hapus sesi hanya jika ingin pairing ulang.')
          shouldReconnect = false
          reconnect.stop()
          return
        }

        console.log('[WINS] Koneksi terputus.')

        reconnect.schedule(async () => {
          await connect()
        })
      }
    })
  } catch (error) {
    console.error('[WINS] Gagal membuat koneksi:', error)

    reconnect.schedule(async () => {
      await connect()
    })
  } finally {
    isConnecting = false
  }
}

connect()
