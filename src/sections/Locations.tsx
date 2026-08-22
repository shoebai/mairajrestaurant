import { MapPin, Phone, Clock } from "lucide-react"
import { useReveal } from "@/hooks/useReveal"

// Replace mapUrl with each branch's real Google Maps share link,
// and phone/hours with your real details.
const branches = [
  {
    name: "Shohada Street",
    address: "Shohada Street, Madinah, Saudi Arabia",
    phone: "+966 XX XXX XXXX",
    hours: "Daily · 1:00 PM – 12:00 AM",
    mapUrl: "https://maps.google.com",
  },
  {
    name: "Malik Abdulaziz Road",
    address: "Malik Abdulaziz Road, beside the petrol station, Madinah",
    phone: "+966 XX XXX XXXX",
    hours: "Daily · 1:00 PM – 12:00 AM",
    mapUrl: "https://maps.google.com",
  },
]

export default function Locations() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="py-24 md:py-32 bg-foreground text-cream">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            Find Us
          </p>
          <h2 className="font-display text-4xl md:text-5xl">Two branches, one kitchen</h2>
        </div>

        <div ref={ref} className="reveal grid md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.name}
              className="border border-cream/15 p-8 hover:border-gold/50 transition-colors"
            >
              <h3 className="font-display text-2xl text-gold mb-5">
                {branch.name}
              </h3>
              <div className="flex flex-col gap-3 font-body text-sm text-cream/70">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="shrink-0 mt-0.5 text-gold" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-gold" />
                  <span>{branch.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="shrink-0 text-gold" />
                  <span>{branch.hours}</span>
                </div>
              </div>
              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 text-xs tracking-mega uppercase font-body border-b border-dotted border-gold text-gold pb-1"
              >
                Open in Google Maps
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
