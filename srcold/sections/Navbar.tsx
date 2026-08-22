import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu as MenuIcon, X } from 'lucide-react'
import logo from '@/assets/logo.jpg'

const links = [
  { label: 'Home', href: '/', type: 'route' },
  { label: 'Our Story', href: '#story', type: 'hash' },
  { label: 'Menu', href: '/menu', type: 'route' },
  { label: 'Gallery', href: '#gallery', type: 'hash' },
  { label: 'Locations', href: '#locations', type: 'hash' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = location.pathname === '/'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border/60 py-2.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Mairaj Restaurant logo"
            className="h-11 w-11 rounded-full border border-gold/50 object-cover"
          />
          <span className="font-display text-2xl tracking-wide text-foreground">
            Mairaj <span className="text-gold italic">Restaurant</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) =>
            l.type === 'route' ? (
              <Link
                key={l.label}
                to={l.href}
                className="text-xs uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={isHome ? l.href : `/${l.href}`}
                className="text-xs uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            )
          )}
          <a
            href={isHome ? '#reservations' : '/#reservations'}
            className="border border-gold px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-gold transition-all hover:bg-gold hover:text-cream"
          >
            Reserve a Table
          </a>
        </nav>

        <button
          className="text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-5 border-t border-border/60 bg-background/95 px-6 py-6 backdrop-blur-md md:hidden">
          {links.map((l) =>
            l.type === 'route' ? (
              <Link
                key={l.label}
                to={l.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.22em] text-foreground/80"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={isHome ? l.href : `/${l.href}`}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.22em] text-foreground/80"
              >
                {l.label}
              </a>
            )
          )}
          <a
            href={isHome ? '#reservations' : '/#reservations'}
            onClick={() => setOpen(false)}
            className="border border-gold px-5 py-3 text-center text-xs uppercase tracking-[0.22em] text-gold"
          >
            Reserve a Table
          </a>
        </nav>
      )}
    </header>
  )
}