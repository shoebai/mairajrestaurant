import { useReveal } from "@/hooks/useReveal"
import { useMenuItems } from "@/lib/firestoreMenu"
import { useT, useLanguage } from "@/lib/i18n"
import { useHomeText } from "@/lib/firestoreSite"

/** Lists every dish with "biryani" in its name, straight from Admin → Menu. */
export default function BiryaniHouse() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { lang } = useLanguage()
  const { items } = useMenuItems()
  const { get } = useHomeText()

  const biryanis = items.filter((i) => /biryani|برياني/i.test(`${i.name} ${i.nameAr ?? ""}`)).slice(0, 8)
  if (biryanis.length === 0) return null

  return (
    <section id="biryani" className="bg-sand">
      <div ref={ref} className="reveal mx-auto flex max-w-6xl flex-col gap-12 px-6 py-24 md:flex-row md:gap-16 md:py-28">
        <div className="flex flex-col gap-4 md:w-2/5">
          <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-gold">{t("biryaniEyebrow")}</p>
          <h2 className="font-display text-4xl leading-tight md:text-6xl">{get("biryaniTitle", lang) || t("biryaniTitle")}</h2>
          <p className="max-w-sm font-body text-lg leading-relaxed text-foreground/75">{get("biryaniBody", lang) || t("biryaniBody")}</p>
        </div>
        <ul className="flex-1">
          {biryanis.map((b) => {
            const name = lang === "ar" && b.nameAr ? b.nameAr : b.name
            const other = lang === "ar" ? "" : b.nameAr
            return (
              <li key={b.id} className="flex items-baseline gap-3 border-b border-foreground/15 py-5">
                <span className="font-display text-2xl">{name}</span>
                {other && (
                  <span dir="rtl" className="hidden font-arabic text-lg text-foreground/55 sm:inline">
                    {other}
                  </span>
                )}
                <span className="menu-dots" />
                <span className="font-body text-xl font-bold text-teal">{b.price}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
