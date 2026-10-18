import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2, RotateCcw } from "lucide-react"
import {
  useHeroSettings,
  updateHeroSettings,
  useHomeText,
  updateHomeText,
  HOME_TEXT_FIELDS,
  type HomeText,
  type HomeTextKey,
} from "@/lib/firestoreSite"
import { translate } from "@/lib/i18n"
import ImageUploader from "@/components/admin/ImageUploader"
import { Field, PageHeader, PrimaryButton } from "@/components/admin/AdminUI"
import hero1 from "@/assets/hero/hero-1.webp"
import hero2 from "@/assets/hero/hero-2.webp"
import hero3 from "@/assets/hero/hero-3.webp"

const defaults = [hero1, hero2, hero3]

/** The built-in wording each field falls back to when left empty. */
function defaultText(key: HomeTextKey, lang: "en" | "ar") {
  switch (key) {
    case "heroEyebrow":
      return translate("heritageEyebrow", lang)
    case "heroTitle":
      return translate("heritageTitle", lang)
    case "heroBody":
      return translate("heritageBody", lang)
    case "storyTitle":
      return `${translate("storyTitle", lang)} ${translate("storyTitleEmphasis", lang)}`
    default:
      return translate(key, lang)
  }
}

const sections = Array.from(new Set(HOME_TEXT_FIELDS.map((f) => f.section)))

export default function AdminHomepage() {
  const { hero, loading } = useHeroSettings()
  const { text: savedText, loading: textLoading } = useHomeText()

  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [savingPhotos, setSavingPhotos] = useState(false)

  const [text, setText] = useState<HomeText>({})
  const [savingText, setSavingText] = useState(false)

  useEffect(() => {
    if (!loading) setImages(hero.images)
  }, [loading, hero.images])

  useEffect(() => {
    if (!textLoading) setText(savedText)
  }, [textLoading, savedText])

  const onBusyChange = useCallback((b: boolean) => setUploading(b), [])
  const photosDirty = JSON.stringify(images) !== JSON.stringify(hero.images)
  const textDirty = JSON.stringify(text) !== JSON.stringify(savedText)

  const setField = (key: HomeTextKey, lang: "en" | "ar", value: string) =>
    setText((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: value } }))

  const resetField = (key: HomeTextKey) =>
    setText((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })

  const savePhotos = async () => {
    setSavingPhotos(true)
    try {
      await updateHeroSettings({ images })
      toast.success(images.length ? "Homepage photos updated" : "Back to the default photos")
    } catch {
      toast.error("Couldn't save. Check your connection and try again.")
    } finally {
      setSavingPhotos(false)
    }
  }

  const saveText = async () => {
    setSavingText(true)
    try {
      // Drop empty fields so they fall back to the built-in text.
      const clean: HomeText = {}
      Object.entries(text).forEach(([k, v]) => {
        const en = v?.en?.trim() ?? ""
        const ar = v?.ar?.trim() ?? ""
        if (en || ar) clean[k as HomeTextKey] = { en, ar }
      })
      await updateHomeText(clean)
      toast.success("Homepage text saved — it's live now")
    } catch {
      toast.error("Couldn't save. Check your connection and try again.")
    } finally {
      setSavingText(false)
    }
  }

  if (loading || textLoading) {
    return (
      <p className="flex items-center gap-2 font-body text-foreground/50">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </p>
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Homepage" subtitle="Change the slideshow photos and the headings and paragraphs on the homepage." />

      {/* Photos */}
      <section className="mb-8 flex flex-col gap-6 rounded-xl border border-foreground/10 bg-white p-5 md:p-6">
        <h2 className="font-display text-2xl">Slideshow photos</h2>
        <Field label="Photos in the arch at the top">
          <ImageUploader
            value={images}
            onChange={setImages}
            folder="homepage"
            onBusyChange={onBusyChange}
            hint="Photos change every 5 seconds. Taller photos (portrait or square) fit the arch best. 3–5 is ideal."
          />
        </Field>

        {images.length === 0 && (
          <div>
            <p className="mb-2 font-body text-sm text-foreground/60">No photos uploaded, so these default photos are showing:</p>
            <div className="grid grid-cols-3 gap-2">
              {defaults.map((src) => (
                <img key={src} src={src} alt="" className="aspect-video w-full rounded-md object-cover opacity-80" />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-foreground/10 pt-5">
          <PrimaryButton onClick={savePhotos} disabled={!photosDirty || savingPhotos || uploading}>
            {savingPhotos && <Loader2 size={16} className="animate-spin" />}
            {uploading ? "Waiting for photos…" : savingPhotos ? "Saving…" : "Save photos"}
          </PrimaryButton>
          {photosDirty && !savingPhotos && <span className="font-body text-sm text-foreground/55">Unsaved changes</span>}
        </div>
      </section>

      {/* Text */}
      <section className="flex flex-col gap-6 rounded-xl border border-foreground/10 bg-white p-5 md:p-6">
        <div>
          <h2 className="font-display text-2xl">Homepage text</h2>
          <p className="font-body text-sm text-foreground/60">
            The grey text in each box is what shows now. Type to replace it; leave a box empty to keep the default.
          </p>
        </div>

        {sections.map((section) => (
          <fieldset key={section} className="flex flex-col gap-5 border-t border-foreground/10 pt-5">
            <legend className="mb-1 font-body text-xs font-bold uppercase tracking-[0.15em] text-gold">{section}</legend>
            {HOME_TEXT_FIELDS.filter((f) => f.section === section).map((f) => {
              const value = text[f.key]
              const changed = !!(value?.en || value?.ar)
              return (
                <div key={f.key} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-body text-sm font-semibold text-foreground/80">{f.label}</span>
                    {changed && (
                      <button
                        type="button"
                        onClick={() => resetField(f.key)}
                        className="flex items-center gap-1 font-body text-xs font-semibold text-teal hover:underline"
                      >
                        <RotateCcw size={12} /> Use default
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(["en", "ar"] as const).map((lang) =>
                      f.multiline ? (
                        <textarea
                          key={lang}
                          dir={lang === "ar" ? "rtl" : "ltr"}
                          aria-label={`${f.label} (${lang === "en" ? "English" : "Arabic"})`}
                          value={value?.[lang] ?? ""}
                          onChange={(e) => setField(f.key, lang, e.target.value)}
                          placeholder={defaultText(f.key, lang)}
                          rows={f.key.endsWith("Body") ? 4 : 2}
                          className="admin-input resize-y placeholder:text-foreground/40"
                        />
                      ) : (
                        <input
                          key={lang}
                          dir={lang === "ar" ? "rtl" : "ltr"}
                          aria-label={`${f.label} (${lang === "en" ? "English" : "Arabic"})`}
                          value={value?.[lang] ?? ""}
                          onChange={(e) => setField(f.key, lang, e.target.value)}
                          placeholder={defaultText(f.key, lang)}
                          className="admin-input placeholder:text-foreground/40"
                        />
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </fieldset>
        ))}

        <div className="sticky bottom-0 -mx-5 flex items-center gap-3 border-t border-foreground/10 bg-white px-5 py-4 md:-mx-6 md:px-6">
          <PrimaryButton onClick={saveText} disabled={!textDirty || savingText}>
            {savingText && <Loader2 size={16} className="animate-spin" />}
            {savingText ? "Saving…" : "Save text"}
          </PrimaryButton>
          {textDirty && !savingText && <span className="font-body text-sm text-foreground/55">Unsaved changes</span>}
        </div>
      </section>
    </div>
  )
}
