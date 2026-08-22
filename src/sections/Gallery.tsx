import { useReveal } from "@/hooks/useReveal"

// Swap each `tone` for a real photo: replace the <div> below with
// <img src={yourImage} className="w-full h-full object-cover" />
const tiles = [
  { label: "Tandoor, fired fresh", tone: "from-brown/40 to-brown/10" },
  { label: "Biryani, layer by layer", tone: "from-gold/40 to-gold/10" },
  { label: "Spice, ground each morning", tone: "from-brown/30 to-gold/20" },
  { label: "The dining room", tone: "from-gold/20 to-brown/30" },
  { label: "Bread, straight from the fire", tone: "from-brown/40 to-gold/10" },
  { label: "Slow-cooked curry", tone: "from-gold/30 to-brown/20" },
]

export default function Gallery() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            Inside Mairaj
          </p>
          <h2 className="font-display text-4xl md:text-5xl">
            A glimpse of the kitchen
          </h2>
        </div>

        <div
          ref={ref}
          className="reveal grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {tiles.map((tile, i) => (
            <div
              key={tile.label}
              className={`relative aspect-square overflow-hidden bg-gradient-to-br ${
                tile.tone
              } flex items-end p-4 group ${i === 0 ? "md:col-span-2 md:aspect-auto md:row-span-2" : ""}`}
            >
              <span className="font-display text-foreground/70 text-sm md:text-base italic">
                {tile.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
