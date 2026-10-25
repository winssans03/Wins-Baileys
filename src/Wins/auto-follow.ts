/**
 * WINS Baileys — Explicit Newsletter Follow
 * Follow hanya berjalan jika pemilik akun mengaktifkannya.
 */

export const WINS_CHANNEL_URL =
  'https://whatsapp.com/channel/0029Vb8xDMjChq6RSZUwfJ3x'

export interface WinsAutoFollowOptions {
  enabled: boolean
  channelJid: string
}

export async function runWinsAutoFollow(
  options: WinsAutoFollowOptions,
  newsletterFollow: (jid: string) => Promise<unknown>
): Promise<boolean> {
  if (!options.enabled) {
    console.log('[WINS Baileys] Auto-follow nonaktif.')
    return false
  }

  const jid = options.channelJid.trim()

  if (!jid || !jid.endsWith('@newsletter')) {
    throw new Error(
      '[WINS Baileys] ID newsletter tidak valid.'
    )
  }

  await newsletterFollow(jid)
  console.log('[WINS Baileys] Permintaan follow terkirim.')

  return true
}
