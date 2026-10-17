import { useCallback, useRef } from "react"

/**
 * Returns a ref for an element with the `reveal` class; `is-visible` is
 * added once it scrolls into view (see index.css).
 *
 * This is a *callback* ref, so it also works for content that appears later,
 * e.g. the gallery and featured dishes, which load from the database after
 * the page has opened.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const observerRef = useRef<IntersectionObserver | null>(null)

  return useCallback(
    (node: T | null) => {
      observerRef.current?.disconnect()
      observerRef.current = null
      if (!node) return

      if (typeof IntersectionObserver === "undefined") {
        node.classList.add("is-visible")
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.disconnect()
          }
        },
        { threshold: Math.min(threshold, 0.05) }
      )
      observer.observe(node)
      observerRef.current = observer
    },
    [threshold]
  )
}
