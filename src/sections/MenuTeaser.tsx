import { Link } from "react-router"
import { Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart"
import Watermark from "@/sections/Watermark"
import { useReveal } from "@/hooks/useReveal"
import { useMenuItems } from "@/lib/firestoreMenu"
import { optimizedImage } from "@/lib/storage"
import { useT, useLanguage } from "@/lib/i18n"
import { useHomeText } from "@/lib/firestoreSite"

export default function MenuTeaser() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { lang } = useLanguage()
  const { items } = useMenuItems()
  const { get } = useHomeText()
  const { order, addItem, removeItem } = useCart()

  // Starred dishes from Admin → Menu; ones with photos first.
  const featured = items
    .filter((m) => m.featured)
    .sort((a, b) => Number(!!b.images?.length) - Number(!!a.images?.length))
    .slice(0, 6)

  if (featured.length === 0) return null

  return (
    <section id="favourites" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <Watermark section="favourites" />
      <div ref={ref} className="reveal relative z-[1] mx-auto max-w-6xl px-6">
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-gold">
            {t("favouritesEyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-6xl">{get("favouritesTitle", lang) || t("favouritesTitle")}</h2>
        </div>

        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => {
            const name = lang === "ar" && item.nameAr ? item.nameAr : item.name
            const other = lang === "ar" ? item.name : item.nameAr
            const photo = item.images?.[0]
            return (
              <article key={item.id} className="flex flex-col gap-4 text-center">
                <div className="arch aspect-[4/5] overflow-hidden border border-foreground/10 bg-white">
                  {photo ? (
                    <img
                      src={optimizedImage(photo, 700)}
                      alt={name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-sand font-display text-7xl text-teal/30">
                      {name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-2xl">{name}</h3>
                  {other && (
                    <p
                      dir={lang === "ar" ? "ltr" : "rtl"}
                      className={`${lang === "ar" ? "font-body text-base" : "font-arabic text-lg"} text-foreground/60`}
                    >
                      {other}
                    </p>
                  )}
                  <p className="mt-1.5 font-body text-base font-bold text-gold">{item.price} SAR</p>
                </div>
                <div className="flex justify-center">
                  {order[item.name] ? (
                    <div className="flex items-center gap-3 rounded-full border border-teal bg-white p-1">
                      <button
                        onClick={() => removeItem(item.name)}
                        aria-label={`Remove one ${name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-teal hover:bg-teal/10"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-[1.5rem] text-center font-body text-base font-bold" aria-live="polite">
                        {order[item.name]}
                      </span>
                      <button
                        onClick={() => addItem(item.name)}
                        aria-label={`Add one more ${name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron text-ink hover:bg-[hsl(36_80%_63%)]"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addItem(item.name)}
                      className="flex items-center gap-2 rounded-full border border-teal px-5 py-2.5 font-body text-sm font-bold text-teal transition-colors hover:bg-teal hover:text-cream"
                    >
                      <Plus size={16} /> {t("addToOrder")}
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/menu"
            className="inline-block rounded-md bg-teal px-8 py-3.5 font-body text-base font-bold text-cream transition-colors hover:bg-[hsl(182_69%_24%)]"
          >
            {t("seeFullMenu")}
          </Link>
        </div>
      </div>
    </section>
  )
}
