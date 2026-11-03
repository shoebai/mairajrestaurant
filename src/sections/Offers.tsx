import { useState } from "react"
import { useReveal } from "@/hooks/useReveal"
import { useT, useLanguage } from "@/lib/i18n"
import { useOffers, type Offer } from "@/lib/firestoreOffers"
import { useOffersDisplay } from "@/lib/firestoreSite"
import { optimizedImage } from "@/lib/storage"
import { useImageTones, type ImageTone } from "@/hooks/useImageTone"
import BlendImage from "@/components/BlendImage"

// Seconds each card takes to cross its own width.
const SECONDS_PER_CARD = { slow: 9, medium: 6, fast: 3.5 }

function OfferCard({
  offer,
  tone,
  className = "",
  copy = false,
}: {
  offer: Offer
  tone?: ImageTone
  className?: string
  /** A repeated copy in the sliding banner: hidden from screen readers. */
  copy?: boolean
}) {
  const { lang } = useLanguage()
  const ar = lang === "ar"
  return (
    <article
      dir={ar ? "rtl" : "ltr"}
      aria-hidden={copy || undefined}
      className={`overflow-hidden rounded-lg border border-foreground/10 bg-white transition-colors hover:border-gold ${className}`}
    >
      {offer.image && (
        <BlendImage
          src={optimizedImage(offer.image, 900)}
          alt={ar && offer.titleAr ? offer.titleAr : offer.title}
          tone={tone}
          frameClass="aspect-video overflow-hidden"
          lightBg="bg-white"
          padding="p-3"
        />
      )}
      <div className="p-6">
        <h3 className="mb-2 font-display text-xl">{ar && offer.titleAr ? offer.titleAr : offer.title}</h3>
        {offer.desc && (
          <p className="mb-3 font-body text-sm text-foreground/60">{ar && offer.descAr ? offer.descAr : offer.desc}</p>
        )}
        {offer.priceText && <p className="font-display text-lg text-gold">{offer.priceText}</p>}
      </div>
    </article>
  )
}

export default function Offers() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { offers, loading } = useOffers(true)
  const { display } = useOffersDisplay()
  const tones = useImageTones(offers.map((o) => o.image).filter((u): u is string => !!u))
  const [paused, setPaused] = useState(false)

  if (!loading && offers.length === 0) return null

  // Repeat short lists so the banner is always wider than the screen, then
  // double it for a seamless loop.
  const base: Offer[] = []
  while (offers.length && base.length < 6) base.push(...offers)
  const track = [...base, ...base]
  const duration = base.length * SECONDS_PER_CARD[display.speed]

  return (
    <section id="offers" className="overflow-hidden bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 font-body text-[0.65rem] uppercase tracking-mega text-gold">{t("offersEyebrow")}</p>
          <h2 className="font-display text-4xl md:text-5xl">{t("offersTitle")}</h2>
        </div>

        {display.layout === "cards" && (
          <div ref={ref} className="reveal grid gap-6 md:grid-cols-3">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} tone={offer.image ? tones[offer.image] : undefined} />
            ))}
          </div>
        )}
      </div>

      {display.layout === "banner" && offers.length > 0 && (
        // Always laid out left-to-right so the loop works in Arabic too;
        // each card still shows its own text in the right direction.
        <div
          dir="ltr"
          className="offers-marquee-wrap"
          data-paused={paused}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          onTouchCancel={() => setPaused(false)}
        >
          <div
            className="offers-marquee flex w-max gap-6 py-2"
            data-direction={display.direction}
            style={{ ["--marquee-duration" as string]: `${duration}s` }}
          >
            {track.map((offer, i) => (
              <OfferCard
                key={`${offer.id}-${i}`}
                offer={offer}
                tone={offer.image ? tones[offer.image] : undefined}
                className="w-[78vw] max-w-[340px] shrink-0"
                copy={i >= offers.length}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
