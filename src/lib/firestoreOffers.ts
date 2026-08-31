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

export interface Offer {
  id: string
  title: string
  titleAr?: string
  desc?: string
  descAr?: string
  priceText?: string
  image?: string
  active: boolean
  order?: number
}

const offersCol = collection(db, "offers")

export function useOffers(activeOnly = false) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(offersCol, orderBy("order", "asc"))
    const unsub = onSnapshot(
      q,
      (snap) => {
        let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Offer)
        if (activeOnly) data = data.filter((o) => o.active)
        setOffers(data)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [activeOnly])

  return { offers, loading }
}

export async function addOffer(data: Omit<Offer, "id">) {
  await addDoc(offersCol, data)
}

export async function updateOffer(id: string, data: Partial<Offer>) {
  await updateDoc(doc(db, "offers", id), data)
}

export async function deleteOffer(id: string) {
  await deleteDoc(doc(db, "offers", id))
}
