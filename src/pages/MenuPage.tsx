import { useMemo, useState } from "react"
import { Play, X, Plus, Minus, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react"
import Navbar from "@/sections/Navbar"
import Footer from "@/sections/Footer"
import { useMenuItems, type MenuItem } from "@/lib/firestoreMenu"
import { useT, useLanguage } from "@/lib/i18n"
import { RESTAURANT_WHATSAPP } from "@/lib/config"
import { optimizedImage } from "@/lib/storage"

type OrderMap = Record<string, number>
type OrderType = "pickup" | "delivery"

const priceOf = (item?: MenuItem) => parseFloat(item?.price ?? "") || 0

export default function MenuPage() {
  const { items, loading } = useMenuItems()
  const t = useT()
  const { lang } = useLanguage()
  const ar = lang === "ar"

  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")
  const [order, setOrder] = useState<OrderMap>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [orderType, setOrderType] = useState<OrderType>("pickup")
  const [address, setAddress] = useState("")
  const [activeVideo, setActiveVideo] = useState<MenuItem | null>(null)
  const [activeImageItem, setActiveImageItem] = useState<MenuItem | null>(null)
  const [imageIndex, setImageIndex] = useState(0)

  const label = (en: string, arText?: string) => (ar && arText ? arText : en)

  const categories = useMemo(() => {
    const seen = new Map<string, string>()
    items.forEach((i) => {
      if (i.category && !seen.has(i.category)) seen.set(i.category, i.categoryAr ?? "")
    })
    return Array.from(seen, ([name, nameAr]) => ({ name, nameAr }))
  }, [items])

  const sections = useMemo(() => {
    const q = search.trim().toLowerCase()
    return categories
      .filter((c) => !category || c.name === category)
      .map((c) => ({
        ...c,
        items: items.filter(
          (i) =>
            i.category === c.name &&
            (!q ||
              i.name.toLowerCase().includes(q) ||
              (i.nameAr ?? "").includes(search.trim()) ||
              (i.desc ?? "").toLowerCase().includes(q))
        ),
      }))
      .filter((s) => s.items.length > 0)
  }, [categories, items, category, search])

  const byName = useMemo(() => new Map(items.map((i) => [i.name, i])), [items])
  const totalItems = Object.values(order).reduce((n, q) => n + q, 0)
  const totalPrice = Object.entries(order).reduce((sum, [name, q]) => sum + q * priceOf(byName.get(name)), 0)
  const summary = Object.entries(order)
    .map(([name, q]) => `${q}× ${label(name, byName.get(name)?.nameAr)}`)
    .join(", ")

  const addItem = (name: string) => setOrder((o) => ({ ...o, [name]: (o[name] ?? 0) + 1 }))
  const removeItem = (name: string) =>
    setOrder((o) => {
      const next = { ...o }
      if (!next[name]) return next
      next[name] -= 1
      if (next[name] <= 0) delete next[name]
      return next
    })

  const openImages = (item: MenuItem) => {
    setActiveImageItem(item)
    setImageIndex(0)
  }
  const activeImages = activeImageItem?.images ?? []

  const sendOrder = () => {
    const lines = Object.entries(order).map(([name, qty]) => {
      const item = byName.get(name)
      return `${qty}x ${label(name, item?.nameAr)} — ${item?.price ?? ""}`
    })
    const typeLabel = orderType === "pickup" ? t("pickup") : t("delivery")
    const addressLine = orderType === "delivery" ? `\n${ar ? "العنوان" : "Address"}: ${address}` : ""
    const totalLine = `\n\n${t("menuTotal")}: ${totalPrice} SAR`
    const message = ar
      ? `طلب جديد عبر الموقع\nنوع الطلب: ${typeLabel}${addressLine}\n\n${lines.join("\n")}${totalLine}`
      : `New order via website\nOrder type: ${typeLabel}${addressLine}\n\n${lines.join("\n")}${totalLine}`
    window.open(`https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <>
      <Navbar />

      {/* Title band */}
      <header className="bg-teal pt-24 text-cream md:pt-28">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-6 pb-14 pt-10 md:pb-16">
          <div className="flex flex-col gap-2">
            <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-saffron">
              {items.length > 0 ? `${items.length} ${t("menuDishes")}` : t("fullMenuEyebrow")}
            </p>
            <h1 className="font-display text-5xl md:text-7xl">{t("menuPageTitle")}</h1>
          </div>
          <p
            dir={ar ? "ltr" : "rtl"}
            className={`${ar ? "font-display" : "font-arabic"} text-3xl text-cream/90 md:text-4xl`}
          >
            {t("menuPageOther")}
          </p>
        </div>
      </header>

      {/* Search + categories, sticks under the navbar */}
      <div className="sticky z-30 border-b border-foreground/10 bg-cream/95 backdrop-blur" style={{ top: "var(--nav-h, 72px)" }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-3.5 md:flex-row md:items-center">
          <label className="flex items-center gap-2.5 rounded-lg border border-foreground/20 bg-white px-3.5 md:w-72">
            <Search size={17} className="shrink-0 text-foreground/50" />
            <span className="sr-only">{t("menuSearch")}</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("menuSearch")}
              className="min-w-0 flex-1 bg-transparent py-2.5 font-body text-base outline-none"
            />
          </label>
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-0.5 md:mx-0 md:flex-1 md:px-0">
            {[{ name: "", nameAr: "" }, ...categories].map((c) => {
              const on = category === c.name
              return (
                <button
                  key={c.name || "all"}
                  onClick={() => setCategory(c.name)}
                  className={`shrink-0 rounded-full border px-4 py-2 font-body text-sm font-bold transition-colors ${
                    on
                      ? "border-teal bg-teal text-cream"
                      : "border-foreground/20 bg-white text-foreground hover:border-teal"
                  }`}
                >
                  {c.name ? label(c.name, c.nameAr) : t("menuAll")}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <main className="min-h-[50vh] bg-cream pb-36">
        <div className="mx-auto max-w-6xl px-6">
          {loading && <p className="py-16 text-center font-body text-foreground/50">Loading menu…</p>}
          {!loading && items.length === 0 && (
            <p className="py-16 text-center font-body text-foreground/50">The menu is being updated — check back shortly.</p>
          )}
          {!loading && items.length > 0 && sections.length === 0 && (
            <p className="py-16 text-center font-body text-foreground/60">{t("menuNoMatch")}</p>
          )}

          {sections.map((section) => (
            <section key={section.name} className="pt-14">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-teal pb-3">
                <h2 className="font-display text-3xl md:text-4xl">{label(section.name, section.nameAr)}</h2>
                {!ar && section.nameAr && (
                  <span dir="rtl" className="font-arabic text-2xl text-foreground/55">
                    {section.nameAr}
                  </span>
                )}
              </div>

              <ul className="grid lg:grid-cols-2 lg:gap-x-14">
                {section.items.map((item) => {
                  const name = label(item.name, item.nameAr)
                  const other = ar ? "" : item.nameAr
                  const desc = label(item.desc ?? "", item.descAr)
                  const qty = order[item.name] ?? 0
                  const images = item.images ?? []

                  return (
                    <li key={item.id} className="flex items-center gap-4 border-b border-foreground/10 py-4">
                      {images.length > 0 && (
                        <button
                          onClick={() => openImages(item)}
                          aria-label={t("viewPhoto")}
                          className="arch relative h-[72px] w-[72px] shrink-0 overflow-hidden border border-foreground/10 bg-white transition-colors hover:border-gold"
                        >
                          <img src={optimizedImage(images[0], 200)} alt={name} loading="lazy" className="h-full w-full object-cover" />
                          {images.length > 1 && (
                            <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 font-body text-[10px] leading-tight text-white">
                              +{images.length - 1}
                            </span>
                          )}
                        </button>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline">
                          <h3 className="font-display text-xl md:text-[1.35rem]">{name}</h3>
                          {item.video && (
                            <button
                              onClick={() => setActiveVideo(item)}
                              aria-label={`Watch ${item.name} video`}
                              className="ms-2 self-center text-gold hover:text-teal"
                            >
                              <Play size={15} fill="currentColor" />
                            </button>
                          )}
                          <span className="menu-dots min-w-4" />
                          <span className="shrink-0 font-body text-lg font-bold text-teal">{item.price}</span>
                        </div>
                        {other && (
                          <p dir="rtl" className="text-left font-arabic text-lg leading-snug text-foreground/55">
                            {other}
                          </p>
                        )}
                        {desc && <p className="mt-0.5 font-body text-sm text-foreground/60">{desc}</p>}
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        {qty > 0 && (
                          <>
                            <button
                              onClick={() => removeItem(item.name)}
                              aria-label="Decrease quantity"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-white text-foreground/70 hover:border-teal"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="w-5 text-center font-body font-bold">{qty}</span>
                          </>
                        )}
                        <button
                          onClick={() => addItem(item.name)}
                          aria-label={`${t("addToOrder")} ${name}`}
                          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                            qty > 0
                              ? "border-saffron bg-saffron text-ink"
                              : "border-foreground/20 bg-white text-foreground hover:border-teal"
                          }`}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </main>

      {/* Order bar */}
      {totalItems > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-4 z-40 px-4 pb-[env(safe-area-inset-bottom)]">
          <button
            onClick={() => setCartOpen(true)}
            className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 rounded-xl bg-teal py-2.5 pe-2.5 ps-5 text-start text-cream shadow-[0_14px_34px_rgba(14,77,79,0.35)]"
          >
            <span className="min-w-0">
              <span className="block font-body text-base font-bold">
                {totalItems} {t("menuItemsCount")} · {totalPrice} SAR
              </span>
              <span className="block truncate font-body text-xs text-cream/75">{summary}</span>
            </span>
            <span className="shrink-0 rounded-lg bg-saffron px-5 py-3 font-body text-sm font-bold text-ink">
              {t("menuViewOrder")}
            </span>
          </button>
        </div>
      )}

      {/* Order sheet */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 md:items-center" onClick={() => setCartOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("yourOrder")}
            className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-cream p-6 md:max-w-md md:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-3xl">{t("yourOrder")}</h3>
              <button onClick={() => setCartOpen(false)} aria-label="Close" className="rounded-full p-2 hover:bg-foreground/5">
                <X size={22} />
              </button>
            </div>

            {totalItems === 0 ? (
              <p className="py-8 text-center font-body text-foreground/50">{t("emptyOrder")}</p>
            ) : (
              <>
                <ul className="mb-5 flex flex-col">
                  {Object.entries(order).map(([name, qty]) => {
                    const item = byName.get(name)
                    return (
                      <li key={name} className="flex items-center justify-between gap-3 border-b border-foreground/10 py-3">
                        <div className="min-w-0">
                          <p className="font-display text-lg">{label(name, item?.nameAr)}</p>
                          <p className="font-body text-sm text-foreground/55">
                            {item?.price} × {qty} = <strong>{priceOf(item) * qty} SAR</strong>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeItem(name)} aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-white">
                            <Minus size={14} />
                          </button>
                          <span className="w-5 text-center font-body font-bold">{qty}</span>
                          <button onClick={() => addItem(name)} aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron text-ink">
                            <Plus size={14} />
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>

                <p className="mb-6 flex justify-between font-body text-lg">
                  <span>{t("menuTotal")}</span>
                  <strong className="text-teal">{totalPrice} SAR</strong>
                </p>

                <p className="mb-2 font-body text-sm font-bold text-foreground/70">{t("orderType")}</p>
                <div className="mb-5 grid grid-cols-2 gap-2.5">
                  {(["pickup", "delivery"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`rounded-lg border py-3 font-body text-sm font-bold transition-colors ${
                        orderType === type ? "border-teal bg-teal text-cream" : "border-foreground/20 bg-white hover:border-teal"
                      }`}
                    >
                      {t(type)}
                    </button>
                  ))}
                </div>

                {orderType === "delivery" && (
                  <label className="mb-5 block">
                    <span className="mb-2 block font-body text-sm font-bold text-foreground/70">{t("deliveryAddress")}</span>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t("deliveryAddressPlaceholder")}
                      rows={2}
                      className="admin-input resize-none"
                    />
                  </label>
                )}

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setOrder({})}
                    className="flex items-center gap-1.5 rounded-lg border border-foreground/20 px-4 py-3 font-body text-sm text-foreground/70 hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 size={15} /> {t("clear")}
                  </button>
                  <button
                    onClick={sendOrder}
                    disabled={orderType === "delivery" && !address.trim()}
                    className="flex-1 rounded-lg bg-saffron py-3 font-body text-base font-bold text-ink hover:bg-[hsl(36_80%_63%)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("orderViaWhatsApp")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Photo viewer */}
      {activeImageItem && activeImages.length > 0 && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-6" onClick={() => setActiveImageItem(null)}>
          <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveImageItem(null)} aria-label="Close image" className="absolute -top-11 right-0 p-1 text-cream hover:text-saffron">
              <X size={26} />
            </button>
            <div className="relative">
              <img src={optimizedImage(activeImages[imageIndex], 1400)} alt={activeImageItem.name} className="w-full rounded-lg" />
              {activeImages.length > 1 && (
                <>
                  <button
                    onClick={() => setImageIndex((i) => (i - 1 + activeImages.length) % activeImages.length)}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-cream hover:bg-black/70"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={() => setImageIndex((i) => (i + 1) % activeImages.length)}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-cream hover:bg-black/70"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>
            <p className="mt-4 text-center font-display text-xl text-cream">{label(activeImageItem.name, activeImageItem.nameAr)}</p>
          </div>
        </div>
      )}

      {/* Video viewer */}
      {activeVideo && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-6" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} aria-label="Close video" className="absolute -top-11 right-0 p-1 text-cream hover:text-saffron">
              <X size={26} />
            </button>
            <video src={activeVideo.video} controls autoPlay className="w-full rounded-lg" />
            <p className="mt-4 text-center font-display text-xl text-cream">{label(activeVideo.name, activeVideo.nameAr)}</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
