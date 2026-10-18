import { useCallback, useState } from "react"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Loader2, Images, ChevronUp, ChevronDown } from "lucide-react"
import {
  useGallery,
  addGalleryEntry,
  updateGalleryEntry,
  deleteGalleryEntry,
  type GalleryEntry,
} from "@/lib/firestoreGallery"
import { optimizedImage } from "@/lib/storage"
import ImageUploader from "@/components/admin/ImageUploader"
import { AdminModal, BilingualRow, Field, PageHeader, PrimaryButton } from "@/components/admin/AdminUI"

const emptyForm = {
  title: "",
  titleAr: "",
  desc: "",
  descAr: "",
  images: [] as string[],
}

type Form = typeof emptyForm

export default function AdminGallery() {
  const { entries, loading } = useGallery()
  const [editing, setEditing] = useState<GalleryEntry | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Form>(emptyForm)
  const [initial, setInitial] = useState<Form>(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const open = (entry: GalleryEntry | null) => {
    const f: Form = entry
      ? {
          title: entry.title,
          titleAr: entry.titleAr ?? "",
          desc: entry.desc ?? "",
          descAr: entry.descAr ?? "",
          images: entry.images ?? [],
        }
      : emptyForm
    setEditing(entry)
    setForm(f)
    setInitial(f)
    setShowForm(true)
  }

  const onBusyChange = useCallback((b: boolean) => setUploading(b), [])
  const dirty = JSON.stringify(form) !== JSON.stringify(initial)

  const handleSave = async () => {
    setSaving(true)
    try {
      const maxOrder = entries.reduce((m, e) => Math.max(m, e.order ?? 0), -1)
      const data = { ...form, order: editing?.order ?? maxOrder + 1 }
      if (editing) {
        await updateGalleryEntry(editing.id, data)
        toast.success(`Saved "${form.title}"`)
      } else {
        await addGalleryEntry(data)
        toast.success(`Added "${form.title}" to the gallery`)
      }
      setShowForm(false)
    } catch {
      toast.error("Couldn't save. Check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (entry: GalleryEntry) => {
    if (!confirm(`Delete the album "${entry.title}" and remove its photos from the website?`)) return
    try {
      await deleteGalleryEntry(entry.id)
      toast.success(`Deleted "${entry.title}"`)
    } catch {
      toast.error("Couldn't delete. Try again.")
    }
  }

  // Swap positions with the neighbour — the first album is shown largest.
  const move = async (index: number, dir: -1 | 1) => {
    const a = entries[index]
    const b = entries[index + dir]
    if (!a || !b) return
    try {
      await Promise.all([
        updateGalleryEntry(a.id, { order: b.order ?? index + dir }),
        updateGalleryEntry(b.id, { order: a.order ?? index }),
      ])
    } catch {
      toast.error("Couldn't reorder. Try again.")
    }
  }

  return (
    <div>
      <PageHeader
        title="Gallery"
        subtitle="Each album shows as one tile on the homepage. Albums with several photos play as a slideshow."
        action={
          <PrimaryButton onClick={() => open(null)}>
            <Plus size={18} /> New album
          </PrimaryButton>
        }
      />

      {loading ? (
        <p className="flex items-center gap-2 font-body text-foreground/50">
          <Loader2 size={16} className="animate-spin" /> Loading gallery…
        </p>
      ) : entries.length === 0 ? (
        <button
          onClick={() => open(null)}
          className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-foreground/20 bg-white py-14 text-center transition-colors hover:border-gold"
        >
          <Images size={32} className="text-gold" />
          <span className="font-display text-2xl">Create your first album</span>
          <span className="max-w-sm font-body text-sm text-foreground/60">
            Upload photos of the dining room, the kitchen, or your best dishes. The gallery appears on
            the homepage once it has at least one album.
          </span>
        </button>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry, i) => (
            <li key={entry.id} className="overflow-hidden rounded-xl border border-foreground/10 bg-white">
              <button onClick={() => open(entry)} className="relative block aspect-[4/3] w-full bg-foreground/5">
                {entry.images?.[0] ? (
                  <img src={optimizedImage(entry.images[0], 600)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center font-body text-sm text-foreground/40">
                    No photos yet
                  </span>
                )}
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded bg-saffron px-2 py-0.5 font-body text-[11px] font-bold text-ink">
                    Shown largest
                  </span>
                )}
                {(entry.images?.length ?? 0) > 0 && (
                  <span className="absolute bottom-2 right-2 rounded bg-black/65 px-2 py-0.5 font-body text-[11px] text-white">
                    {entry.images.length} {entry.images.length === 1 ? "photo" : "photos"}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-1 p-3">
                <p className="min-w-0 flex-1 truncate font-display text-lg">{entry.title}</p>
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move earlier"
                  className="rounded p-1.5 text-foreground/45 hover:text-gold disabled:opacity-25"
                >
                  <ChevronUp size={17} />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === entries.length - 1}
                  aria-label="Move later"
                  className="rounded p-1.5 text-foreground/45 hover:text-gold disabled:opacity-25"
                >
                  <ChevronDown size={17} />
                </button>
                <button onClick={() => open(entry)} aria-label="Edit album" className="rounded p-1.5 text-foreground/45 hover:text-gold">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(entry)} aria-label="Delete album" className="rounded p-1.5 text-foreground/45 hover:text-destructive">
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <AdminModal
          title={editing ? "Edit album" : "New album"}
          onClose={() => setShowForm(false)}
          dirty={dirty}
          footer={
            <PrimaryButton
              onClick={handleSave}
              disabled={saving || uploading || !form.title.trim() || form.images.length === 0}
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {uploading ? "Waiting for photos…" : saving ? "Saving…" : editing ? "Save changes" : "Create album"}
            </PrimaryButton>
          }
        >
          <Field label="Photos">
            <ImageUploader
              value={form.images}
              onChange={(images) => setForm((f) => ({ ...f, images }))}
              folder="gallery"
              onBusyChange={onBusyChange}
              hint="You can select many photos at once. Use the arrows to change their order."
            />
          </Field>

          <BilingualRow>
            <Field label="Album title (English)">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="admin-input"
                placeholder="Our dining room"
              />
            </Field>
            <Field label="Album title (Arabic)">
              <input
                value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                dir="rtl"
                className="admin-input"
              />
            </Field>
          </BilingualRow>

          <BilingualRow>
            <Field label="Caption (English)" hint="Optional">
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                rows={2}
                className="admin-input resize-none"
              />
            </Field>
            <Field label="Caption (Arabic)" hint="Optional">
              <textarea
                value={form.descAr}
                onChange={(e) => setForm({ ...form, descAr: e.target.value })}
                rows={2}
                dir="rtl"
                className="admin-input resize-none"
              />
            </Field>
          </BilingualRow>
        </AdminModal>
      )}
    </div>
  )
}
