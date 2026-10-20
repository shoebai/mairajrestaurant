import { useReveal } from "@/hooks/useReveal"
import { useT, useLanguage } from "@/lib/i18n"
import { useHomeText } from "@/lib/firestoreSite"
import Watermark from "@/sections/Watermark"

export default function Story() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { lang } = useLanguage()
  const { get } = useHomeText()
  const customTitle = get("storyTitle", lang)

  return (
    <section id="story" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <Watermark section="story" />
      <div ref={ref} className="reveal relative z-[1] mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <svg aria-hidden="true" width="64" height="40" viewBox="0 0 64 40" fill="none" className="text-gold" stroke="currentColor" strokeWidth="2">
          <path d="M4 38V20C4 10 16 3 32 3s28 7 28 17v18" />
          <path d="M16 38V24c0-6 7-10 16-10s16 4 16 10v14" />
        </svg>
        <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-gold">{get("storyEyebrow", lang) || t("storyEyebrow")}</p>
        <h2 className="whitespace-pre-line font-display text-4xl leading-tight md:text-5xl">
          {customTitle || (
            <>
              {t("storyTitle")} <span className="text-teal">{t("storyTitleEmphasis")}</span>
            </>
          )}
        </h2>
        <p className="max-w-2xl whitespace-pre-line font-body text-lg leading-relaxed text-foreground/75">{get("storyBody", lang) || t("storyBody")}</p>
      </div>
    </section>
  )
}
