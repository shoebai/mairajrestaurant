import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

/** Dish name → quantity. Shared by the homepage and the menu page. */
export type OrderMap = Record<string, number>

interface CartValue {
  order: OrderMap
  totalItems: number
  addItem: (name: string) => void
  removeItem: (name: string) => void
  clear: () => void
}

const CartContext = createContext<CartValue | null>(null)
const STORAGE_KEY = "mairaj-cart"

function load(): OrderMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as OrderMap) : {}
  } catch {
    return {}
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<OrderMap>(load)

  // Keep the cart if the visitor refreshes or comes back later.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
    } catch {
      // Private browsing etc. — the cart still works for this visit.
    }
  }, [order])

  const value: CartValue = {
    order,
    totalItems: Object.values(order).reduce((n, q) => n + q, 0),
    addItem: (name) => setOrder((o) => ({ ...o, [name]: (o[name] ?? 0) + 1 })),
    removeItem: (name) =>
      setOrder((o) => {
        if (!o[name]) return o
        const next = { ...o }
        next[name] -= 1
        if (next[name] <= 0) delete next[name]
        return next
      }),
    clear: () => setOrder({}),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
