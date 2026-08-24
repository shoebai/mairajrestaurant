import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useT } from "@/lib/i18n"
import hero1 from "@/assets/hero/hero-1.webp"
import hero2 from "@/assets/hero/hero-2.webp"
import hero3 from "@/assets/hero/hero-3.webp"

const slides = [hero1, hero2, hero3]
const SLIDE_DURATION = 5000

export default function Hero() {
  const t = useT()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length)
    }, SLIDE_DURATION)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground">
      {/* Crossfading background photos */}
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity ease-in-out"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === active ? 1 : 0,
              transitionDuration: "1500ms",
            }}
          />
        ))}
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-6">
          {t("heroEyebrow")}
        </p>

        <h1 className="font-display text-cream leading-[1.05] text-5xl sm:text-6xl md:text-7xl mb-6">
          {t("heroTitleLine1")}
          <br />
          <span className="italic text-gold">{t("heroTitleEmphasis")}</span> {t("heroTitleLine2")}
        </h1>

        <p className="font-body text-cream/70 text-base md:text-lg max-w-xl mx-auto mb-10">
          {t("heroBody")}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/menu"
            className="bg-gold text-cream px-8 py-3 text-xs tracking-mega uppercase font-body hover:bg-gold/90 transition-colors"
          >
            {t("heroViewMenu")}
          </Link>
          <a
            href="#reservation"
            className="border border-cream/30 text-cream px-8 py-3 text-xs tracking-mega uppercase font-body hover:border-gold hover:text-gold transition-colors"
          >
            {t("heroReserveTable")}
          </a>
        </div>

        <div className="flex items-center justify-center gap-3 mt-16 text-cream/40">
          <span className="w-16 border-t border-dotted border-cream/40" />
          <span className="font-display italic text-sm">{t("heroSinceDayOne")}</span>
          <span className="w-16 border-t border-dotted border-cream/40" />
        </div>

        {/* Slide indicator dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-gold" : "w-1.5 bg-cream/30 hover:bg-cream/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/50 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </section>
  )
}
