import { useEffect, useMemo, useRef, useState } from "react"
import {
  Play,
  X,
  Plus,
  Minus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Info,
  MapPin,
  LocateFixed,
  Loader2,
  ExternalLink,
} from "lucide-react"
import Navbar from "@/sections/Navbar"
import Footer from "@/sections/Footer"
import { useMenuItems, type MenuItem } from "@/lib/firestoreMenu"
import { useT, useLanguage } from "@/lib/i18n"
import { RESTAURANT_WHATSAPP } from "@/lib/config"
import { optimizedImage } from "@/lib/storage"

type OrderMap = Record<string, number>
type OrderType = "pickup" | "delivery"
type PinnedLocation = { lat: number; lng: number; accuracy: number }

const NOTE_MAX = 300
const mapLink = (loc: PinnedLocation) => `https://maps.google.com/?q=${loc.lat.toFixed(6)},${loc.lng.toFixed(6)}`

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
  const [location, setLocation] = useState<PinnedLocation | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [note, setNote] = useState("")
  const chipsRef = useRef<HTMLDivElement>(null)
  const listTopRef = useRef<HTMLDivElement>(null)
  const [canScrollStart, setCanScrollStart] = useState(false)
  const [canScrollEnd, setCanScrollEnd] = useState(false)
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

  // Dishes that match the search box (all dishes when it's empty).
  const matching = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.nameAr ?? "").includes(search.trim()) ||
        (i.desc ?? "").toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    )
  }, [items, search])

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>()
    matching.forEach((i) => counts.set(i.category, (counts.get(i.category) ?? 0) + 1))
    return counts
  }, [matching])

  const sections = useMemo(
    () =>
      categories
        .filter((c) => !category || c.name === category)
        .map((c) => ({ ...c, items: matching.filter((i) => i.category === c.name) }))
        .filter((s) => s.items.length > 0),
    [categories, matching, category]
  )

  // Show the fade + arrow only when the chip row can scroll that way.
  const updateChipArrows = () => {
    const el = chipsRef.current
    if (!el) return
    const pos = Math.abs(el.scrollLeft)
    setCanScrollStart(pos > 4)
    setCanScrollEnd(pos + el.clientWidth < el.scrollWidth - 4)
  }
  useEffect(() => {
    updateChipArrows()
    window.addEventListener("resize", updateChipArrows)
    return () => window.removeEventListener("resize", updateChipArrows)
  }, [categories.length])

  const scrollChips = (towardsEnd: boolean) => {
    const el = chipsRef.current
    if (!el) return
    const rtl = getComputedStyle(el).direction === "rtl"
    const amount = el.clientWidth * 0.7 * (towardsEnd ? 1 : -1) * (rtl ? -1 : 1)
    el.scrollBy({ left: amount, behavior: "smooth" })
  }

  const pickCategory = (name: string, chip?: HTMLElement) => {
    setCategory(name)
    chip?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    // If the visitor is far down the list, bring the results into view.
    const top = listTopRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const onSearch = (value: string) => {
    setSearch(value)
    if (value && category) setCategory("")
  }

  const resultCount = matching.length

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

  const pinLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationError(t("menuLocationFailed"))
      return
    }
    setLocating(true)
    setLocationError("")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy })
        setLocating(false)
      },
      (err) => {
        setLocationError(err.code === err.PERMISSION_DENIED ? t("menuLocationDenied") : t("menuLocationFailed"))
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    )
  }

  const quickNotes = [
    t("menuNoteSpicy"),
    t("menuNoteMild"),
    t("menuNoteRoti"),
    t("menuNoteRice"),
    t("menuNoteRaita"),
    t("menuNoteOnion"),
  ]
  const noteParts = note.split(",").map((p) => p.trim()).filter(Boolean)
  const toggleQuickNote = (text: string) => {
    const has = noteParts.includes(text)
    const next = has ? noteParts.filter((p) => p !== text) : [...noteParts, text]
    setNote(next.join(", ").slice(0, NOTE_MAX))
  }

  const isDelivery = orderType === "delivery"
  const canSend = totalItems > 0 && (!isDelivery || !!location || !!address.trim())

  const sendOrder = () => {
    const lines = Object.entries(order).map(([name, qty]) => {
      const item = byName.get(name)
      return `${qty}x ${label(name, item?.nameAr)} — ${item?.price ?? ""}`
    })
    const L = ar
      ? { title: "طلب جديد عبر الموقع", type: "نوع الطلب", address: "العنوان", map: "الموقع على الخريطة", note: "ملاحظات", items: "مجموع الأصناف", fee: "رسوم التوصيل: تُحدد حسب المنطقة" }
      : { title: "New order via website", type: "Order type", address: "Address", map: "Location", note: "Notes", items: "Items total", fee: "Delivery charge: to be confirmed for my area" }

    const parts = [L.title, `${L.type}: ${isDelivery ? t("delivery") : t("pickup")}`]
    if (isDelivery && address.trim()) parts.push(`${L.address}: ${address.trim()}`)
    if (isDelivery && location) parts.push(`${L.map}: ${mapLink(location)}`)
    parts.push("", ...lines, "", `${L.items}: ${totalPrice} SAR`)
    if (isDelivery) parts.push(L.fee)
    if (note.trim()) parts.push("", `${L.note}: ${note.trim()}`)

    window.open(`https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(parts.join("\n"))}`, "_blank")
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
      <div
        className="sticky z-30 border-b border-foreground/10 bg-cream/95 shadow-[0_8px_20px_-14px_rgba(27,42,43,0.35)] backdrop-blur"
        style={{ top: "var(--nav-h, 72px)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:gap-5">
          {/* Search */}
          <div className="relative md:w-80 md:shrink-0">
            <Search size={18} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-foreground/45" />
            <label htmlFor="menu-search" className="sr-only">{t("menuSearch")}</label>
            <input
              id="menu-search"
              type="search"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && onSearch("")}
              placeholder={t("menuSearch")}
              autoComplete="off"
              className="w-full rounded-full border border-foreground/15 bg-white py-3 pe-24 ps-11 font-body text-base shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-foreground/40 focus:border-teal focus:shadow-[0_0_0_3px_hsl(182_69%_18%/0.15)] [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <div className="absolute end-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
                <span className="font-body text-xs text-foreground/50" aria-live="polite">
                  {resultCount} {t("menuResults")}
                </span>
                <button
                  onClick={() => onSearch("")}
                  aria-label={t("menuClearSearch")}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/55 hover:bg-foreground/5 hover:text-foreground"
                >
                  <X size={17} />
                </button>
              </div>
            )}
          </div>

          {/* Category chips */}
          <div className="relative min-w-0 md:flex-1">
            {canScrollStart && (
              <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex w-14 items-center bg-gradient-to-r from-cream via-cream/90 to-transparent rtl:bg-gradient-to-l">
                <button
                  onClick={() => scrollChips(false)}
                  aria-label={t("menuScrollLeft")}
                  className="pointer-events-auto hidden h-8 w-8 items-center justify-center rounded-full border border-foreground/15 bg-white shadow-sm hover:border-teal md:flex"
                >
                  <ChevronLeft size={16} className="rtl:rotate-180" />
                </button>
              </div>
            )}
            <div
              ref={chipsRef}
              onScroll={updateChipArrows}
              role="tablist"
              aria-label={t("menuPageTitle")}
              className="-mx-4 flex snap-x gap-2 overflow-x-auto scroll-px-4 px-4 py-0.5 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {[{ name: "", nameAr: "" }, ...categories].map((c) => {
                const on = category === c.name
                const count = c.name ? countByCategory.get(c.name) ?? 0 : resultCount
                const empty = !!search && count === 0
                return (
                  <button
                    key={c.name || "all"}
                    role="tab"
                    aria-selected={on}
                    onClick={(e) => pickCategory(c.name, e.currentTarget)}
                    disabled={empty}
                    className={`flex shrink-0 snap-start items-center gap-2 rounded-full border py-2 pe-2 ps-4 font-body text-sm font-semibold transition-colors disabled:opacity-35 ${
                      on
                        ? "border-teal bg-teal text-cream shadow-sm"
                        : "border-foreground/15 bg-white text-foreground hover:border-teal hover:text-teal"
                    }`}
                  >
                    {c.name ? label(c.name, c.nameAr) : t("menuAll")}
                    <span
                      className={`min-w-[1.6rem] rounded-full px-1.5 py-0.5 text-center text-xs font-bold ${
                        on ? "bg-saffron text-ink" : "bg-cream text-foreground/60"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
            {canScrollEnd && (
              <div className="pointer-events-none absolute inset-y-0 end-0 z-10 flex w-14 items-center justify-end bg-gradient-to-l from-cream via-cream/90 to-transparent rtl:bg-gradient-to-r">
                <button
                  onClick={() => scrollChips(true)}
                  aria-label={t("menuScrollRight")}
                  className="pointer-events-auto hidden h-8 w-8 items-center justify-center rounded-full border border-foreground/15 bg-white shadow-sm hover:border-teal md:flex"
                >
                  <ChevronRight size={16} className="rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="min-h-[50vh] bg-cream pb-36">
        <div ref={listTopRef} className="mx-auto max-w-6xl px-6" style={{ scrollMarginTop: "calc(var(--nav-h, 72px) + 9rem)" }}>
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

                {isDelivery && (
                  <div className="mb-5 flex flex-col gap-3">
                    <span className="font-body text-sm font-bold text-foreground/70">{t("deliveryAddress")}</span>

                    {location ? (
                      <div className="flex items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-3">
                        <MapPin size={20} className="shrink-0 text-emerald-700" />
                        <div className="min-w-0 flex-1">
                          <p className="font-body text-sm font-bold text-emerald-900">{t("menuLocationAdded")}</p>
                          <a
                            href={mapLink(location)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-body text-xs text-emerald-800 underline-offset-2 hover:underline"
                          >
                            {t("menuLocationView")} <ExternalLink size={11} />
                          </a>
                          {location.accuracy > 200 && (
                            <p className="font-body text-xs text-emerald-800/80">±{Math.round(location.accuracy)} m</p>
                          )}
                        </div>
                        <button
                          onClick={() => setLocation(null)}
                          className="rounded-md px-2 py-1 font-body text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                        >
                          {t("menuLocationRemove")}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={pinLocation}
                        disabled={locating}
                        className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-teal/40 bg-white py-3 font-body text-sm font-bold text-teal transition-colors hover:border-teal hover:bg-teal/5 disabled:opacity-60"
                      >
                        {locating ? <Loader2 size={17} className="animate-spin" /> : <LocateFixed size={17} />}
                        {locating ? t("menuLocating") : t("menuUseLocation")}
                      </button>
                    )}
                    {locationError && <p className="font-body text-xs text-destructive">{locationError}</p>}

                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={location ? t("menuAddressOptional") : t("deliveryAddressPlaceholder")}
                      aria-label={t("deliveryAddress")}
                      rows={2}
                      className="admin-input resize-none"
                    />
                  </div>
                )}

                {/* Notes for the kitchen */}
                <div className="mb-5 flex flex-col gap-2.5">
                  <label htmlFor="order-note" className="font-body text-sm font-bold text-foreground/70">
                    {t("menuOrderNote")}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {quickNotes.map((q) => {
                      const on = noteParts.includes(q)
                      return (
                        <button
                          key={q}
                          onClick={() => toggleQuickNote(q)}
                          aria-pressed={on}
                          className={`rounded-full border px-3 py-1.5 font-body text-xs font-semibold transition-colors ${
                            on ? "border-saffron bg-saffron text-ink" : "border-foreground/15 bg-white text-foreground/75 hover:border-teal"
                          }`}
                        >
                          {on ? "✓ " : "+ "}
                          {q}
                        </button>
                      )
                    })}
                  </div>
                  <textarea
                    id="order-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
                    placeholder={t("menuOrderNotePlaceholder")}
                    rows={2}
                    className="admin-input resize-none"
                  />
                  {note.length > NOTE_MAX - 50 && (
                    <p className="text-end font-body text-xs text-foreground/50">{note.length}/{NOTE_MAX}</p>
                  )}
                </div>

                {/* Totals + note about charges */}
                <div className="mb-5 rounded-lg bg-white p-4">
                  <p className="flex justify-between font-body text-base">
                    <span>{t("menuSubtotal")}</span>
                    <strong className="text-teal">{totalPrice} SAR</strong>
                  </p>
                  {isDelivery && (
                    <p className="mt-1.5 flex justify-between font-body text-sm text-foreground/65">
                      <span>{t("menuDeliveryFee")}</span>
                      <span>{t("menuDeliveryFeeValue")}</span>
                    </p>
                  )}
                  <p className="mt-3 flex gap-2 border-t border-foreground/10 pt-3 font-body text-xs leading-relaxed text-foreground/65">
                    <Info size={15} className="mt-0.5 shrink-0 text-gold" />
                    {isDelivery ? t("menuDeliveryNote") : t("menuPickupNote")}
                  </p>
                </div>

                {isDelivery && !canSend && (
                  <p className="mb-3 text-center font-body text-xs text-foreground/60">{t("menuAddressOrLocation")}</p>
                )}

                <div className="sticky -bottom-6 -mx-6 flex gap-2.5 border-t border-foreground/10 bg-cream px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
                  <button
                    onClick={() => setOrder({})}
                    className="flex items-center gap-1.5 rounded-lg border border-foreground/20 px-4 py-3 font-body text-sm text-foreground/70 hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 size={15} /> {t("clear")}
                  </button>
                  <button
                    onClick={sendOrder}
                    disabled={!canSend}
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
