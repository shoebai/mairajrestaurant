import { useEffect, useState } from "react"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { db } from "./firebase"

// Site-wide settings that the admin can change, e.g. the homepage photos.
export interface HeroSettings {
  images: string[]
}

const heroRef = doc(db, "site", "hero")

export function useHeroSettings() {
  const [hero, setHero] = useState<HeroSettings>({ images: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      heroRef,
      (snap) => {
        const data = snap.data() as Partial<HeroSettings> | undefined
        setHero({ images: data?.images ?? [] })
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [])

  return { hero, loading }
}

export async function updateHeroSettings(data: HeroSettings) {
  await setDoc(heroRef, data, { merge: true })
}
