import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useT } from "@/lib/i18n"
import { useHeroSettings } from "@/lib/firestoreSite"
import { optimizedImage } from "@/lib/storage"
import { RESTAURANT_WHATSAPP } from "@/lib/config"
import hero1 from "@/assets/hero/hero-1.webp"
import hero2 from "@/assets/hero/hero-2.webp"
import hero3 from "@/assets/hero/hero-3.webp"

// Shown until photos are uploaded in Admin → Homepage photos.
const defaultSlides = [hero1, hero2, hero3]
const SLIDE_DURATION = 5000

export default function Hero() {
  const t = useT()
  const [active, setActive] = useState(0)
  const { hero, loading } = useHeroSettings()

  const slides = loading
    ? []
    : hero.images.length > 0
      ? hero.images.map((url) => optimizedImage(url, 1000))
      : defaultSlides

  useEffect(() => {
    setActive(0)
    if (slides.length < 2) return
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), SLIDE_DURATION)
    return () => clearInterval(id)
  }, [slides.length])

  const secondLine = t("heritageSecondLine")

  return (
    <section className="overflow-hidden bg-teal pt-24 text-cream md:pt-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pt-10 md:flex-row md:items-end md:gap-14 md:pt-16">
        {/* Text */}
        <div className="flex flex-1 flex-col gap-6 pb-4 md:pb-24">
          <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-saffron">
            {t("heritageEyebrow")}
          </p>
          <h1 className="font-display text-[2.75rem] leading-[1.04] sm:text-6xl lg:text-[5.25rem]">
            {t("heritageTitle")}
          </h1>
          <p className="max-w-md font-body text-lg leading-relaxed text-cream/80">{t("heritageBody")}</p>
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
            <a
              href={`https://wa.me/${RESTAURANT_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-cream/70 px-7 py-3.5 font-body text-base font-bold text-cream transition-colors hover:border-saffron hover:text-saffron"
            >
              {t("heritageOrderWhatsApp")}
            </a>
          </div>
        </div>

        {/* Arch-framed slideshow (photos from Admin → Homepage photos) */}
        <div className="flex flex-1 justify-center">
          <div className="relative aspect-[5/6] w-full max-w-[30rem] rounded-t-full border-[3px] border-b-0 border-saffron px-3 pt-3 md:px-3.5 md:pt-3.5">
            <div className="relative h-full w-full overflow-hidden rounded-t-full bg-ink">
              {slides.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out"
                  style={{ opacity: i === active ? 1 : 0 }}
                />
              ))}
            </div>
            {slides.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Show photo ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active ? "w-6 bg-saffron" : "w-1.5 bg-cream/60 hover:bg-cream"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
