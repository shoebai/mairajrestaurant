import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useHeroSettings, updateHeroSettings } from "@/lib/firestoreSite"
import ImageUploader from "@/components/admin/ImageUploader"
import { Field, PageHeader, PrimaryButton } from "@/components/admin/AdminUI"
import hero1 from "@/assets/hero/hero-1.webp"
import hero2 from "@/assets/hero/hero-2.webp"
import hero3 from "@/assets/hero/hero-3.webp"

const defaults = [hero1, hero2, hero3]

export default function AdminHomepage() {
  const { hero, loading } = useHeroSettings()
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading) setImages(hero.images)
  }, [loading, hero.images])

  const onBusyChange = useCallback((b: boolean) => setUploading(b), [])
  const dirty = JSON.stringify(images) !== JSON.stringify(hero.images)

  const save = async () => {
    setSaving(true)
    try {
      await updateHeroSettings({ images })
      toast.success(images.length ? "Homepage photos updated" : "Back to the default photos")
    } catch {
      toast.error("Couldn't save. Check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 font-body text-foreground/50">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </p>
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Homepage photos"
        subtitle="The large slideshow at the very top of the website. Photos change every 5 seconds."
      />

      <div className="flex flex-col gap-6 rounded-xl border border-foreground/10 bg-white p-5 md:p-6">
        <Field label="Slideshow photos">
          <ImageUploader
            value={images}
            onChange={setImages}
            folder="homepage"
            onBusyChange={onBusyChange}
            hint="Use wide, landscape photos (at least 1600 px wide). Text sits on top of them, so calm photos with a darker area work best. 3–5 photos is ideal."
          />
        </Field>

        {images.length === 0 && (
          <div>
            <p className="mb-2 font-body text-sm text-foreground/60">
              No photos uploaded, so the website is showing these default photos:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {defaults.map((src) => (
                <img key={src} src={src} alt="" className="aspect-video w-full rounded-md object-cover opacity-80" />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-foreground/10 pt-5">
          <PrimaryButton onClick={save} disabled={!dirty || saving || uploading}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {uploading ? "Waiting for photos…" : saving ? "Saving…" : "Save changes"}
          </PrimaryButton>
          {dirty && !saving && <span className="font-body text-sm text-foreground/55">Unsaved changes</span>}
        </div>
      </div>
    </div>
  )
}
