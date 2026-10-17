import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router"
import { X, Phone, MapPin, MessageCircle } from "lucide-react"
import logo from "@/assets/mairaj-logo.jpeg"
import { useT, useLanguage } from "@/lib/i18n"
import { RESTAURANT_WHATSAPP, RESTAURANT_MAP_URL } from "@/lib/config"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const t = useT()
  const { lang, toggleLang } = useLanguage()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const links = [
    { label: t("navHome"), to: "/" },
    { label: t("navMenu"), to: "/menu" },
    { label: t("navFindUs"), to: "/#location" },
    { label: t("navAbout"), to: "/about" },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the phone menu whenever the page or section changes.
  useEffect(() => setOpen(false), [location.pathname, location.hash])

  // While the phone menu is open: lock page scroll, close on Escape.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    firstLinkRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  // Only the homepage has a photo behind the bar; elsewhere it is always solid.
  const overPhoto = location.pathname === "/" && !scrolled && !open

  const isActive = (to: string) => {
    if (to.includes("#")) return location.pathname === "/" && location.hash === to.slice(1)
    return location.pathname === to && !(to === "/" && location.hash)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-300 ${
          overPhoto
            ? "bg-gradient-to-b from-black/50 to-transparent py-5"
            : "bg-cream/95 py-3 shadow-[0_1px_0_hsl(42_50%_54%/0.25)] backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 md:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Mairaj Restaurant, home">
            <img
              src={logo}
              alt=""
              className={`rounded-full object-cover ring-1 ring-gold/50 transition-all duration-300 ${
                overPhoto ? "h-12 w-12" : "h-10 w-10"
              }`}
            />
            <span className="leading-none">
              <span
                className={`block font-display text-2xl transition-colors duration-300 md:text-[1.7rem] ${
                  overPhoto ? "text-cream" : "text-foreground"
                }`}
              >
                Mairaj
              </span>
              <span className="mt-1 block font-body text-[0.7rem] text-gold">{t("brandTagline")}</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const active = isActive(link.to)
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={`group relative block px-4 py-2 font-body text-[15px] transition-colors duration-300 ${
                      active
                        ? "text-gold"
                        : overPhoto
                          ? "text-cream/90 hover:text-cream"
                          : "text-foreground/75 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-4 -bottom-0.5 h-px origin-center bg-gold transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleLang}
              aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
              className={`rounded-full border px-3 py-1.5 font-body text-sm transition-colors duration-300 ${
                overPhoto
                  ? "border-cream/30 text-cream hover:border-gold hover:text-gold"
                  : "border-foreground/15 text-foreground/80 hover:border-gold hover:text-gold"
              }`}
            >
              {lang === "en" ? "عربي" : "EN"}
            </button>

            <Link
              to="/#reservation"
              className="hidden rounded-full bg-gold px-5 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-[hsl(42_50%_46%)] sm:inline-block"
            >
              {t("navReserveTable")}
            </Link>

            <button
              ref={toggleRef}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("navCloseMenu") : t("navOpenMenu")}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden ${
                overPhoto ? "text-cream hover:bg-white/10" : "text-foreground hover:bg-foreground/5"
              }`}
            >
              <span className="sr-only">{open ? t("navCloseMenu") : t("navOpenMenu")}</span>
              <span aria-hidden className="relative block h-3.5 w-5">
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1.5 h-0.5 rounded bg-current transition-all duration-300 ${open ? "w-0 opacity-0" : "w-3.5 rtl:left-auto rtl:right-0"}`} />
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Phone & tablet menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t("navMenu")}
        className={`fixed inset-0 z-[60] transition-[visibility] duration-300 lg:hidden ${open ? "visible" : "invisible"}`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-y-0 end-0 flex w-full max-w-sm flex-col bg-brown text-cream shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 pb-2 pt-5">
            <img src={logo} alt="" className="h-11 w-11 rounded-full object-cover ring-1 ring-gold/50" />
            <button
              onClick={() => setOpen(false)}
              aria-label={t("navCloseMenu")}
              className="flex h-10 w-10 items-center justify-center rounded-full text-cream/80 hover:bg-white/10 hover:text-cream"
            >
              <X size={22} />
            </button>
          </div>

          <ul className="flex flex-1 flex-col justify-center gap-1 px-6">
            {links.map((link, i) => {
              const active = isActive(link.to)
              return (
                <li
                  key={link.to}
                  className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 py-2.5 font-display text-4xl transition-colors ${
                      active ? "text-gold" : "text-cream hover:text-gold"
                    }`}
                  >
                    <span className={`h-px bg-gold transition-all ${active ? "w-6" : "w-0"}`} />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex flex-col gap-4 border-t border-cream/10 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
            <Link
              to="/#reservation"
              className="rounded-full bg-gold py-3 text-center font-body text-base font-medium text-white hover:bg-[hsl(42_50%_46%)]"
            >
              {t("navReserveTable")}
            </Link>
            <div className="grid grid-cols-3 gap-2">
              <QuickAction href={`tel:+${RESTAURANT_WHATSAPP}`} icon={<Phone size={18} />} label={t("navCall")} />
              <QuickAction href={`https://wa.me/${RESTAURANT_WHATSAPP}`} icon={<MessageCircle size={18} />} label={t("navWhatsApp")} external />
              <QuickAction href={RESTAURANT_MAP_URL} icon={<MapPin size={18} />} label={t("navDirections")} external />
            </div>
            <p className="text-center font-body text-xs text-cream/50">{t("navOpenDaily")}</p>
          </div>
        </div>
      </div>
    </>
  )
}

function QuickAction({
  href,
  icon,
  label,
  external,
}: {
  href: string
  icon: React.ReactNode
  label: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-cream/15 py-3 font-body text-xs text-cream/85 transition-colors hover:border-gold hover:text-gold"
    >
      {icon}
      {label}
    </a>
  )
}
