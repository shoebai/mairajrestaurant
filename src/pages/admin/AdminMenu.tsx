import { useState } from "react"
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react"
import {
  useMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItem,
} from "@/lib/firestoreMenu"
import { uploadImage, deleteImageByUrl } from "@/lib/storage"

const emptyForm = {
  name: "",
  nameAr: "",
  desc: "",
  descAr: "",
  price: "",
  category: "",
  categoryAr: "",
  video: "",
  featured: false,
  images: [] as string[],
}

export default function AdminMenu() {
  const { items, loading } = useMenuItems()
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const categories = Array.from(new Set(items.map((i) => i.category))).filter(Boolean)

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (item: MenuItem) => {
    setEditing(item)
    setForm({
      name: item.name,
      nameAr: item.nameAr ?? "",
      desc: item.desc ?? "",
      descAr: item.descAr ?? "",
      price: item.price,
      category: item.category,
      categoryAr: item.categoryAr ?? "",
      video: item.video ?? "",
      featured: item.featured ?? false,
      images: item.images ?? [],
    })
    setShowForm(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const urls = await Promise.all(
        Array.from(files).map((f) => uploadImage(f, "menu-items"))
      )
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
      const data = {
        ...form,
        order: editing?.order ?? items.length,
      }
      if (editing) {
        await updateMenuItem(editing.id, data)
      } else {
        await addMenuItem(data)
      }
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return
    for (const url of item.images ?? []) {
      await deleteImageByUrl(url)
    }
    await deleteMenuItem(item.id)
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl mb-1">Menu Items</h1>
          <p className="font-body text-foreground/60 text-sm">{items.length} dishes</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-gold text-cream px-5 py-2.5 text-xs tracking-widest uppercase font-body hover:bg-gold/90 transition-colors"
        >
          <Plus size={16} /> Add Dish
        </button>
      </div>

      {loading ? (
        <p className="font-body text-foreground/50">Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white border border-foreground/10 p-4 rounded"
            >
              {item.images?.[0] ? (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-foreground/5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg truncate">{item.name}</p>
                <p className="font-body text-xs text-foreground/50">
                  {item.category} &middot; {item.price}
                  {item.featured && <span className="text-gold"> &middot; Featured</span>}
                </p>
              </div>
              <button
                onClick={() => openEdit(item)}
                className="p-2 text-foreground/50 hover:text-gold transition-colors"
                aria-label="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="p-2 text-foreground/50 hover:text-destructive transition-colors"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="font-body text-foreground/50 text-center py-12">
              No dishes yet. Add your first one, or use "Import Starter Data" to load your existing menu.
            </p>
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
              <h2 className="font-display text-2xl">{editing ? "Edit Dish" : "Add Dish"}</h2>
              <button onClick={() => setShowForm(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Name (English)">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Name (Arabic)">
                <input
                  value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
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

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price">
                  <input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Category">
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    list="categories"
                    className="admin-input"
                  />
                  <datalist id="categories">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
              </div>

              <Field label="Category (Arabic)">
                <input
                  value={form.categoryAr}
                  onChange={(e) => setForm({ ...form, categoryAr: e.target.value })}
                  dir="rtl"
                  className="admin-input"
                />
              </Field>

              <Field label="Video URL (optional)">
                <input
                  value={form.video}
                  onChange={(e) => setForm({ ...form, video: e.target.value })}
                  placeholder="/videos/dish.mp4"
                  className="admin-input"
                />
              </Field>

              <label className="flex items-center gap-2 font-body text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Feature on homepage
              </label>

              <Field label="Photos">
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
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
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
                disabled={saving || uploading || !form.name || !form.price}
                className="mt-2 bg-gold text-cream py-3 text-xs tracking-mega uppercase font-body hover:bg-gold/90 transition-colors disabled:opacity-40"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Dish"}
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
