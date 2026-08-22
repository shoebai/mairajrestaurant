import hero from '@/assets/hero.jpg'
import chef from '@/assets/chef.jpg'
import scallops from '@/assets/dish-scallops.jpg'
import wagyu from '@/assets/dish-wagyu.jpg'
import dessert from '@/assets/dish-dessert.jpg'

const tiles = [
  { img: hero, label: 'The Dining Room', span: 'sm:col-span-2 sm:row-span-2' },
  { img: chef, label: 'From the Kitchen', span: '' },
  { img: wagyu, label: 'Signature Grill', span: '' },
  { img: scallops, label: 'House Special', span: '' },
  { img: dessert, label: 'Sweet Finish', span: '' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      <div className="reveal mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-4 text-xs uppercase tracking-mega text-gold">Gallery</p>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground">
            Moments from <span className="italic text-brown">Mairaj</span>
          </h2>
        </div>
        <p className="max-w-sm font-light text-foreground/70">
          Smoke from the tandoor, fresh naan, and plates full of colour — a
          look inside an evening at Mairaj. Guest photos coming soon.
        </p>
      </div>

      <div className="reveal grid auto-rows-[240px] grid-cols-1 gap-4 sm:grid-cols-3 lg:auto-rows-[280px]">
        {tiles.map((t) => (
          <figure key={t.label} className={`group relative overflow-hidden ${t.span}`}>
            <img
              src={t.img}
              alt={t.label}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-background/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <figcaption className="absolute bottom-0 left-0 translate-y-3 p-5 text-xs uppercase tracking-[0.22em] text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="border-l-2 border-gold pl-3">{t.label}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}