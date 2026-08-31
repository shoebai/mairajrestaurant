import { useReveal } from "@/hooks/useReveal"
import { useT, useLanguage } from "@/lib/i18n"
import { useOffers } from "@/lib/firestoreOffers"

export default function Offers() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { lang } = useLanguage()
  const { offers, loading } = useOffers(true)

  if (!loading && offers.length === 0) return null

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            {t("offersEyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl">{t("offersTitle")}</h2>
        </div>

        <div ref={ref} className="reveal grid md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="border border-foreground/10 hover:border-gold transition-colors overflow-hidden"
            >
              {offer.image && (
                <div className="aspect-video overflow-hidden">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-xl mb-2">
                  {lang === "ar" && offer.titleAr ? offer.titleAr : offer.title}
                </h3>
                {offer.desc && (
                  <p className="font-body text-foreground/60 text-sm mb-3">
                    {lang === "ar" && offer.descAr ? offer.descAr : offer.desc}
                  </p>
                )}
                {offer.priceText && (
                  <p className="font-display text-gold text-lg">{offer.priceText}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
