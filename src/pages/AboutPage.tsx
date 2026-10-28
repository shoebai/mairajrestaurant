import { MapPin, Phone, Clock } from "lucide-react"
import Navbar from "@/sections/Navbar"
import { usePageMeta, PAGE_META } from "@/hooks/usePageMeta"
import Footer from "@/sections/Footer"
import { useT, useLanguage } from "@/lib/i18n"
import { useAbout } from "@/lib/firestoreAbout"

export default function AboutPage() {
  usePageMeta("/about", PAGE_META.about)
  const t = useT()
  const { lang } = useLanguage()
  const { about, loading } = useAbout()

  const pick = (en: string, ar?: string) => (lang === "ar" && ar ? ar : en)

  const sections = [
    { title: t("aboutStoryTitle"), text: pick(about.story, about.storyAr) },
    { title: t("aboutServicesTitle"), text: pick(about.services, about.servicesAr) },
    { title: t("aboutStaffTitle"), text: pick(about.staff, about.staffAr) },
    { title: t("aboutCateringTitle"), text: pick(about.catering, about.cateringAr) },
  ].filter((s) => s.text?.trim())

  return (
    <>
      <Navbar />

      <header className="bg-teal pt-24 text-cream md:pt-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 pb-14 pt-10 md:pb-16">
          <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-saffron">{t("aboutEyebrow")}</p>
          <h1 className="font-display text-5xl md:text-7xl">{t("aboutTitle")}</h1>
        </div>
      </header>

      <main className="bg-cream min-h-screen pt-16 pb-24">
        <div className="max-w-3xl mx-auto px-6">

          {loading && (
            <p className="text-center font-body text-foreground/50">Loading...</p>
          )}

          {!loading && sections.length === 0 && !about.location && (
            <p className="text-center font-body text-foreground/50">
              This page is being set up — check back soon.
            </p>
          )}

          <div className="flex flex-col gap-14">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-2xl text-brown mb-4">{section.title}</h2>
                <p className="font-body text-foreground/70 leading-relaxed whitespace-pre-line">
                  {section.text}
                </p>
              </div>
            ))}

            {(about.location || about.phone || about.email || about.hours) && (
              <div>
                <h2 className="font-display text-2xl text-brown mb-4">
                  {t("aboutLocationTitle")}
                </h2>
                <div className="flex flex-col gap-3 font-body text-foreground/70">
                  {about.location && (
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="shrink-0 mt-0.5 text-gold" />
                      <span>{pick(about.location, about.locationAr)}</span>
                    </div>
                  )}
                  {about.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="shrink-0 text-gold" />
                      <span dir="ltr">{about.phone}</span>
                    </div>
                  )}
                  {about.hours && (
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="shrink-0 text-gold" />
                      <span>{about.hours}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
