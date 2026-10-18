import { useEffect } from "react"
import { useLocation } from "react-router"

/**
 * Scrolls to the top on page change, or to a section when the link has a
 * hash (e.g. /#location).
 *
 * Several homepage sections (favourites, biryani house, offers, gallery) load
 * from the database a moment after the page opens and push everything below
 * them further down. So after jumping to the section we keep it lined up
 * while the page settles, and stop as soon as the visitor scrolls themselves.
 */
const SETTLE_MS = 2500

export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    const start = performance.now()
    let stopped = false
    let tries = 0
    let timer = 0
    let observer: ResizeObserver | undefined

    const stop = () => {
      stopped = true
      observer?.disconnect()
      window.clearTimeout(timer)
      window.removeEventListener("wheel", stop)
      window.removeEventListener("touchstart", stop)
      window.removeEventListener("keydown", stop)
    }

    const align = (smooth: boolean) => {
      const el = document.getElementById(id)
      if (!el) return false
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" })
      return true
    }

    const begin = () => {
      if (stopped) return
      if (!align(true)) {
        if (tries++ < 30) timer = window.setTimeout(begin, 100)
        return
      }
      // Re-align whenever the page height changes while content is loading.
      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(() => {
          if (stopped) return
          if (performance.now() - start > SETTLE_MS) return stop()
          align(false)
        })
        observer.observe(document.body)
      }
      timer = window.setTimeout(stop, SETTLE_MS)
    }

    // Any real scrolling by the visitor ends the auto-alignment.
    window.addEventListener("wheel", stop, { passive: true })
    window.addEventListener("touchstart", stop, { passive: true })
    window.addEventListener("keydown", stop)

    begin()
    return stop
  }, [pathname, hash])

  return null
}
