import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSlideshow } from "@/hooks/useSlideshow"
import { useImageTones } from "@/hooks/useImageTone"
import { Link } from "react-router"
import { useT, useLanguage } from "@/lib/i18n"
import { useHeroSettings, useHomeText } from "@/lib/firestoreSite"
import { optimizedImage } from "@/lib/storage"
import hero1 from "@/assets/hero/hero-1.webp"
import hero2 from "@/assets/hero/hero-2.webp"
import hero3 from "@/assets/hero/hero-3.webp"

// Shown until photos are uploaded in Admin → Homepage photos.
const defaultSlides = [hero1, hero2, hero3]
const SLIDE_DURATION = 5000

export default function Hero() {
  const t = useT()
  const { lang } = useLanguage()
  const { get } = useHomeText()
  const { hero, loading } = useHeroSettings()

  const slides = loading
    ? []
    : hero.images.length > 0
      ? hero.images.map((url) => optimizedImage(url, 1000))
      : defaultSlides

  const { active, goTo, next, prev, swipeHandlers } = useSlideshow(slides.length, SLIDE_DURATION)
  const tones = useImageTones(slides)

  const secondLine = t("heritageSecondLine")

  return (
    <section className="overflow-hidden bg-teal pt-24 text-cream md:pt-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pt-10 md:flex-row md:items-end md:gap-14 md:pt-16">
        {/* Text */}
        <div className="flex flex-1 flex-col gap-6 pb-4 md:pb-24">
          <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-saffron">
            {get("heroEyebrow", lang) || t("heritageEyebrow")}
          </p>
          <h1 className="whitespace-pre-line font-display text-[2.75rem] leading-[1.04] sm:text-6xl lg:text-[5.25rem]">
            {get("heroTitle", lang) || t("heritageTitle")}
          </h1>
          <p className="max-w-md whitespace-pre-line font-body text-lg leading-relaxed text-cream/80">{get("heroBody", lang) || t("heritageBody")}</p>
          {secondLine && (
            <p dir="rtl" lang="ar" className="font-arabic text-2xl text-cream md:text-[1.7rem]">
              {secondLine}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="rounded-md bg-saffron px-7 py-3.5 font-body text-base font-bold text-ink transition-colors hover:bg-[hsl(36_80%_63%)]"
            >
              {t("heritageExplore")}
            </Link>
            {/* Opens the menu so guests pick dishes first; the order is then sent on WhatsApp. */}
            <Link
              to="/menu?start=order"
              className="rounded-md border border-cream/70 px-7 py-3.5 font-body text-base font-bold text-cream transition-colors hover:border-saffron hover:text-saffron"
            >
              {t("heritageOrderWhatsApp")}
            </Link>
          </div>
        </div>

        {/* Arch-framed slideshow (photos from Admin → Homepage photos) */}
        <div className="flex flex-1 justify-center">
          <div className="relative aspect-[5/6] w-full max-w-[30rem] rounded-t-full border-[3px] border-b-0 border-saffron px-3 pt-3 md:px-3.5 md:pt-3.5">
            <div
              {...swipeHandlers}
              className="relative h-full w-full touch-pan-y select-none overflow-hidden rounded-t-full bg-ink"
            >
              {slides.map((src, i) => {
                // Dish photos on a white background are shown whole and blended
                // into the cream arch (white becomes cream). Other photos, like
                // the storefront, fill the arch edge to edge.
                const light = tones[src] === "light"
                return (
                  <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${light ? "bg-cream" : ""}`}
                    style={{ opacity: i === active ? 1 : 0 }}
                    aria-hidden={i !== active}
                  >
                    <img
                      src={src}
                      alt=""
                      draggable={false}
                      className={
                        light
                          ? "absolute inset-0 h-full w-full object-contain object-center p-[8%] pb-[20%] mix-blend-multiply"
                          : "absolute inset-0 h-full w-full object-cover"
                      }
                    />
                  </div>
                )
              })}
            </div>
            {slides.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3">
                <button
                  onClick={prev}
                  aria-label="Previous photo"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/55 text-cream backdrop-blur-sm transition-colors hover:bg-saffron hover:text-ink"
                >
                  <ChevronLeft size={20} className="rtl:rotate-180" />
                </button>
                <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Show photo ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active ? "w-6 bg-saffron" : "w-1.5 bg-cream/80 ring-1 ring-ink/25 hover:bg-cream"
                    }`}
                  />
                ))}
                </div>
                <button
                  onClick={next}
                  aria-label="Next photo"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/55 text-cream backdrop-blur-sm transition-colors hover:bg-saffron hover:text-ink"
                >
                  <ChevronRight size={20} className="rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
