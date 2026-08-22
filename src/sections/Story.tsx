import { useReveal } from "@/hooks/useReveal"

export default function Story() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div
        ref={ref}
        className="reveal max-w-4xl mx-auto px-6 text-center"
      >
        <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-5">
          Our Story
        </p>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-8">
          Every dish carries a
          <span className="text-brown italic"> household recipe</span>
        </h2>
        <p className="font-body text-foreground/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Mairaj began as a single kitchen and a belief that good food
          shouldn't be rushed. Our spices are ground fresh each morning, our
          bread comes straight from the tandoor, and our curries simmer for
          as long as they need to &mdash; not a minute less. Today, two
          branches in Madinah carry that same kitchen forward, dish by dish,
          for guests who know the difference.
        </p>

        <div className="grid grid-cols-3 gap-6 md:gap-12 mt-16 max-w-xl mx-auto">
          {[
            { value: "2", label: "Branches in Madinah" },
            { value: "40+", label: "Signature Dishes" },
            { value: "Fresh", label: "Ground Daily" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl md:text-4xl text-gold">
                {stat.value}
              </div>
              <div className="font-body text-[0.65rem] tracking-widest uppercase text-foreground/50 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
