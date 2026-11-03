import type { ImageTone } from "@/hooks/useImageTone"

/**
 * Shows a photo inside a frame. When the photo has a plain white background
 * (tone "light"), the frame turns the page colour and the white melts into it,
 * so the dish sits directly on the page. Other photos fill the frame as usual.
 *
 * The frame needs an explicit page-colour background for the blend to work,
 * which is why `bg-cream` is set here rather than inherited.
 */
export default function BlendImage({
  src,
  alt,
  tone,
  frameClass,
  photoFrameClass = "",
  lightFrameClass = "",
  padding = "p-[6%]",
  lazy = true,
  lightBg = "bg-cream",
}: {
  src: string
  alt: string
  tone?: ImageTone
  /** Classes for the frame in both cases (size, shape, overflow). */
  frameClass: string
  /** Extra frame classes for normal photos (border, white background…). */
  photoFrameClass?: string
  /** Extra frame classes for white-background photos. */
  lightFrameClass?: string
  padding?: string
  lazy?: boolean
  /** The colour the white melts into: whatever is behind the frame. */
  lightBg?: string
}) {
  const light = tone === "light"
  return (
    <div className={`${frameClass} ${light ? `${lightBg} ${lightFrameClass}` : photoFrameClass}`}>
      <img
        src={src}
        alt={alt}
        loading={lazy ? "lazy" : undefined}
        draggable={false}
        className={light ? `h-full w-full object-contain mix-blend-multiply ${padding}` : "h-full w-full object-cover"}
      />
    </div>
  )
}
