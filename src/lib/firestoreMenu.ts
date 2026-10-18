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
  writeBatch,
  setDoc,
  arrayUnion,
  arrayRemove,
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

// Firestore allows up to 500 writes per batch; stay well under it.
const BATCH_SIZE = 400

/** Adds many dishes quickly, in a few large writes instead of one by one. */
export async function addMenuItemsBatch(
  list: Omit<MenuItem, "id">[],
  onProgress?: (done: number) => void
) {
  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch = writeBatch(db)
    list.slice(i, i + BATCH_SIZE).forEach((data) => batch.set(doc(menuCol), data))
    await batch.commit()
    onProgress?.(Math.min(i + BATCH_SIZE, list.length))
  }
}

/** Applies updates and deletions together, in batches. */
export async function updateAndDeleteMenuItems(
  updates: { id: string; data: Partial<MenuItem> }[],
  deleteIds: string[]
) {
  const ops = [
    ...updates.map((u) => ({ kind: "update" as const, ...u })),
    ...deleteIds.map((id) => ({ kind: "delete" as const, id })),
  ]
  for (let i = 0; i < ops.length; i += BATCH_SIZE) {
    const batch = writeBatch(db)
    ops.slice(i, i + BATCH_SIZE).forEach((op) => {
      const ref = doc(db, "menuItems", op.id)
      if (op.kind === "update") batch.update(ref, op.data)
      else batch.delete(ref)
    })
    await batch.commit()
  }
}

/**
 * Dishes are matched by name, ignoring capitals, spaces and punctuation, so
 * "Chicken Tikka (6pcs)" and "chicken tikka 6 pcs" count as the same dish.
 */
export const menuKey = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, " ").trim()

// Remembers dishes the admin deleted on purpose, so "Import menu" doesn't
// offer to add them back.
const importLogRef = doc(db, "site", "importLog")

export function useDeletedDishKeys() {
  const [keys, setKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(
    () =>
      onSnapshot(
        importLogRef,
        (snap) => {
          setKeys((snap.data()?.deleted as string[] | undefined) ?? [])
          setLoading(false)
        },
        () => setLoading(false)
      ),
    []
  )
  return { keys, loading }
}

export async function rememberDeletedDish(name: string) {
  await setDoc(importLogRef, { deleted: arrayUnion(menuKey(name)) }, { merge: true })
}

export async function forgetDeletedDishes(names: string[]) {
  if (names.length === 0) return
  await setDoc(importLogRef, { deleted: arrayRemove(...names.map(menuKey)) }, { merge: true })
}
