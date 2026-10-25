import { useEffect, useState } from "react"

/**
 * "light" = a photo on a plain white or near-white background (typical dish
 * photos). Those are shown whole and blended into the page colour.
 * "photo" = everything else (storefront, room, food on a table): fills the frame.
 */
export type ImageTone = "light" | "photo"

const cache = new Map<string, ImageTone>()

function detect(url: string): Promise<ImageTone> {
  const known = cache.get(url)
  if (known) return Promise.resolve(known)

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      let tone: ImageTone = "photo"
      try {
        const size = 40
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size)
          const { data } = ctx.getImageData(0, 0, size, size)
          // Look at the outer border of the picture only.
          let light = 0
          let total = 0
          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              if (x > 1 && x < size - 2 && y > 1 && y < size - 2) continue
              const i = (y * size + x) * 4
              const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
              total++
              if (a < 30 || (r > 225 && g > 225 && b > 225)) light++
            }
          }
          if (light / total > 0.8) tone = "light"
        }
      } catch {
        // The browser wouldn't let us read the pixels: treat as a normal photo.
      }
      cache.set(url, tone)
      resolve(tone)
    }
    img.onerror = () => resolve("photo")
    img.src = url
  })
}

/** Works out, for each image, whether it sits on a plain white background. */
export function useImageTones(urls: string[]) {
  const [tones, setTones] = useState<Record<string, ImageTone>>(() =>
    Object.fromEntries(urls.filter((u) => cache.has(u)).map((u) => [u, cache.get(u)!]))
  )
  const key = urls.join("|")

  useEffect(() => {
    let cancelled = false
    urls.forEach((url) =>
      detect(url).then((tone) => {
        if (!cancelled) setTones((t) => (t[url] === tone ? t : { ...t, [url]: tone }))
      })
    )
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return tones
}
