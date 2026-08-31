import { useEffect, useState } from "react"
import { useReveal } from "@/hooks/useReveal"
import { useT, useLanguage } from "@/lib/i18n"
import { useGallery } from "@/lib/firestoreGallery"

const SLIDE_INTERVAL = 3500

function GalleryTile({
  title,
  desc,
  images,
  large,
}: {
  title: string
  desc?: string
  images: string[]
  large: boolean
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), SLIDE_INTERVAL)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <div
      className={`relative aspect-square overflow-hidden bg-foreground/5 ${
        large ? "md:col-span-2 md:aspect-auto md:row-span-2" : ""
      }`}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
          style={{ opacity: i === active ? 1 : 0, transitionDuration: "1200ms" }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <span className="font-display text-cream text-sm md:text-base italic block">{title}</span>
        {desc && (
          <span className="font-body text-cream/80 text-xs mt-1 block">{desc}</span>
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute top-3 right-3 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? "w-4 bg-gold" : "w-1 bg-cream/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Gallery() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { lang } = useLanguage()
  const { entries, loading } = useGallery()

  if (!loading && entries.length === 0) return null

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-6">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            {t("galleryEyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">{t("galleryTitle")}</h2>
          <p className="font-body text-foreground/60 text-sm max-w-md mx-auto">
            {t("galleryIntro")}
          </p>
        </div>

        {!loading && (
          <div ref={ref} className="reveal grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-10">
            {entries.map((entry, i) => (
              <GalleryTile
                key={entry.id}
                title={lang === "ar" && entry.titleAr ? entry.titleAr : entry.title}
                desc={lang === "ar" && entry.descAr ? entry.descAr : entry.desc}
                images={entry.images ?? []}
                large={i === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
