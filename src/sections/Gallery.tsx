import { useReveal } from "@/hooks/useReveal"
import { useT, useLanguage } from "@/lib/i18n"

// Add `img` (an imported photo) to any tile once you have real photos —
// e.g. img: tandoorImg (import tandoorImg from "@/assets/gallery/tandoor.jpg")
const tiles = [
  {
    key: "tile1",
    en: "Tandoor, fired fresh",
    ar: "تندور، مشتعل طازج",
    descEn: "Our clay tandoor stays lit from open to close, giving every naan and kebab its char.",
    descAr: "يبقى تندورنا الطيني مشتعلاً طوال ساعات العمل، ليمنح كل نان وكباب نكهته المميزة.",
    tone: "from-brown/40 to-brown/10",
  },
  {
    key: "tile2",
    en: "Biryani, layer by layer",
    ar: "برياني، طبقة بعد طبقة",
    descEn: "Rice, meat, and saffron sealed and slow-cooked the traditional dum way.",
    descAr: "أرز ولحم وزعفران مطهو ببطء بالطريقة التقليدية.",
    tone: "from-gold/40 to-gold/10",
  },
  {
    key: "tile3",
    en: "Spice, ground each morning",
    ar: "توابل، تُطحن كل صباح",
    descEn: "Whole spices are roasted and ground in-house before service begins each day.",
    descAr: "تُحمّص التوابل الكاملة وتُطحن في المطعم قبل بدء كل يوم عمل.",
    tone: "from-brown/30 to-gold/20",
  },
  {
    key: "tile4",
    en: "The dining room",
    ar: "صالة الطعام",
    descEn: "A warm, unhurried space to sit down with family and friends.",
    descAr: "مكان دافئ وهادئ للجلوس مع العائلة والأصدقاء.",
    tone: "from-gold/20 to-brown/30",
  },
  {
    key: "tile5",
    en: "Bread, straight from the fire",
    ar: "خبز، مباشرة من النار",
    descEn: "Naan and roti made fresh to order, never pre-baked.",
    descAr: "نان وروتي يُحضّران طازجَين عند الطلب، لا يُخبزان مسبقاً.",
    tone: "from-brown/40 to-gold/10",
  },
  {
    key: "tile6",
    en: "Slow-cooked curry",
    ar: "كاري مطهو ببطء",
    descEn: "Every gravy simmers for hours — no shortcuts, no rushing.",
    descAr: "كل صلصة تُطهى ببطء لساعات — دون اختصارات أو استعجال.",
    tone: "from-gold/30 to-brown/20",
  },
]

export default function Gallery() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { lang } = useLanguage()

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-6">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            {t("galleryEyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">{t("galleryTitle")}</h2>
          <p className="font-body text-foreground/60 text-sm max-w-md mx-auto">
            {t("galleryIntro")}
          </p>
        </div>

        <div ref={ref} className="reveal grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-10">
          {tiles.map((tile, i) => (
            <div
              key={tile.key}
              className={`relative aspect-square overflow-hidden bg-gradient-to-br ${tile.tone} group ${
                i === 0 ? "md:col-span-2 md:aspect-auto md:row-span-2" : ""
              }`}
            >
              {/* Bottom gradient so text stays readable once real photos are added */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="font-display text-foreground/70 group-hover:text-cream text-sm md:text-base italic transition-colors duration-300 block">
                  {lang === "ar" ? tile.ar : tile.en}
                </span>
                <span className="font-body text-foreground/0 group-hover:text-cream/80 text-xs mt-1 block max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-300">
                  {lang === "ar" ? tile.descAr : tile.descEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
