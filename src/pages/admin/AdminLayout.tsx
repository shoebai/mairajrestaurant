import { Link, Outlet, useLocation } from "react-router"
import { LayoutDashboard, UtensilsCrossed, Tag, Info, Images, LogOut, Database } from "lucide-react"
import { useAuth } from "@/lib/auth"
import logo from "@/assets/mairaj-logo.jpeg"

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
  { to: "/admin/offers", label: "Offers", icon: Tag },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/about", label: "About Us", icon: Info },
  { to: "/admin/seed", label: "Import Starter Data", icon: Database },
]

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="w-64 bg-foreground text-cream flex flex-col shrink-0">
        <div className="flex items-center gap-3 p-6 border-b border-cream/10">
          <img src={logo} alt="Mairaj" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-display text-lg leading-tight">Mairaj</p>
            <p className="font-body text-[0.6rem] tracking-widest uppercase text-gold">Admin</p>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {links.map((link) => {
            const isActive = link.end
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to)
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded font-body text-sm transition-colors ${
                  isActive ? "bg-gold text-cream" : "text-cream/70 hover:bg-cream/10"
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-cream/10">
          <p className="font-body text-xs text-cream/40 mb-3 truncate">{user?.email}</p>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors font-body text-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
