import { useState } from "react"
import { useReveal } from "@/hooks/useReveal"
import { useT, useLanguage } from "@/lib/i18n"
import { RESTAURANT_WHATSAPP } from "@/lib/config"

export default function Reservation() {
  const ref = useReveal<HTMLDivElement>()
  const t = useT()
  const { lang } = useLanguage()
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    branch: "Mairaj Restaurant — Since 2001",
  })

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message =
      lang === "ar"
        ? `طلب حجز جديد
الاسم: ${form.name}
الجوال: ${form.phone}
الفرع: ${form.branch}
التاريخ: ${form.date}
الوقت: ${form.time}
عدد الضيوف: ${form.guests}`
        : `New Reservation Request
Name: ${form.name}
Phone: ${form.phone}
Branch: ${form.branch}
Date: ${form.date}
Time: ${form.time}
Guests: ${form.guests}`

    const url = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <section id="reservation" className="py-24 md:py-32 bg-cream">
      <div ref={ref} className="reveal max-w-xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            {t("reserveEyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">{t("reserveTitle")}</h2>
          <p className="font-body text-foreground/60 text-sm">{t("reserveSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="font-body text-xs tracking-widest uppercase text-foreground/50">
                {t("fullName")}
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={update("name")}
                className="w-full mt-2 bg-transparent border-b border-foreground/20 focus:border-gold outline-none py-2 font-body"
              />
            </div>

            <div className="col-span-2">
              <label className="font-body text-xs tracking-widest uppercase text-foreground/50">
                {t("phoneNumber")}
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                placeholder="+966 5X XXX XXXX"
                dir="ltr"
                className="w-full mt-2 bg-transparent border-b border-foreground/20 focus:border-gold outline-none py-2 font-body"
              />
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-foreground/50">
                {t("date")}
              </label>
              <input
                required
                type="date"
                value={form.date}
                onChange={update("date")}
                className="w-full mt-2 bg-transparent border-b border-foreground/20 focus:border-gold outline-none py-2 font-body"
              />
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-foreground/50">
                {t("time")}
              </label>
              <input
                required
                type="time"
                value={form.time}
                onChange={update("time")}
                className="w-full mt-2 bg-transparent border-b border-foreground/20 focus:border-gold outline-none py-2 font-body"
              />
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-foreground/50">
                {t("guests")}
              </label>
              <select
                value={form.guests}
                onChange={update("guests")}
                className="w-full mt-2 bg-transparent border-b border-foreground/20 focus:border-gold outline-none py-2 font-body"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {t("guest")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-foreground/50">
                {t("branch")}
              </label>
              <select
                value={form.branch}
                onChange={update("branch")}
                className="w-full mt-2 bg-transparent border-b border-foreground/20 focus:border-gold outline-none py-2 font-body"
              >
                <option>Mairaj Restaurant — Since 2001</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-gold text-cream py-3 text-xs tracking-mega uppercase font-body hover:bg-gold/90 transition-colors"
          >
            {t("sendViaWhatsApp")}
          </button>
        </form>
      </div>
    </section>
  )
}
