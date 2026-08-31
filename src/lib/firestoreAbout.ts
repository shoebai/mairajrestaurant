import { useEffect, useState } from "react"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface AboutContent {
  story: string
  storyAr?: string
  services: string
  servicesAr?: string
  staff: string
  staffAr?: string
  catering: string
  cateringAr?: string
  location: string
  locationAr?: string
  phone?: string
  email?: string
  hours?: string
}

const defaultAbout: AboutContent = {
  story: "",
  services: "",
  staff: "",
  catering: "",
  location: "",
}

const aboutRef = doc(db, "about", "main")

export function useAbout() {
  const [about, setAbout] = useState<AboutContent>(defaultAbout)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      aboutRef,
      (snap) => {
        if (snap.exists()) {
          setAbout({ ...defaultAbout, ...(snap.data() as AboutContent) })
        }
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [])

  return { about, loading }
}

export async function updateAbout(data: Partial<AboutContent>) {
  await setDoc(aboutRef, data, { merge: true })
}
