import { Link } from "react-router"
import { UtensilsCrossed, Tag, Images, Info } from "lucide-react"
import { useMenuItems } from "@/lib/firestoreMenu"
import { useOffers } from "@/lib/firestoreOffers"
import { useGallery } from "@/lib/firestoreGallery"

export default function AdminDashboard() {
  const { items } = useMenuItems()
  const { offers } = useOffers()
  const { entries } = useGallery()

  const cards = [
    { to: "/admin/menu", label: "Menu Items", count: items.length, icon: UtensilsCrossed },
    { to: "/admin/offers", label: "Offers", count: offers.length, icon: Tag },
    { to: "/admin/gallery", label: "Gallery Entries", count: entries.length, icon: Images },
    { to: "/admin/about", label: "About Us", count: null, icon: Info },
  ]

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display text-3xl mb-2">Dashboard</h1>
      <p className="font-body text-foreground/60 mb-8">
        Manage your menu, offers, gallery, and About Us page. Changes appear on the live site immediately.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.to}
              to={card.to}
              className="bg-white border border-foreground/10 hover:border-gold p-6 rounded transition-colors"
            >
              <Icon size={22} className="text-gold mb-3" />
              <p className="font-display text-2xl">{card.count ?? "Edit"}</p>
              <p className="font-body text-xs text-foreground/50 mt-1">{card.label}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
