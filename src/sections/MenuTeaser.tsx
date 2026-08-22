import { Link } from "react-router"
import { useReveal } from "@/hooks/useReveal"
import { menu } from "@/lib/menuData"

export default function MenuTeaser() {
  const ref = useReveal<HTMLDivElement>()
  const featured = menu.filter((m) => m.featured)

  return (
    <section className="py-24 md:py-32 bg-foreground text-cream">
      <div ref={ref} className="reveal max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
            From the Kitchen
          </p>
          <h2 className="font-display text-4xl md:text-5xl">
            A few house favourites
          </h2>
        </div>

        <div className="flex flex-col gap-7">
          {featured.map((item) => (
            <div key={item.name} className="flex items-baseline">
              <div>
                <h3 className="font-display text-xl md:text-2xl text-cream">
                  {item.name}
                </h3>
                <p className="font-body text-cream/50 text-sm mt-1">
                  {item.desc}
                </p>
              </div>
              <span className="menu-dots" />
              <span className="font-display text-lg text-gold shrink-0">
                {item.price}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            to="/menu"
            className="inline-block border border-gold text-gold px-8 py-3 text-xs tracking-mega uppercase font-body hover:bg-gold hover:text-cream transition-colors"
          >
            See Full Menu
          </Link>
        </div>
      </div>
    </section>
  )
}
