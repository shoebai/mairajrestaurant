import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router"
import { Menu, X } from "lucide-react"
import logo from "@/assets/mairaj-logo.jpeg"

const links = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-sm border-b border-gold/20 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Mairaj Restaurant"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover shrink-0"
          />
          <span className="font-display text-2xl md:text-3xl tracking-wide text-foreground">
            Mairaj
            <span className="block text-[0.6rem] font-body tracking-mega text-gold uppercase mt-0.5">
              Restaurant &middot; Madinah
            </span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative font-body text-sm tracking-widest uppercase pb-1 ${
                location.pathname === link.to
                  ? "text-gold"
                  : "text-foreground/80 hover:text-gold"
              } transition-colors`}
            >
              {link.label}
              {location.pathname === link.to && (
                <span className="absolute left-0 right-0 -bottom-0.5 border-b border-dotted border-gold" />
              )}
            </Link>
          ))}
          <a
            href="#reservation"
            className="border border-gold text-gold hover:bg-gold hover:text-cream transition-colors px-5 py-2 text-xs tracking-mega uppercase font-body"
          >
            Reserve
          </a>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-cream border-t border-gold/20 mt-3 px-6 py-6 flex flex-col gap-5">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-body text-sm tracking-widest uppercase text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#reservation"
            className="border border-gold text-gold text-center px-5 py-2 text-xs tracking-mega uppercase font-body"
          >
            Reserve
          </a>
        </div>
      )}
    </header>
  )
}
