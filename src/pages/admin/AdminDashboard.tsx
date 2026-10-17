import { Link } from "react-router"
import { UtensilsCrossed, Tag, Images, Info, ImageIcon, AlertCircle, Camera } from "lucide-react"
import { useMenuItems } from "@/lib/firestoreMenu"
import { useOffers } from "@/lib/firestoreOffers"
import { useGallery } from "@/lib/firestoreGallery"
import { useHeroSettings } from "@/lib/firestoreSite"
import { isStorageConfigured } from "@/lib/storage"
import { PageHeader } from "@/components/admin/AdminUI"

export default function AdminDashboard() {
  const { items } = useMenuItems()
  const { offers } = useOffers()
  const { entries } = useGallery()
  const { hero } = useHeroSettings()

  const withoutPhotos = items.filter((i) => !i.images?.length).length
  const activeOffers = offers.filter((o) => o.active).length

  const cards = [
    {
      to: "/admin/menu",
      label: "Menu",
      icon: UtensilsCrossed,
      value: `${items.length} dishes`,
      detail: items.length ? `${withoutPhotos} without a photo` : "Add your first dish",
    },
    {
      to: "/admin/offers",
      label: "Offers",
      icon: Tag,
      value: `${activeOffers} showing`,
      detail: `${offers.length} in total`,
    },
    {
      to: "/admin/gallery",
      label: "Gallery",
      icon: Images,
      value: `${entries.length} albums`,
      detail: `${entries.reduce((n, e) => n + (e.images?.length ?? 0), 0)} photos`,
    },
    {
      to: "/admin/homepage",
      label: "Homepage photos",
      icon: ImageIcon,
      value: hero.images.length ? `${hero.images.length} photos` : "Default photos",
      detail: "The big slideshow at the top",
    },
    {
      to: "/admin/about",
      label: "About us",
      icon: Info,
      value: "Edit page",
      detail: "Story, services, contact",
    },
  ]

  return (
    <div>
      <PageHeader
        title="Welcome back"
        subtitle="Everything you change here appears on the website straight away."
      />

      {!isStorageConfigured && (
        <div className="mb-6 flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 font-body text-sm text-amber-900">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>
            Photo uploads aren't connected yet. Follow the steps in <strong>SETUP-IMAGES.md</strong>{" "}
            to add your free Cloudinary account, then redeploy the site.
          </p>
        </div>
      )}

      {isStorageConfigured && withoutPhotos > 0 && items.length > 0 && (
        <Link
          to="/admin/menu?filter=no-photo"
          className="mb-6 flex items-center gap-3 rounded-lg border border-gold/40 bg-gold/10 p-4 font-body text-sm transition-colors hover:bg-gold/15"
        >
          <Camera size={18} className="shrink-0 text-gold" />
          <span>
            <strong>{withoutPhotos}</strong> {withoutPhotos === 1 ? "dish has" : "dishes have"} no
            photo yet. Dishes with photos get noticed more — add some now.
          </span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.to}
              to={card.to}
              className="group rounded-xl border border-foreground/10 bg-white p-5 transition-colors hover:border-gold"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Icon size={20} />
              </div>
              <p className="font-body text-sm text-foreground/60">{card.label}</p>
              <p className="font-display text-2xl">{card.value}</p>
              <p className="mt-1 font-body text-xs text-foreground/50">{card.detail}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
