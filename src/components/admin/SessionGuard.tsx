import { useEffect, useRef, useState } from "react"
import { Clock } from "lucide-react"
import { useAuth } from "@/lib/auth"
import {
  WARNING_MS,
  claimSession,
  extendSession,
  localSessionId,
  sessionExpiresAt,
  watchSession,
} from "@/lib/adminSession"

/**
 * Enforces the admin session rules while the admin panel is open:
 * - signs out if the same account signs in on another device
 * - after 1 hour asks "Still working?"; no answer within 2 minutes → signs out
 */
export default function SessionGuard() {
  const { user, logout } = useAuth()
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const loggingOut = useRef(false)

  const signOutFor = (reason: "other-device" | "expired") => {
    if (loggingOut.current) return
    loggingOut.current = true
    logout(reason)
  }

  // One device at a time.
  useEffect(() => {
    if (!user) return
    // Signed in before this rule existed: claim the session for this device.
    if (!localSessionId()) claimSession(user.uid).catch(() => {})
    return watchSession(
      user.uid,
      () => signOutFor("other-device"),
      () => claimSession(user.uid).catch(() => {})
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  // One-hour session with a warning.
  useEffect(() => {
    if (!user) return
    if (!sessionExpiresAt()) extendSession()

    const tick = () => {
      const expires = sessionExpiresAt()
      const now = Date.now()
      if (now >= expires + WARNING_MS) return signOutFor("expired")
      if (now >= expires) setSecondsLeft(Math.ceil((expires + WARNING_MS - now) / 1000))
      else setSecondsLeft(null)
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  if (secondsLeft === null) return null

  const mins = Math.floor(secondsLeft / 60)
  const secs = String(secondsLeft % 60).padStart(2, "0")

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/55 p-6">
      <div role="alertdialog" aria-modal="true" aria-labelledby="session-title" className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-saffron/20 text-gold">
          <Clock size={22} />
        </div>
        <h2 id="session-title" className="font-display text-2xl">Still working?</h2>
        <p className="mt-1 font-body text-sm text-foreground/65">
          Your 1-hour session is ending. For safety you'll be signed out in{" "}
          <strong className="text-foreground">
            {mins}:{secs}
          </strong>{" "}
          unless you choose to stay. Save anything you're editing first.
        </p>
        <div className="mt-5 flex gap-2.5">
          <button
            onClick={() => signOutFor("expired")}
            className="flex-1 rounded-md border border-foreground/20 py-2.5 font-body text-sm font-semibold text-foreground/70 hover:bg-foreground/5"
          >
            Sign out
          </button>
          <button
            autoFocus
            onClick={() => {
              extendSession()
              setSecondsLeft(null)
            }}
            className="flex-1 rounded-md bg-teal py-2.5 font-body text-sm font-bold text-cream hover:bg-[hsl(182_69%_24%)]"
          >
            Stay signed in
          </button>
        </div>
      </div>
    </div>
  )
}
