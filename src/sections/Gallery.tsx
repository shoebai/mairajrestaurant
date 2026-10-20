import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSlideshow } from "@/hooks/useSlideshow"
import { useReveal } from "@/hooks/useReveal"
import { useT, useLanguage } from "@/lib/i18n"
import { useGallery } from "@/lib/firestoreGallery"
import { optimizedImage } from "@/lib/storage"

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
  const { active, next, prev, swipeHandlers } = useSlideshow(images.length, SLIDE_INTERVAL)

  return (
    <div
      {...swipeHandlers}
      className={`group relative aspect-square touch-pan-y select-none overflow-hidden bg-foreground/5 ${
        large ? "md:col-span-2 md:aspect-auto md:row-span-2" : ""
      }`}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={optimizedImage(src, large ? 1400 : 800)}
          alt={title}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
          style={{ opacity: i === active ? 1 : 0, transitionDuration: "700ms" }}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label={`Previous photo of ${title}`}
            className="absolute start-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-cream transition-opacity hover:bg-saffron hover:text-ink md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            <ChevronLeft size={18} className="rtl:rotate-180" />
          </button>
          <button
            onClick={next}
            aria-label={`Next photo of ${title}`}
            className="absolute end-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-cream transition-opacity hover:bg-saffron hover:text-ink md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            <ChevronRight size={18} className="rtl:rotate-180" />
          </button>
        </>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

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
                i === active ? "w-4 bg-saffron" : "w-1 bg-cream/50"
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
    <section id="gallery" className="py-24 md:py-32 bg-cream">
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
