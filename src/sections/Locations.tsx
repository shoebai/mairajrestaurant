import { MapPin, Phone, Clock } from "lucide-react"
import { useReveal } from "@/hooks/useReveal"
import { useT, useLanguage } from "@/lib/i18n"

const branches = [
  {
    key: "main",
    name: "Mairaj Restaurant — Since 2001",
    nameAr: "مطعم مائرج — منذ 2001",
    address: "Madinah, Saudi Arabia",
    addressAr: "المدينة المنورة، المملكة العربية السعودية",
    phone: "+966 58 074 8325",
    hours: "Daily · 1:00 PM – 12:00 AM",
    hoursAr: "يومياً · 1:00 ظهراً – 12:00 منتصف الليل",
    mapUrl: "https://maps.app.goo.gl/TC1TU7UGmo3D5pMu8",
    active: true,
  },
  {
    key: "second",
    name: "Second Branch",
    nameAr: "الفرع الثاني",
    active: false,
  },
]

export default function Locations() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { lang } = useLanguage()

  return (
    <section className="py-24 md:py-32 bg-foreground text-cream">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            {t("findUs")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl">{t("visitMairaj")}</h2>
        </div>

        <div ref={ref} className="reveal grid md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.key}
              className={`border p-8 transition-colors ${
                branch.active
                  ? "border-cream/15 hover:border-gold/50"
                  : "border-cream/10 opacity-60"
              }`}
            >
              <h3 className="font-display text-2xl text-gold mb-5">
                {lang === "ar" ? branch.nameAr : branch.name}
              </h3>

              {branch.active ? (
                <>
                  <div className="flex flex-col gap-3 font-body text-sm text-cream/70">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="shrink-0 mt-0.5 text-gold" />
                      <span>{lang === "ar" ? branch.addressAr : branch.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="shrink-0 text-gold" />
                      <span dir="ltr">{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="shrink-0 text-gold" />
                      <span>{lang === "ar" ? branch.hoursAr : branch.hours}</span>
                    </div>
                  </div>
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 text-xs tracking-mega uppercase font-body border-b border-dotted border-gold text-gold pb-1"
                  >
                    {t("openInMaps")}
                  </a>
                </>
              ) : (
                <p className="font-display italic text-cream/50 text-lg">
                  {t("openingSoon")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
