import chef from '@/assets/chef.jpg'

const stats = [
  { value: '2001', label: 'Serving Madinah since' },
  { value: '2', label: 'Branches across the city' },
  { value: '25+', label: 'Years of family recipes' },
  { value: '14', label: 'Menu categories, grill to dessert' },
]

export default function Story() {
  return (
    <section id="story" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="reveal relative">
          <div className="absolute -left-4 -top-4 h-full w-full border border-gold/40" />
          <img
            src={chef}
            alt="Chef preparing dishes at Mairaj Restaurant"
            className="relative w-full object-cover"
          />
        </div>

        <div className="reveal">
          <p className="mb-4 text-xs uppercase tracking-mega text-gold">Our Story</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl text-foreground">
            From our tandoor,
            <br />
            <span className="italic text-brown">to Madinah's table</span>
          </h2>
          <p className="mt-8 font-light leading-relaxed text-foreground/75">
            Mairaj opened its doors in 2001 with a simple promise: honest Indian
            cooking, generous portions, and the warmth of a family table. From
            slow-cooked curries and fragrant biryanis to breads pulled fresh
            from the tandoor, every dish follows recipes handed down through
            our family.
          </p>
          <p className="mt-5 font-light leading-relaxed text-foreground/75">
            Today, two branches — on Shohada Street and on King Abdulaziz Road —
            welcome families, travellers, and pilgrims alike, just minutes from
            the heart of the city.
          </p>
          <p dir="rtl" className="mt-5 font-light leading-relaxed text-foreground/60">
            منذ عام ٢٠٠١ ونحن نقدم أشهى المأكولات الهندية الأصيلة في المدينة المنورة.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10">
            {stats.map((s) => (
              <div key={s.label} className="border-l border-gold/40 pl-5">
                <div className="font-display text-3xl text-gold">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}