import { Link } from "react-router"
import { Instagram, Facebook, Phone, Mail } from "lucide-react"
import logo from "@/assets/mairaj-logo.jpeg"
import { useT } from "@/lib/i18n"

export default function Footer() {
  const t = useT()

  return (
    <footer className="bg-foreground text-cream border-t border-cream/10">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <img
            src={logo}
            alt="Mairaj Restaurant"
            className="h-14 w-14 rounded-full object-cover mb-4"
          />
          <h3 className="font-display text-2xl mb-3">Mairaj</h3>
          <p className="font-body text-cream/50 text-sm leading-relaxed">
            {t("footerTagline")}
          </p>
        </div>

        <div>
          <h4 className="font-body text-xs tracking-mega uppercase text-gold mb-4">
            {t("explore")}
          </h4>
          <div className="flex flex-col gap-3 font-body text-sm text-cream/70">
            <Link to="/" className="hover:text-gold transition-colors w-fit">
              {t("navHome")}
            </Link>
            <Link to="/menu" className="hover:text-gold transition-colors w-fit">
              {t("navMenu")}
            </Link>
            <a href="#reservation" className="hover:text-gold transition-colors w-fit">
              {t("reservations")}
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-body text-xs tracking-mega uppercase text-gold mb-4">
            {t("contact")}
          </h4>
          <div className="flex flex-col gap-3 font-body text-sm text-cream/70">
            <a
              href="https://wa.me/966580748325"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold transition-colors w-fit"
              dir="ltr"
            >
              <Phone size={14} /> +966 58 074 8325
            </a>
            <a
              href="mailto:hello@mairaj.example"
              className="flex items-center gap-2 hover:text-gold transition-colors w-fit"
            >
              <Mail size={14} /> hello@mairaj.example
            </a>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="bg-gold text-cream hover:bg-gold/80 p-2 rounded-full transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="bg-gold text-cream hover:bg-gold/80 p-2 rounded-full transition-colors"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center font-body text-[0.7rem] text-cream/40 tracking-widest">
        &copy; {new Date().getFullYear()} MAIRAJ RESTAURANT &middot; MADINAH
      </div>
    </footer>
  )
}
