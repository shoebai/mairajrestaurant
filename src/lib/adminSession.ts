import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "./firebase"

/*
 * Admin session rules
 * 1. One device at a time: signing in records this device's session id in
 *    Firestore (adminSessions/{uid}). Any other device signed in to the same
 *    account notices the change and signs itself out.
 * 2. One-hour sessions: after 1 hour the admin is asked whether to keep
 *    working. If nobody answers within 2 minutes, they are signed out.
 */

export const SESSION_LENGTH_MS = 60 * 60 * 1000 // 1 hour
export const WARNING_MS = 2 * 60 * 1000 // time to answer "stay signed in?"

const SESSION_ID_KEY = "mairaj-admin-session-id"
const EXPIRES_KEY = "mairaj-admin-session-expires"
const REASON_KEY = "mairaj-admin-logout-reason"

export type LogoutReason = "other-device" | "expired"

const read = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Storage blocked (private mode): rules still apply for this visit.
  }
}

export const localSessionId = () => read(SESSION_ID_KEY)

export function sessionExpiresAt() {
  return Number(read(EXPIRES_KEY)) || 0
}

/** Start or extend the 1-hour session (shared by all tabs on this device). */
export function extendSession() {
  write(EXPIRES_KEY, String(Date.now() + SESSION_LENGTH_MS))
}

function describeDevice() {
  const ua = navigator.userAgent
  const os = /Android/i.test(ua) ? "Android" : /iPhone|iPad/i.test(ua) ? "iPhone/iPad" : /Windows/i.test(ua) ? "Windows" : /Mac/i.test(ua) ? "Mac" : "Other"
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : /Firefox\//.test(ua) ? "Firefox" : "Browser"
  return `${browser} on ${os}`
}

/** Makes this device the only signed-in device for this account. */
export async function claimSession(uid: string) {
  const id = crypto.randomUUID()
  write(SESSION_ID_KEY, id)
  extendSession()
  await setDoc(doc(db, "adminSessions", uid), {
    sessionId: id,
    device: describeDevice(),
    signedInAt: serverTimestamp(),
  })
}

/** Calls `onKicked` if another device signs in to this account. */
export function watchSession(uid: string, onKicked: () => void, onMissing: () => void) {
  return onSnapshot(
    doc(db, "adminSessions", uid),
    (snap) => {
      const remote = snap.data()?.sessionId as string | undefined
      if (!remote) return onMissing()
      if (remote !== localSessionId()) onKicked()
    },
    () => {
      // Can't read (rules not published yet): don't lock anyone out.
    }
  )
}

export function clearLocalSession(reason?: LogoutReason) {
  write(SESSION_ID_KEY, null)
  write(EXPIRES_KEY, null)
  try {
    if (reason) sessionStorage.setItem(REASON_KEY, reason)
  } catch {
    // ignore
  }
}

/** Why the admin was signed out last time (shown once on the login page). */
export function takeLogoutReason(): LogoutReason | null {
  try {
    const r = sessionStorage.getItem(REASON_KEY) as LogoutReason | null
    sessionStorage.removeItem(REASON_KEY)
    return r
  } catch {
    return null
  }
}
