import { MapPin, ExternalLink } from 'lucide-react'

const branches = [
  {
    name: 'Branch 1 — Shohada Street',
    ar: 'شارع الشهداء، المدينة المنورة',
    desc: 'Our original home since 2001, in the heart of Madinah.',
    map: 'https://maps.app.goo.gl/B8Vp6bm4QMyRTnou5',
  },
  {
    name: 'Branch 2 — King Abdulaziz Road',
    ar: 'طريق الملك عبدالعزيز، بجوار محطة الوقود',
    desc: 'Our second branch, on Malik Abdulaziz Road beside the petrol station.',
    map: 'https://maps.app.goo.gl/B8Vp6bm4QMyRTnou5',
  },
]

export default function Locations() {
  return (
    <section id="locations" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      <div className="reveal text-center">
        <p className="mb-4 text-xs uppercase tracking-mega text-gold">Find Us</p>
        <h2 className="font-display text-4xl sm:text-5xl text-foreground">
          Two Homes in <span className="italic text-brown">Madinah</span>
        </h2>
      </div>

      <div className="reveal mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        {branches.map((b) => (
          <div
            key={b.name}
            className="border border-border/70 bg-card/50 p-9 transition-colors hover:border-gold/50"
          >
            <MapPin className="mb-5 text-gold" size={26} strokeWidth={1.5} />
            <h3 className="font-display text-2xl text-foreground">{b.name}</h3>
            <p dir="rtl" className="mt-2 text-sm text-foreground/60">
              {b.ar}
            </p>
            <p className="mt-4 font-light leading-relaxed text-foreground/70">{b.desc}</p>
            <a
              href={b.map}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 border border-gold px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-cream"
            >
              Open in Google Maps <ExternalLink size={13} />
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}