import { useEffect } from "react"
import { useLocation } from "react-router"

/**
 * Scrolls to the top on page change, or to a section when the link has a
 * hash (e.g. /#reservation from the Menu page). Sections load their content
 * from the database, so it retries for a moment until the target exists.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }
    const id = decodeURIComponent(hash.slice(1))
    let tries = 0
    let timer: number
    const attempt = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      } else if (tries++ < 20) {
        timer = window.setTimeout(attempt, 100)
      }
    }
    attempt()
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return null
}
