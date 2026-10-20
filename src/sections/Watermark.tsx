import type { CSSProperties } from "react"
import { useWatermark, type WatermarkSection, type WatermarkSettings } from "@/lib/firestoreSite"
import { optimizedImage } from "@/lib/storage"
import logo from "@/assets/mairaj-logo.jpeg"

const SIZES: Record<WatermarkSettings["size"], string> = {
  small: "min(240px, 55%)",
  medium: "min(380px, 70%)",
  large: "min(540px, 85%)",
}

/** The watermark picture itself; also used for the live preview in the admin panel. */
export function WatermarkImage({ settings }: { settings: WatermarkSettings }) {
  const src = settings.image ? optimizedImage(settings.image, 1100) : logo
  const horizontal: CSSProperties =
    settings.position === "left"
      ? { insetInlineStart: "-4%" }
      : settings.position === "right"
        ? { insetInlineEnd: "-4%" }
        : { left: "50%", transform: "translate(-50%, -50%)" }

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none absolute z-0 select-none mix-blend-multiply"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        width: SIZES[settings.size],
        opacity: settings.opacity,
        filter: settings.monochrome ? "grayscale(1) sepia(0.35) hue-rotate(130deg) saturate(1.4)" : undefined,
        ...horizontal,
      }}
    />
  )
}

/** Drop inside a `relative overflow-hidden` section. Managed in Admin → Homepage. */
export default function Watermark({ section }: { section: WatermarkSection }) {
  const { watermark, loading } = useWatermark()
  if (loading || !watermark.enabled || !watermark.sections.includes(section)) return null
  return <WatermarkImage settings={watermark} />
}
