import { useEffect, useState } from "react"
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore"
import { db } from "./firebase"

export interface MenuItem {
  id: string
  name: string
  nameAr?: string
  desc?: string
  descAr?: string
  price: string
  category: string
  categoryAr?: string
  video?: string
  images?: string[]
  featured?: boolean
  order?: number
}

const menuCol = collection(db, "menuItems")

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(menuCol, orderBy("order", "asc"))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuItem))
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [])

  return { items, loading }
}

export async function addMenuItem(data: Omit<MenuItem, "id">) {
  await addDoc(menuCol, data)
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>) {
  await updateDoc(doc(db, "menuItems", id), data)
}

export async function deleteMenuItem(id: string) {
  await deleteDoc(doc(db, "menuItems", id))
}
