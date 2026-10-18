import { useT } from "@/lib/i18n"
import { RESTAURANT_PHONE_DISPLAY, RESTAURANT_WHATSAPP } from "@/lib/config"

export default function InfoStrip() {
  const t = useT()
  const items = [
    { title: t("infoEveryDay"), body: <span>{t("infoHours")}</span> },
    {
      title: t("infoCallWhatsApp"),
      body: (
        <a href={`tel:+${RESTAURANT_WHATSAPP}`} dir="ltr" className="hover:text-gold">
          {RESTAURANT_PHONE_DISPLAY}
        </a>
      ),
    },
    { title: t("infoDineIn"), body: <span>{t("infoFamilies")}</span> },
  ]

  return (
    <section className="border-b border-foreground/10 bg-cream">
      <div className="mx-auto grid max-w-6xl gap-5 px-6 py-7 text-center sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="font-body text-base text-foreground/80">
            <p className="font-display text-xl text-teal">{item.title}</p>
            {item.body}
          </div>
        ))}
      </div>
    </section>
  )
}
