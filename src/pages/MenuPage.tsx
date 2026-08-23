import { useState, useMemo } from "react"
import { Play, X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import Navbar from "@/sections/Navbar"
import Footer from "@/sections/Footer"
import { menu, categories, type MenuItem } from "@/lib/menuData"
import { useT, useLanguage } from "@/lib/i18n"
import { RESTAURANT_WHATSAPP } from "@/lib/config"

type Order = Record<string, number>

export default function MenuPage() {
  const [activeVideo, setActiveVideo] = useState<MenuItem | null>(null)
  const [order, setOrder] = useState<Order>({})
  const [cartOpen, setCartOpen] = useState(false)
  const t = useT()
  const { lang } = useLanguage()

  const totalItems = useMemo(
    () => Object.values(order).reduce((sum, qty) => sum + qty, 0),
    [order]
  )

  const addItem = (name: string) =>
    setOrder((o) => ({ ...o, [name]: (o[name] ?? 0) + 1 }))

  const removeItem = (name: string) =>
    setOrder((o) => {
      const next = { ...o }
      if (!next[name]) return next
      next[name] -= 1
      if (next[name] <= 0) delete next[name]
      return next
    })

  const clearOrder = () => setOrder({})

  const sendOrder = () => {
    const lines = Object.entries(order).map(([name, qty]) => {
      const item = menu.find((m) => m.name === name)
      const label = lang === "ar" && item?.nameAr ? item.nameAr : name
      return `${qty}x ${label} — ${item?.price ?? ""}`
    })
    const message =
      lang === "ar"
        ? `طلب جديد عبر الموقع\n${lines.join("\n")}`
        : `New Order via Website\n${lines.join("\n")}`

    const url = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <>
      <Navbar />

      <main className="bg-cream min-h-screen pt-36 pb-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
              {t("fullMenuEyebrow")}
            </p>
            <h1 className="font-display text-4xl md:text-5xl">{t("fullMenuTitle")}</h1>
          </div>

          {categories.map((category) => {
            const items = menu.filter((item) => item.category === category)
            const categoryLabel =
              lang === "ar" && items[0]?.categoryAr ? items[0].categoryAr : category

            return (
              <div key={category} className="mb-16">
                <h2 className="font-display italic text-2xl text-brown mb-8 text-center">
                  {categoryLabel}
                </h2>

                <div className="flex flex-col gap-6">
                  {items.map((item) => {
                    const name = lang === "ar" && item.nameAr ? item.nameAr : item.name
                    const desc = lang === "ar" && item.descAr ? item.descAr : item.desc
                    const qty = order[item.name] ?? 0

                    return (
                      <div key={item.name} className="flex items-baseline gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-xl">{name}</h3>
                            {item.video && (
                              <button
                                onClick={() => setActiveVideo(item)}
                                aria-label={`Watch ${item.name} video`}
                                className="text-gold hover:text-brown transition-colors"
                              >
                                <Play size={16} fill="currentColor" />
                              </button>
                            )}
                          </div>
                          <p className="font-body text-foreground/60 text-sm mt-1">
                            {desc}
                          </p>
                        </div>
                        <span className="menu-dots" />
                        <span className="font-display text-lg text-gold shrink-0">
                          {item.price}
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          {qty > 0 && (
                            <>
                              <button
                                onClick={() => removeItem(item.name)}
                                aria-label="Decrease quantity"
                                className="w-6 h-6 flex items-center justify-center border border-foreground/20 text-foreground/60 hover:border-gold hover:text-gold transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-body text-sm w-4 text-center">
                                {qty}
                              </span>
                            </>
                          )}
                          <button
                            onClick={() => addItem(item.name)}
                            aria-label={t("addToOrder")}
                            className="w-6 h-6 flex items-center justify-center bg-gold text-cream hover:bg-gold/90 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Floating order button */}
      {totalItems > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gold text-cream rounded-full shadow-lg px-6 py-4 flex items-center gap-2 font-body text-sm tracking-wide hover:bg-gold/90 transition-colors"
        >
          <ShoppingBag size={18} />
          {t("yourOrder")} ({totalItems})
        </button>
      )}

      {/* Order drawer */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-end md:items-center justify-center"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="bg-cream w-full md:max-w-md md:rounded-t-none rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl">{t("yourOrder")}</h3>
              <button onClick={() => setCartOpen(false)} aria-label="Close">
                <X size={22} />
              </button>
            </div>

            {totalItems === 0 ? (
              <p className="font-body text-foreground/50 text-center py-8">
                {t("emptyOrder")}
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-4 mb-6">
                  {Object.entries(order).map(([name, qty]) => {
                    const item = menu.find((m) => m.name === name)
                    const label = lang === "ar" && item?.nameAr ? item.nameAr : name
                    return (
                      <div key={name} className="flex items-center justify-between">
                        <div>
                          <p className="font-display text-lg">{label}</p>
                          <p className="font-body text-xs text-foreground/50">
                            {item?.price} &times; {qty}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeItem(name)}
                            className="w-7 h-7 flex items-center justify-center border border-foreground/20 hover:border-gold hover:text-gold transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-body text-sm w-4 text-center">{qty}</span>
                          <button
                            onClick={() => addItem(name)}
                            className="w-7 h-7 flex items-center justify-center bg-gold text-cream hover:bg-gold/90 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={clearOrder}
                    className="flex items-center gap-1.5 border border-foreground/20 text-foreground/60 px-4 py-3 text-xs tracking-widest uppercase font-body hover:border-destructive hover:text-destructive transition-colors"
                  >
                    <Trash2 size={14} /> {t("clear")}
                  </button>
                  <button
                    onClick={sendOrder}
                    className="flex-1 bg-gold text-cream py-3 text-xs tracking-mega uppercase font-body hover:bg-gold/90 transition-colors"
                  >
                    {t("orderViaWhatsApp")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              className="absolute -top-10 right-0 text-cream hover:text-gold"
            >
              <X size={24} />
            </button>
            <video src={activeVideo.video} controls autoPlay className="w-full rounded" />
            <p className="font-display italic text-cream text-center mt-4">
              {lang === "ar" && activeVideo.nameAr ? activeVideo.nameAr : activeVideo.name}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
