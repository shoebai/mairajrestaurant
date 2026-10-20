import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Slideshow state with autoplay, arrows and swipe.
 * After the visitor slides manually, autoplay pauses for a while so the
 * photo they chose doesn't immediately change.
 */
export function useSlideshow(count: number, interval = 5000, resumeAfter = 10000) {
  const [active, setActive] = useState(0)
  const pausedUntil = useRef(0)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    setActive((i) => (count ? i % count : 0))
  }, [count])

  useEffect(() => {
    if (count < 2) return
    const id = setInterval(() => {
      if (Date.now() < pausedUntil.current) return
      setActive((i) => (i + 1) % count)
    }, interval)
    return () => clearInterval(id)
  }, [count, interval])

  const goTo = useCallback(
    (i: number) => {
      if (count < 1) return
      pausedUntil.current = Date.now() + resumeAfter
      setActive(((i % count) + count) % count)
    },
    [count, resumeAfter]
  )
  const next = useCallback(() => goTo(active + 1), [goTo, active])
  const prev = useCallback(() => goTo(active - 1), [goTo, active])

  // Swipe (touch) or drag (mouse). In right-to-left pages the direction flips.
  const swipeHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      startX.current = e.clientX
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (startX.current === null) return
      const dx = e.clientX - startX.current
      startX.current = null
      if (Math.abs(dx) < 40) return
      const rtl = getComputedStyle(e.currentTarget as Element).direction === "rtl"
      const forward = rtl ? dx > 0 : dx < 0
      if (forward) next()
      else prev()
    },
    onPointerCancel: () => {
      startX.current = null
    },
  }

  return { active, goTo, next, prev, swipeHandlers }
}
