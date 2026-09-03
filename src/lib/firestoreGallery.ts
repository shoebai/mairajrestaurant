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

export interface GalleryEntry {
  id: string
  title: string
  titleAr?: string
  desc?: string
  descAr?: string
  images: string[]
  order?: number
}

const galleryCol = collection(db, "gallery")

export function useGallery() {
  const [entries, setEntries] = useState<GalleryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(galleryCol, orderBy("order", "asc"))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryEntry))
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [])

  return { entries, loading }
}

export async function addGalleryEntry(data: Omit<GalleryEntry, "id">) {
  await addDoc(galleryCol, data)
}

export async function updateGalleryEntry(id: string, data: Partial<GalleryEntry>) {
  await updateDoc(doc(db, "gallery", id), data)
}

export async function deleteGalleryEntry(id: string) {
  await deleteDoc(doc(db, "gallery", id))
}
