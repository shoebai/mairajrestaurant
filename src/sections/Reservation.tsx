import { useState } from "react"
import { useReveal } from "@/hooks/useReveal"

// Replace with your real WhatsApp number: country code, digits only, no + or spaces.
const RESTAURANT_WHATSAPP = "9665XXXXXXXX"

export default function Reservation() {
  const ref = useReveal<HTMLDivElement>()
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    branch: "Shohada Street",
  })

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = `New Reservation Request
Name: ${form.name}
Phone: ${form.phone}
Branch: ${form.branch}
Date: ${form.date}
Time: ${form.time}
Guests: ${form.guests}`

    const url = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(
      message
    )}`
    window.open(url, "_blank")
  }

  return (
    <section id="reservation" className="py-24 md:py-32 bg-cream">
      <div ref={ref} className="reveal max-w-xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            Reserve a Table
          </p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            We'll save your seat
          </h2>
          <p className="font-body text-foreground/60 text-sm">
            Fill in your details below &mdash; it opens WhatsApp with your
            request ready to send.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="font-body text-xs tracking-widest uppercase text-foreground/50">
                Full Name
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
                Phone Number
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                placeholder="+966 5X XXX XXXX"
                className="w-full mt-2 bg-transparent border-b border-foreground/20 focus:border-gold outline-none py-2 font-body"
              />
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-foreground/50">
                Date
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
                Time
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
                Guests
              </label>
              <select
                value={form.guests}
                onChange={update("guests")}
                className="w-full mt-2 bg-transparent border-b border-foreground/20 focus:border-gold outline-none py-2 font-body"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-foreground/50">
                Branch
              </label>
              <select
                value={form.branch}
                onChange={update("branch")}
                className="w-full mt-2 bg-transparent border-b border-foreground/20 focus:border-gold outline-none py-2 font-body"
              >
                <option>Shohada Street</option>
                <option>Malik Abdulaziz Road</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-gold text-cream py-3 text-xs tracking-mega uppercase font-body hover:bg-gold/90 transition-colors"
          >
            Send via WhatsApp
          </button>
        </form>
      </div>
    </section>
  )
}
