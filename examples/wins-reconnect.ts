import makeWASocket, {
  DisconnectReason,
  createReconnectController
} from '../src/index.js'

const reconnect = createReconnectController({
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  maxRetries: 8
})

let socket: ReturnType<typeof makeWASocket>

function connect() {
  socket = makeWASocket({})

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
        console.log('[WINS] Logout. Login ulang diperlukan.')
        reconnect.stop()
        return
      }

      console.log('[WINS] Koneksi terputus, mencoba reconnect...')

      reconnect.schedule(async () => {
        connect()
      })
    }
  })
}

connect()
