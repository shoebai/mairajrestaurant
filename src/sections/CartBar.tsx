import { Link } from "react-router"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart"
import { useMenuItems } from "@/lib/firestoreMenu"
import { useT, useLanguage } from "@/lib/i18n"

/** Floating "your order" bar on the homepage; opens the cart on the menu page. */
export default function CartBar() {
  const { order, totalItems } = useCart()
  const { items } = useMenuItems()
  const t = useT()
  const { lang } = useLanguage()

  if (totalItems === 0) return null

  const byName = new Map(items.map((i) => [i.name, i]))
  const total = Object.entries(order).reduce((sum, [name, q]) => sum + q * (parseFloat(byName.get(name)?.price ?? "") || 0), 0)
  const summary = Object.entries(order)
    .map(([name, q]) => `${q}× ${lang === "ar" ? byName.get(name)?.nameAr || name : name}`)
    .join(", ")

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 px-4 pb-[env(safe-area-inset-bottom)]">
      <Link
        to="/menu?order=open"
        className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 rounded-xl bg-teal py-2.5 pe-2.5 ps-4 text-cream shadow-[0_14px_34px_rgba(14,77,79,0.35)]"
      >
        <ShoppingBag size={22} className="shrink-0 text-saffron" />
        <span className="min-w-0 flex-1">
          <span className="block font-body text-base font-bold">
            {totalItems} {t("menuItemsCount")} · {total} SAR
          </span>
          <span className="block truncate font-body text-xs text-cream/75">{summary}</span>
        </span>
        <span className="shrink-0 rounded-lg bg-saffron px-5 py-3 font-body text-sm font-bold text-ink">
          {t("menuViewOrder")}
        </span>
      </Link>
    </div>
  )
}
