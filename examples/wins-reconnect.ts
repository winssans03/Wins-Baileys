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
const phoneNumber = '6287835485298'
let isConnecting = false
let shouldReconnect = true

async function connect() {
if (isConnecting || !shouldReconnect) return

isConnecting = true
let retryScheduled = false

try {
const { state, saveCreds } =
await useMultiFileAuthState(authDir)

const socket = makeWASocket({
  auth: state,
  printQRInTerminal: false
})

socket.ev.on('creds.update', saveCreds)

socket.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
  if (connection === 'open') {
    console.log('[WINS] WhatsApp berhasil terhubung.')
    reconnect.reset()
  }

  if (connection === 'close') {
    const statusCode = (
      lastDisconnect?.error as any
    )?.output?.statusCode

    if (statusCode === DisconnectReason.loggedOut) {
      console.log('[WINS] Sesi logout. Pairing ulang diperlukan.')
      shouldReconnect = false
      reconnect.stop()
      return
    }

    if (!retryScheduled && shouldReconnect) {
      retryScheduled = true
      console.log('[WINS] Koneksi terputus, mencoba reconnect...')

      reconnect.schedule(async () => {
        await connect()
      })
    }
  }
})

if (!state.creds.registered) {
  const code = await socket.requestPairingCode(phoneNumber)
  console.log('[WINS] Pairing Code:', code)
}

} catch (error) {
console.error('[WINS] Gagal:', error)

reconnect.schedule(async () => {
  await connect()
})

} finally {
isConnecting = false
}
}

connect()
