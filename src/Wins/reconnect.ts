export interface ReconnectOptions {
initialDelayMs?: number
maxDelayMs?: number
maxRetries?: number
}

export interface ReconnectController {
schedule: (callback: () => void | Promise<void>) => boolean
reset: () => void
stop: () => void
start: () => void
readonly retries: number
readonly stopped: boolean
}

export function createReconnectController(
options: ReconnectOptions = {}
): ReconnectController {
const initialDelayMs = Math.max(
100,
options.initialDelayMs ?? 1000
)

const maxDelayMs = Math.max(
initialDelayMs,
options.maxDelayMs ?? 30000
)

const maxRetries = Math.max(
0,
Math.floor(options.maxRetries ?? 8)
)

let retries = 0
let stopped = false
let timer: ReturnType<typeof setTimeout> | undefined

function schedule(
callback: () => void | Promise<void>
): boolean {
if (stopped || timer || retries >= maxRetries) {
return false
}

const delay = Math.min(
  initialDelayMs * 2 ** retries,
  maxDelayMs
)

retries++

timer = setTimeout(async () => {
  timer = undefined

  if (stopped) return

  try {
    await callback()
  } catch (error) {
    console.error(
      '[WINS Baileys] Reconnect gagal:',
      error
    )
  }
}, delay)

return true

}

function reset(): void {
retries = 0
}

function stop(): void {
stopped = true

if (timer) {
  clearTimeout(timer)
  timer = undefined
}

}

function start(): void {
stopped = false
}

return {
schedule,
reset,
stop,
start,

get retries() {
  return retries
},

get stopped() {
  return stopped
}

}
}
