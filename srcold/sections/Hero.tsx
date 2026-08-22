import hero from '@/assets/hero.jpg'
import logo from '@/assets/logo.jpg'

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <img
        src={hero}
        alt="Warm dining room at Mairaj Restaurant"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/55 to-background" />

      <div className="relative z-10 px-6 text-center">
        <img
          src={logo}
          alt="Mairaj logo"
          className="mx-auto mb-8 h-24 w-24 rounded-full border-2 border-gold/60 object-cover shadow-2xl shadow-black/50 sm:h-28 sm:w-28"
        />
        <p className="mb-5 text-xs uppercase tracking-mega text-gold">
          Since 2001 · Madinah, Saudi Arabia
        </p>
        <h1 className="font-display text-5xl leading-[1.05] sm:text-7xl lg:text-8xl text-foreground">
          Mairaj
          <br />
          <span className="italic text-gold">Indian Cuisine</span>
        </h1>
        <p dir="rtl" className="mt-6 font-display text-2xl text-foreground/85 sm:text-3xl">
          مطعم ميراج للمأكولات الهندية
        </p>
        <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-foreground/80 sm:text-lg">
          Authentic Indian flavours from the tandoor to the table — family
          recipes served with warm hospitality in the heart of Madinah, for
          over two decades.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#reservations"
            className="w-full bg-gold px-9 py-4 text-xs font-medium uppercase tracking-[0.22em] text-cream transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            Reserve a Table
          </a>
          <a
            href="#menu"
            className="w-full border border-foreground/30 px-9 py-4 text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:border-gold hover:text-gold sm:w-auto"
          >
            Explore the Menu
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="h-14 w-px animate-pulse bg-gradient-to-b from-transparent via-gold to-transparent" />
      </div>
    </section>
  )
}