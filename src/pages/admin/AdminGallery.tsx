import { useState } from "react"
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react"
import {
  useGallery,
  addGalleryEntry,
  updateGalleryEntry,
  deleteGalleryEntry,
  type GalleryEntry,
} from "@/lib/firestoreGallery"
import { uploadImage, deleteImageByUrl } from "@/lib/storage"

const emptyForm = {
  title: "",
  titleAr: "",
  desc: "",
  descAr: "",
  images: [] as string[],
}

export default function AdminGallery() {
  const { entries, loading } = useGallery()
  const [editing, setEditing] = useState<GalleryEntry | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (entry: GalleryEntry) => {
    setEditing(entry)
    setForm({
      title: entry.title,
      titleAr: entry.titleAr ?? "",
      desc: entry.desc ?? "",
      descAr: entry.descAr ?? "",
      images: entry.images ?? [],
    })
    setShowForm(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadImage(f, "gallery")))
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }))
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const removeImage = (url: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = { ...form, order: editing?.order ?? entries.length }
      if (editing) {
        await updateGalleryEntry(editing.id, data)
      } else {
        await addGalleryEntry(data)
      }
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (entry: GalleryEntry) => {
    if (!confirm(`Delete "${entry.title}"?`)) return
    for (const url of entry.images ?? []) {
      await deleteImageByUrl(url)
    }
    await deleteGalleryEntry(entry.id)
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl mb-1">Gallery</h1>
          <p className="font-body text-foreground/60 text-sm">{entries.length} entries</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-gold text-cream px-5 py-2.5 text-xs tracking-widest uppercase font-body hover:bg-gold/90 transition-colors"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {loading ? (
        <p className="font-body text-foreground/50">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white border border-foreground/10 rounded overflow-hidden">
              <div className="aspect-video bg-foreground/5 relative">
                {entry.images?.[0] && (
                  <img src={entry.images[0]} className="w-full h-full object-cover" />
                )}
                {entry.images?.length > 1 && (
                  <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-cream text-[10px] px-1.5 py-0.5 rounded">
                    {entry.images.length} photos
                  </span>
                )}
              </div>
              <div className="p-3 flex items-center justify-between">
                <p className="font-display truncate">{entry.title}</p>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(entry)} className="p-1.5 text-foreground/50 hover:text-gold">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(entry)} className="p-1.5 text-foreground/50 hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="font-body text-foreground/50 text-center py-12 col-span-full">No gallery entries yet.</p>
          )}
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-cream w-full max-w-lg rounded-lg p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">{editing ? "Edit Entry" : "Add Entry"}</h2>
              <button onClick={() => setShowForm(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Title (English)">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Title (Arabic)">
                <input
                  value={form.titleAr}
                  onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                  dir="rtl"
                  className="admin-input"
                />
              </Field>
              <Field label="Description (English)">
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  rows={2}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label="Description (Arabic)">
                <textarea
                  value={form.descAr}
                  onChange={(e) => setForm({ ...form, descAr: e.target.value })}
                  rows={2}
                  dir="rtl"
                  className="admin-input resize-none"
                />
              </Field>

              <Field label="Photos (multiple = auto-slideshow)">
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.images.map((url) => (
                    <div key={url} className="relative w-16 h-16">
                      <img src={url} className="w-full h-full object-cover rounded" />
                      <button
                        onClick={() => removeImage(url)}
                        className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 border border-dashed border-foreground/30 rounded px-4 py-3 cursor-pointer hover:border-gold transition-colors w-fit">
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span className="font-body text-sm">
                    {uploading ? "Uploading..." : "Upload photo(s)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </Field>

              <button
                onClick={handleSave}
                disabled={saving || uploading || !form.title}
                className="mt-2 bg-gold text-cream py-3 text-xs tracking-mega uppercase font-body hover:bg-gold/90 transition-colors disabled:opacity-40"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-body text-xs tracking-widest uppercase text-foreground/50 block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
