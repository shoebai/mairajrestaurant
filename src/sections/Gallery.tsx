import { useReveal } from "@/hooks/useReveal"
import { useT, useLanguage } from "@/lib/i18n"

const tiles = [
  { key: "tile1", en: "Tandoor, fired fresh", ar: "تندور، مشتعل طازج", tone: "from-brown/40 to-brown/10" },
  { key: "tile2", en: "Biryani, layer by layer", ar: "برياني، طبقة بعد طبقة", tone: "from-gold/40 to-gold/10" },
  { key: "tile3", en: "Spice, ground each morning", ar: "توابل، تُطحن كل صباح", tone: "from-brown/30 to-gold/20" },
  { key: "tile4", en: "The dining room", ar: "صالة الطعام", tone: "from-gold/20 to-brown/30" },
  { key: "tile5", en: "Bread, straight from the fire", ar: "خبز، مباشرة من النار", tone: "from-brown/40 to-gold/10" },
  { key: "tile6", en: "Slow-cooked curry", ar: "كاري مطهو ببطء", tone: "from-gold/30 to-brown/20" },
]

export default function Gallery() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { lang } = useLanguage()

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            {t("galleryEyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl">
            {t("galleryTitle")}
          </h2>
        </div>

        <div ref={ref} className="reveal grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {tiles.map((tile, i) => (
            <div
              key={tile.key}
              className={`relative aspect-square overflow-hidden bg-gradient-to-br ${tile.tone} flex items-end p-4 group ${
                i === 0 ? "md:col-span-2 md:aspect-auto md:row-span-2" : ""
              }`}
            >
              <span className="font-display text-foreground/70 text-sm md:text-base italic">
                {lang === "ar" ? tile.ar : tile.en}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
