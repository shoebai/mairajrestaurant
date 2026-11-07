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

export interface WatermarkMark {
  id: string
  /** Uploaded image URL; empty means the Mairaj logo. */
  image: string
  position: "left" | "center" | "right"
  vertical: "top" | "middle" | "bottom"
  size: "small" | "medium" | "large"
}

export interface WatermarkSettings {
  enabled: boolean
  /** Up to 3 pictures, each with its own place and size. */
  marks: WatermarkMark[]
  /** 0.02 – 0.25, shared by all pictures */
  opacity: number
  sections: WatermarkSection[]
  /** Show in a single faded colour instead of full colour. */
  monochrome: boolean
}

export const MAX_WATERMARKS = 3

export const newWatermarkMark = (position: WatermarkMark["position"] = "right"): WatermarkMark => ({
  id: Math.random().toString(36).slice(2, 9),
  image: "",
  position,
  vertical: "middle",
  size: "large",
})

export const DEFAULT_WATERMARK: WatermarkSettings = {
  enabled: false,
  marks: [{ ...newWatermarkMark("right"), id: "m1" }],
  opacity: 0.07,
  sections: ["favourites", "story"],
  monochrome: true,
}

/** Older saved settings had one picture; turn them into the list form. */
function normaliseWatermark(raw: Record<string, unknown> | undefined): WatermarkSettings {
  if (!raw) return DEFAULT_WATERMARK
  const merged = { ...DEFAULT_WATERMARK, ...(raw as Partial<WatermarkSettings>) }
  if (!Array.isArray(raw.marks)) {
    merged.marks = [
      {
        id: "m1",
        image: (raw.image as string) ?? "",
        position: (raw.position as WatermarkMark["position"]) ?? "right",
        vertical: "middle",
        size: (raw.size as WatermarkMark["size"]) ?? "large",
      },
    ]
  }
  return merged
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
          setWatermark(normaliseWatermark(snap.data() as Record<string, unknown> | undefined))
          setLoading(false)
        },
        () => setLoading(false)
      ),
    []
  )

  return { watermark, loading }
}

export async function updateWatermark(data: WatermarkSettings) {
  // Save the list form only (drops the old single-picture fields).
  const { enabled, marks, opacity, sections, monochrome } = data
  await setDoc(watermarkRef, { enabled, marks, opacity, sections, monochrome })
}

// ── How offers appear on the homepage ──────────────────────────────────

export interface OffersDisplay {
  /** "cards" = a grid of offer cards; "banner" = a slowly sliding strip. */
  layout: "cards" | "banner"
  /** Which way the banner moves across the screen. */
  direction: "to-left" | "to-right"
  speed: "slow" | "medium" | "fast"
  /** Where on the homepage the offers appear. */
  placement: "after-hero" | "after-favourites" | "after-story" | "bottom"
}

export const OFFER_PLACEMENTS: { id: OffersDisplay["placement"]; label: string }[] = [
  { id: "after-hero", label: "Right below the top photo" },
  { id: "after-favourites", label: "After favourite dishes" },
  { id: "after-story", label: "After our story" },
  { id: "bottom", label: "Near the bottom (before Find us)" },
]

export const DEFAULT_OFFERS_DISPLAY: OffersDisplay = {
  layout: "cards",
  direction: "to-left",
  speed: "slow",
  placement: "after-story",
}

const offersDisplayRef = doc(db, "site", "offersDisplay")

export function useOffersDisplay() {
  const [display, setDisplay] = useState<OffersDisplay>(DEFAULT_OFFERS_DISPLAY)
  const [loading, setLoading] = useState(true)
  useEffect(
    () =>
      onSnapshot(
        offersDisplayRef,
        (snap) => {
          setDisplay({ ...DEFAULT_OFFERS_DISPLAY, ...(snap.data() as Partial<OffersDisplay> | undefined) })
          setLoading(false)
        },
        () => setLoading(false)
      ),
    []
  )
  return { display, loading }
}

export async function updateOffersDisplay(data: OffersDisplay) {
  await setDoc(offersDisplayRef, data)
}

// ── Background behind the title at the top of the Menu and About pages ──

export type BannerPage = "menu" | "about"

export interface BannerSettings {
  /** plain = teal only; photo = a photo with a teal tint; watermark = faint picture */
  mode: "plain" | "photo" | "watermark"
  /** Photo or watermark picture URL. Empty watermark = Mairaj logo. */
  image: string
  /** Photo mode: how strong the teal tint is (0.35 – 0.9). */
  tint: number
  /** Watermark mode: how visible the picture is (0.05 – 0.4). */
  strength: number
  position: "left" | "center" | "right"
}

export const DEFAULT_BANNER: BannerSettings = {
  mode: "plain",
  image: "",
  tint: 0.7,
  strength: 0.15,
  position: "right",
}

export type BannerSettingsMap = Record<BannerPage, BannerSettings>

const bannersRef = doc(db, "site", "pageBanners")

export function usePageBanners() {
  const [banners, setBanners] = useState<BannerSettingsMap>({ menu: DEFAULT_BANNER, about: DEFAULT_BANNER })
  const [loading, setLoading] = useState(true)
  useEffect(
    () =>
      onSnapshot(
        bannersRef,
        (snap) => {
          const data = (snap.data() ?? {}) as Partial<Record<BannerPage, Partial<BannerSettings>>>
          setBanners({
            menu: { ...DEFAULT_BANNER, ...data.menu },
            about: { ...DEFAULT_BANNER, ...data.about },
          })
          setLoading(false)
        },
        () => setLoading(false)
      ),
    []
  )
  return { banners, loading }
}

export async function updatePageBanners(data: BannerSettingsMap) {
  await setDoc(bannersRef, data)
}
