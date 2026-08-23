import { Link } from "react-router"
import { useT } from "@/lib/i18n"

export default function Hero() {
  const t = useT()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, hsl(42 50% 54%) 0, transparent 45%), radial-gradient(circle at 80% 70%, hsl(20 32% 30%) 0, transparent 45%)",
        }}
      />

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
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/50 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </section>
  )
}
