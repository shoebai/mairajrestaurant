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

// ── Homepage text ──────────────────────────────────────────────────────
// Lets the admin replace the homepage headings and paragraphs without
// touching code. Any field left empty falls back to the built-in text.

export const HOME_TEXT_FIELDS = [
  { key: "heroEyebrow", section: "Top of the page", label: "Small line above the heading", multiline: false },
  { key: "heroTitle", section: "Top of the page", label: "Big heading", multiline: true },
  { key: "heroBody", section: "Top of the page", label: "Paragraph under the heading", multiline: true },
  { key: "favouritesTitle", section: "Favourite dishes", label: "Heading", multiline: false },
  { key: "biryaniTitle", section: "Biryani house", label: "Heading", multiline: false },
  { key: "biryaniBody", section: "Biryani house", label: "Paragraph", multiline: true },
  { key: "storyEyebrow", section: "Our story", label: "Small line above the heading", multiline: false },
  { key: "storyTitle", section: "Our story", label: "Heading", multiline: true },
  { key: "storyBody", section: "Our story", label: "Paragraph", multiline: true },
] as const

export type HomeTextKey = (typeof HOME_TEXT_FIELDS)[number]["key"]
export type HomeText = Partial<Record<HomeTextKey, { en?: string; ar?: string }>>

const homeTextRef = doc(db, "site", "homeText")

export function useHomeText() {
  const [text, setText] = useState<HomeText>({})
  const [loading, setLoading] = useState(true)

  useEffect(
    () =>
      onSnapshot(
        homeTextRef,
        (snap) => {
          setText((snap.data() as HomeText | undefined) ?? {})
          setLoading(false)
        },
        () => setLoading(false)
      ),
    []
  )

  /** The admin's text for this key and language, or "" if they left it empty. */
  const get = (key: HomeTextKey, lang: "en" | "ar") => text[key]?.[lang]?.trim() ?? ""

  return { text, get, loading }
}

export async function updateHomeText(data: HomeText) {
  await setDoc(homeTextRef, data)
}

// ── Watermark ──────────────────────────────────────────────────────────
// A faint background picture (the Mairaj logo or any uploaded image, e.g.
// a biryani pot drawing) behind chosen homepage sections.

export const WATERMARK_SECTIONS = [
  { id: "favourites", label: "Favourite dishes" },
  { id: "biryani", label: "Biryani house" },
  { id: "story", label: "Our story" },
] as const

export type WatermarkSection = (typeof WATERMARK_SECTIONS)[number]["id"]

export interface WatermarkSettings {
  enabled: boolean
  /** Uploaded image URL; empty means the Mairaj logo. */
  image: string
  /** 0.02 – 0.25 */
  opacity: number
  size: "small" | "medium" | "large"
  position: "left" | "center" | "right"
  sections: WatermarkSection[]
  /** Show in a single faded colour instead of full colour. */
  monochrome: boolean
}

export const DEFAULT_WATERMARK: WatermarkSettings = {
  enabled: false,
  image: "",
  opacity: 0.07,
  size: "large",
  position: "right",
  sections: ["favourites", "story"],
  monochrome: true,
}

const watermarkRef = doc(db, "site", "watermark")

export function useWatermark() {
  const [watermark, setWatermark] = useState<WatermarkSettings>(DEFAULT_WATERMARK)
  const [loading, setLoading] = useState(true)

  useEffect(
    () =>
      onSnapshot(
        watermarkRef,
        (snap) => {
          setWatermark({ ...DEFAULT_WATERMARK, ...(snap.data() as Partial<WatermarkSettings> | undefined) })
          setLoading(false)
        },
        () => setLoading(false)
      ),
    []
  )

  return { watermark, loading }
}

export async function updateWatermark(data: WatermarkSettings) {
  await setDoc(watermarkRef, data)
}
