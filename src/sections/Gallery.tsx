import { useEffect, useState } from "react"
import { useReveal } from "@/hooks/useReveal"
import { useT, useLanguage } from "@/lib/i18n"
import { getDishImages, getGalleryImages } from "@/lib/images"

// `folder: "dishes"` reuses a menu item's photos (matched by slug).
// `folder: "gallery"` looks in src/assets/gallery/ instead — drop photos
// named to match the slug (e.g. "tandoor.jpg", "tandoor-1.jpg", "tandoor-2.jpg")
// and they'll appear and auto-slide here with zero code changes.
const tiles = [
  {
    key: "tile1",
    en: "Tandoor, fired fresh",
    ar: "تندور، مشتعل طازج",
    descEn: "Our clay tandoor stays lit from open to close, giving every naan and kebab its char.",
    descAr: "يبقى تندورنا الطيني مشتعلاً طوال ساعات العمل، ليمنح كل نان وكباب نكهته المميزة.",
    tone: "from-brown/40 to-brown/10",
    folder: "gallery" as const,
    slug: "tandoor",
  },
  {
    key: "biryani1",
    en: "Chicken Biryani",
    ar: "برياني دجاج",
    descEn: "Long-grain basmati, slow-dum cooked with chicken and saffron.",
    descAr: "أرز بسمتي طويل الحبة مطهو مع الدجاج والزعفران.",
    folder: "dishes" as const,
    slug: "chicken-biryani",
  },
  {
    key: "tile3",
    en: "Spice, ground each morning",
    ar: "توابل، تُطحن كل صباح",
    descEn: "Whole spices are roasted and ground in-house before service begins each day.",
    descAr: "تُحمّص التوابل الكاملة وتُطحن في المطعم قبل بدء كل يوم عمل.",
    tone: "from-brown/30 to-gold/20",
    folder: "gallery" as const,
    slug: "spices",
  },
  {
    key: "butterchicken",
    en: "Chicken Makhan Wala",
    ar: "تشيكن مكهن والا",
    descEn: "Tandoor-grilled chicken simmered in a velvet tomato-butter gravy.",
    descAr: "دجاج مشوي بالتندور مطهو في صلصة الطماطم والزبدة.",
    folder: "dishes" as const,
    slug: "butter-chicken",
  },
  {
    key: "muttonbiryani",
    en: "Mutton Biryani",
    ar: "برياني لحم",
    descEn: "Fragrant basmati layered with tender mutton, dum-sealed.",
    descAr: "أرز بسمتي عطر مع طبقات من لحم الضأن الطري.",
    folder: "dishes" as const,
    slug: "mutton-biryani",
  },
  {
    key: "prawns",
    en: "Prawns Zabardast",
    ar: "برونز زبردست",
    descEn: "Prawns simmered in a rich, spiced gravy.",
    descAr: "روبيان مطهو في صلصة غنية ومتبلة.",
    folder: "dishes" as const,
    slug: "prawns-zabardast",
  },
  {
    key: "tile4",
    en: "The dining room",
    ar: "صالة الطعام",
    descEn: "A warm, unhurried space to sit down with family and friends.",
    descAr: "مكان دافئ وهادئ للجلوس مع العائلة والأصدقاء.",
    tone: "from-gold/20 to-brown/30",
    folder: "gallery" as const,
    slug: "dining-room",
  },
  {
    key: "tile5",
    en: "Bread, straight from the fire",
    ar: "خبز، مباشرة من النار",
    descEn: "Naan and roti made fresh to order, never pre-baked.",
    descAr: "نان وروتي يُحضّران طازجَين عند الطلب، لا يُخبزان مسبقاً.",
    tone: "from-brown/40 to-gold/10",
    folder: "gallery" as const,
    slug: "bread",
  },
]

const SLIDE_INTERVAL = 3500

function GalleryTile({ tile, large }: { tile: (typeof tiles)[number]; large: boolean }) {
  const { lang } = useLanguage()
  const images =
    tile.folder === "dishes" ? getDishImages(tile.slug) : getGalleryImages(tile.slug)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(id)
  }, [images.length])

  const hasImages = images.length > 0

  return (
    <div
      className={`relative aspect-square overflow-hidden group ${
        hasImages ? "" : `bg-gradient-to-br ${tile.tone}`
      } ${large ? "md:col-span-2 md:aspect-auto md:row-span-2" : ""}`}
    >
      {hasImages &&
        images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={lang === "ar" ? tile.ar : tile.en}
            className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
            style={{ opacity: i === active ? 1 : 0, transitionDuration: "1200ms" }}
          />
        ))}

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 ${
          hasImages ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <span
          className={`font-display text-sm md:text-base italic transition-colors duration-300 block ${
            hasImages ? "text-cream" : "text-foreground/70 group-hover:text-cream"
          }`}
        >
          {lang === "ar" ? tile.ar : tile.en}
        </span>
        <span
          className={`font-body text-xs mt-1 block overflow-hidden transition-all duration-300 ${
            hasImages
              ? "text-cream/80 max-h-16"
              : "text-foreground/0 group-hover:text-cream/80 max-h-0 group-hover:max-h-16"
          }`}
        >
          {lang === "ar" ? tile.descAr : tile.descEn}
        </span>
      </div>

      {images.length > 1 && (
        <div className="absolute top-3 right-3 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? "w-4 bg-gold" : "w-1 bg-cream/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Gallery() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()

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
            <GalleryTile key={tile.key} tile={tile} large={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
