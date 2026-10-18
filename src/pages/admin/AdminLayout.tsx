import { useEffect, useState } from "react"
import { Link, Outlet, useLocation } from "react-router"
import { Toaster } from "sonner"
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  Info,
  Images,
  LogOut,
  Database,
  ImageIcon,
  Menu as MenuIcon,
  X,
  ExternalLink,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import logo from "@/assets/mairaj-logo.jpeg"

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/admin/offers", label: "Offers", icon: Tag },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/homepage", label: "Homepage photos", icon: ImageIcon },
  { to: "/admin/about", label: "About us", icon: Info },
]

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => setDrawerOpen(false), [location.pathname])

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to)

  const current = links.find((l) => isActive(l.to, l.end))?.label ?? "Admin"

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-cream/10 p-5">
        <img src={logo} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-saffron" />
        <div>
          <p className="font-display text-lg leading-tight">Mairaj</p>
          <p className="font-body text-xs text-saffron">Website admin</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {links.map((link) => {
          const Icon = link.icon
          const active = isActive(link.to, link.end)
          return (
            <Link
              key={link.to}
              to={link.to}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 font-body text-[15px] transition-colors ${
                active ? "bg-saffron font-semibold text-ink" : "text-cream/80 hover:bg-cream/10 hover:text-cream"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          )
        })}

        <div className="mt-auto pt-4">
          <Link
            to="/admin/seed"
            className={`flex items-center gap-3 rounded-md px-3 py-2 font-body text-sm transition-colors ${
              isActive("/admin/seed") ? "bg-cream/10 text-cream" : "text-cream/45 hover:text-cream/80"
            }`}
          >
            <Database size={16} />
            Import menu
          </Link>
          <a
            href={import.meta.env.BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md px-3 py-2 font-body text-sm text-cream/45 hover:text-cream/80"
          >
            <ExternalLink size={16} />
            View website
          </a>
        </div>
      </nav>

      <div className="border-t border-cream/10 p-4">
        <p className="mb-2 truncate font-body text-xs text-cream/45">{user?.email}</p>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 font-body text-sm text-cream/75 transition-colors hover:text-saffron"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream md:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-teal text-cream md:block">
        {sidebar}
      </aside>

      {/* Phone top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-teal px-4 py-3 text-cream md:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open admin menu"
          className="-ml-1 rounded p-1.5 hover:bg-cream/10"
        >
          <MenuIcon size={22} />
        </button>
        <p className="font-body text-[15px] font-medium">{current}</p>
        <img src={logo} alt="" className="h-8 w-8 rounded-full object-cover" />
      </header>

      {/* Phone drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-teal text-cream shadow-2xl">
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close admin menu"
              className="absolute right-3 top-5 rounded p-1.5 text-cream/70 hover:bg-cream/10"
            >
              <X size={20} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-10 md:py-10">
          <Outlet />
        </div>
      </main>

      <Toaster position="bottom-center" richColors closeButton />
    </div>
  )
}
