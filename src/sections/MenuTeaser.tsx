import { Link } from "react-router"
import { useReveal } from "@/hooks/useReveal"
import { useMenuItems } from "@/lib/firestoreMenu"
import { useT, useLanguage } from "@/lib/i18n"

export default function MenuTeaser() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { lang } = useLanguage()
  const { items } = useMenuItems()
  const featured = items.filter((m) => m.featured)

  if (featured.length === 0) return null

  return (
    <section className="py-24 md:py-32 bg-foreground text-cream">
      <div ref={ref} className="reveal max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            {t("menuTeaserEyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl">{t("menuTeaserTitle")}</h2>
        </div>

        <div className="flex flex-col gap-7">
          {featured.map((item) => (
            <div key={item.id} className="flex items-baseline">
              <div>
                <h3 className="font-display text-xl md:text-2xl text-cream">
                  {lang === "ar" && item.nameAr ? item.nameAr : item.name}
                </h3>
                {item.desc && (
                  <p className="font-body text-cream/50 text-sm mt-1">
                    {lang === "ar" && item.descAr ? item.descAr : item.desc}
                  </p>
                )}
              </div>
              <span className="menu-dots" />
              <span className="font-display text-lg text-gold shrink-0">{item.price}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            to="/menu"
            className="inline-block border border-gold text-gold px-8 py-3 text-xs tracking-mega uppercase font-body hover:bg-gold hover:text-cream transition-colors"
          >
            {t("seeFullMenu")}
          </Link>
        </div>
      </div>
    </section>
  )
}
