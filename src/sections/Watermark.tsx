import type { CSSProperties } from "react"
import {
  useWatermark,
  type WatermarkMark,
  type WatermarkSection,
  type WatermarkSettings,
} from "@/lib/firestoreSite"
import { optimizedImage } from "@/lib/storage"
import logo from "@/assets/mairaj-logo.jpeg"

const SIZES: Record<WatermarkMark["size"], string> = {
  small: "min(220px, 45%)",
  medium: "min(340px, 60%)",
  large: "min(500px, 80%)",
}

/** One watermark picture. Also used for the live preview in the admin panel. */
export function WatermarkImage({
  mark,
  opacity,
  monochrome,
}: {
  mark: WatermarkMark
  opacity: number
  monochrome: boolean
}) {
  const src = mark.image ? optimizedImage(mark.image, 1000) : logo

  const style: CSSProperties = {
    width: SIZES[mark.size],
    opacity,
    filter: monochrome ? "grayscale(1) sepia(0.35) hue-rotate(130deg) saturate(1.4)" : undefined,
  }
  let tx = "0"
  let ty = "0"

  if (mark.position === "left") style.insetInlineStart = "-4%"
  else if (mark.position === "right") style.insetInlineEnd = "-4%"
  else {
    style.left = "50%"
    tx = "-50%"
  }

  if (mark.vertical === "top") style.top = "-4%"
  else if (mark.vertical === "bottom") style.bottom = "-4%"
  else {
    style.top = "50%"
    ty = "-50%"
  }
  style.transform = `translate(${tx}, ${ty})`

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none absolute z-0 select-none mix-blend-multiply"
      style={style}
    />
  )
}

export function WatermarkLayer({ settings }: { settings: WatermarkSettings }) {
  return (
    <>
      {settings.marks.map((m) => (
        <WatermarkImage key={m.id} mark={m} opacity={settings.opacity} monochrome={settings.monochrome} />
      ))}
    </>
  )
}

/** Drop inside a `relative overflow-hidden` section. Managed in Admin → Homepage. */
export default function Watermark({ section }: { section: WatermarkSection }) {
  const { watermark, loading } = useWatermark()
  if (loading || !watermark.enabled || !watermark.sections.includes(section)) return null
  return <WatermarkLayer settings={watermark} />
}
