import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Images, Loader2, RotateCcw } from "lucide-react"
import {
  useHeroSettings,
  updateHeroSettings,
  useHomeText,
  updateHomeText,
  HOME_TEXT_FIELDS,
  useWatermark,
  updateWatermark,
  WATERMARK_SECTIONS,
  type HomeText,
  type HomeTextKey,
  type WatermarkSettings,
} from "@/lib/firestoreSite"
import { WatermarkImage } from "@/sections/Watermark"
import { translate } from "@/lib/i18n"
import ImageUploader from "@/components/admin/ImageUploader"
import PhotoPicker from "@/components/admin/PhotoPicker"
import { Field, PageHeader, PrimaryButton, Toggle } from "@/components/admin/AdminUI"
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
  const [pickerOpen, setPickerOpen] = useState(false)

  const [text, setText] = useState<HomeText>({})
  const [savingText, setSavingText] = useState(false)

  const { watermark: savedMark, loading: markLoading } = useWatermark()
  const [mark, setMark] = useState<WatermarkSettings>(savedMark)
  const [markUploading, setMarkUploading] = useState(false)
  const [savingMark, setSavingMark] = useState(false)
  useEffect(() => {
    if (!markLoading) setMark(savedMark)
  }, [markLoading, savedMark])
  const markDirty = JSON.stringify(mark) !== JSON.stringify(savedMark)
  const onMarkBusy = useCallback((b: boolean) => setMarkUploading(b), [])
  const setM = (patch: Partial<WatermarkSettings>) => setMark((m) => ({ ...m, ...patch }))

  const saveMark = async () => {
    setSavingMark(true)
    try {
      await updateWatermark(mark)
      toast.success(mark.enabled ? "Watermark updated — it's live now" : "Watermark turned off")
    } catch {
      toast.error("Couldn't save. Check your connection and try again.")
    } finally {
      setSavingMark(false)
    }
  }

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

  if (loading || textLoading || markLoading) {
    return (
      <p className="flex items-center gap-2 font-body text-foreground/50">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </p>
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Homepage" subtitle="Change the slideshow photos, the background watermark, and the headings on the homepage." />

      {/* Photos */}
      <section className="mb-8 flex flex-col gap-6 rounded-xl border border-foreground/10 bg-white p-5 md:p-6">
        <h2 className="font-display text-2xl">Slideshow photos</h2>
        <Field label="Photos in the arch at the top">
          <ImageUploader
            value={images}
            onChange={setImages}
            folder="homepage"
            onBusyChange={onBusyChange}
            hint="Upload as many as you like. Each photo is fitted to the arch automatically. Photos change every 5 seconds and visitors can swipe."
          />
        </Field>

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg border border-teal py-3 font-body text-sm font-semibold text-teal transition-colors hover:bg-teal/5"
        >
          <Images size={17} /> Add photos from Menu or Gallery
        </button>

        {pickerOpen && (
          <PhotoPicker
            selected={images}
            onClose={() => setPickerOpen(false)}
            onDone={(urls) => {
              setImages(urls)
              setPickerOpen(false)
            }}
          />
        )}

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

      {/* Watermark */}
      <section className="mb-8 flex flex-col gap-5 rounded-xl border border-foreground/10 bg-white p-5 md:p-6">
        <div>
          <h2 className="font-display text-2xl">Background watermark</h2>
          <p className="font-body text-sm text-foreground/60">
            A faint picture behind some homepage sections, like the Mairaj logo or a drawing of a biryani pot.
          </p>
        </div>

        <Toggle checked={mark.enabled} onChange={(enabled) => setM({ enabled })} label="Show watermark" description="Turn off any time to hide it." />

        {mark.enabled && (
          <>
            <div className="flex flex-col gap-2">
              <span className="font-body text-sm font-semibold text-foreground/80">Picture</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setM({ image: "" })}
                  className={`rounded-full border px-4 py-2 font-body text-sm font-semibold ${
                    !mark.image ? "border-teal bg-teal text-cream" : "border-foreground/20 hover:border-teal"
                  }`}
                >
                  Mairaj logo
                </button>
                <span className="self-center font-body text-sm text-foreground/50">or upload your own:</span>
              </div>
              <ImageUploader
                value={mark.image ? [mark.image] : []}
                onChange={(urls) => setM({ image: urls[0] ?? "" })}
                folder="watermark"
                multiple={false}
                onBusyChange={onMarkBusy}
                hint="Best: a PNG with a transparent background, or a simple drawing on white (white areas disappear)."
              />
            </div>

            <label className="flex flex-col gap-2">
              <span className="flex justify-between font-body text-sm font-semibold text-foreground/80">
                Strength <span className="font-normal text-foreground/55">{Math.round(mark.opacity * 100)}%</span>
              </span>
              <input
                type="range"
                min={2}
                max={25}
                value={Math.round(mark.opacity * 100)}
                onChange={(e) => setM({ opacity: Number(e.target.value) / 100 })}
                className="accent-[hsl(182_69%_18%)]"
              />
              <span className="font-body text-xs text-foreground/50">Keep it faint (5–10%) so text stays easy to read.</span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="font-body text-sm font-semibold text-foreground/80">Size</span>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setM({ size })}
                      className={`flex-1 rounded-md border py-2 font-body text-sm capitalize ${
                        mark.size === size ? "border-teal bg-teal text-cream" : "border-foreground/20 hover:border-teal"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-body text-sm font-semibold text-foreground/80">Position</span>
                <div className="flex gap-2">
                  {(["left", "center", "right"] as const).map((position) => (
                    <button
                      key={position}
                      type="button"
                      onClick={() => setM({ position })}
                      className={`flex-1 rounded-md border py-2 font-body text-sm capitalize ${
                        mark.position === position ? "border-teal bg-teal text-cream" : "border-foreground/20 hover:border-teal"
                      }`}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-body text-sm font-semibold text-foreground/80">Show behind</span>
              <div className="flex flex-wrap gap-2">
                {WATERMARK_SECTIONS.map((sec) => {
                  const on = mark.sections.includes(sec.id)
                  return (
                    <label
                      key={sec.id}
                      className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-body text-sm ${
                        on ? "border-teal bg-teal/10" : "border-foreground/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          setM({ sections: on ? mark.sections.filter((x) => x !== sec.id) : [...mark.sections, sec.id] })
                        }
                        className="accent-[hsl(182_69%_18%)]"
                      />
                      {sec.label}
                    </label>
                  )
                })}
              </div>
            </div>

            <Toggle
              checked={mark.monochrome}
              onChange={(monochrome) => setM({ monochrome })}
              label="Single colour"
              description="Tints the picture to match the site instead of showing its own colours."
            />

            <div className="flex flex-col gap-2">
              <span className="font-body text-sm font-semibold text-foreground/80">Preview</span>
              <div className="relative h-56 overflow-hidden rounded-lg border border-foreground/10 bg-cream">
                <WatermarkImage settings={mark} />
                <div className="relative z-[1] flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                  <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-gold">From the tandoor & the kadai</p>
                  <p className="font-display text-3xl">Dishes guests come back for</p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-3 border-t border-foreground/10 pt-5">
          <PrimaryButton onClick={saveMark} disabled={!markDirty || savingMark || markUploading}>
            {savingMark && <Loader2 size={16} className="animate-spin" />}
            {markUploading ? "Waiting for picture…" : savingMark ? "Saving…" : "Save watermark"}
          </PrimaryButton>
          {markDirty && !savingMark && <span className="font-body text-sm text-foreground/55">Unsaved changes</span>}
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
