import { useEffect, useRef } from "react"

/**
 * Attaches an IntersectionObserver to the returned ref.
 * Add the `reveal` class to any element using this ref;
 * `is-visible` is added once it scrolls into view (see index.css).
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
