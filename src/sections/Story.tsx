import { useReveal } from "@/hooks/useReveal"
import { useT } from "@/lib/i18n"

export default function Story() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div ref={ref} className="reveal max-w-4xl mx-auto px-6 text-center">
        <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-5">
          {t("storyEyebrow")}
        </p>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-8">
          {t("storyTitle")}
          <span className="text-brown italic"> {t("storyTitleEmphasis")}</span>
        </h2>
        <p className="font-body text-foreground/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          {t("storyBody")}
        </p>

        <div className="grid grid-cols-3 gap-6 md:gap-12 mt-16 max-w-xl mx-auto">
          {[
            { value: "1", label: t("statBranches") },
            { value: "40+", label: t("statDishes") },
            { value: "100%", label: t("statFresh") },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl md:text-4xl text-gold">
                {stat.value}
              </div>
              <div className="font-body text-[0.65rem] tracking-widest uppercase text-foreground/50 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
