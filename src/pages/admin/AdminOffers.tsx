import { useState } from "react"
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react"
import { useOffers, addOffer, updateOffer, deleteOffer, type Offer } from "@/lib/firestoreOffers"
import { uploadImage, deleteImageByUrl } from "@/lib/storage"

const emptyForm = {
  title: "",
  titleAr: "",
  desc: "",
  descAr: "",
  priceText: "",
  image: "",
  active: true,
}

export default function AdminOffers() {
  const { offers, loading } = useOffers()
  const [editing, setEditing] = useState<Offer | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (offer: Offer) => {
    setEditing(offer)
    setForm({
      title: offer.title,
      titleAr: offer.titleAr ?? "",
      desc: offer.desc ?? "",
      descAr: offer.descAr ?? "",
      priceText: offer.priceText ?? "",
      image: offer.image ?? "",
      active: offer.active,
    })
    setShowForm(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, "offers")
      setForm((f) => ({ ...f, image: url }))
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = { ...form, order: editing?.order ?? offers.length }
      if (editing) {
        await updateOffer(editing.id, data)
      } else {
        await addOffer(data)
      }
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (offer: Offer) => {
    if (!confirm(`Delete "${offer.title}"?`)) return
    if (offer.image) await deleteImageByUrl(offer.image)
    await deleteOffer(offer.id)
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl mb-1">Offers</h1>
          <p className="font-body text-foreground/60 text-sm">{offers.length} offers</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-gold text-cream px-5 py-2.5 text-xs tracking-widest uppercase font-body hover:bg-gold/90 transition-colors"
        >
          <Plus size={16} /> Add Offer
        </button>
      </div>

      {loading ? (
        <p className="font-body text-foreground/50">Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="flex items-center gap-4 bg-white border border-foreground/10 p-4 rounded"
            >
              {offer.image ? (
                <img src={offer.image} className="w-12 h-12 rounded object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded bg-foreground/5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg truncate">{offer.title}</p>
                <p className="font-body text-xs text-foreground/50">
                  {offer.priceText}
                  {!offer.active && <span className="text-destructive"> &middot; Inactive</span>}
                </p>
              </div>
              <button onClick={() => openEdit(offer)} className="p-2 text-foreground/50 hover:text-gold">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(offer)} className="p-2 text-foreground/50 hover:text-destructive">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {offers.length === 0 && (
            <p className="font-body text-foreground/50 text-center py-12">No offers yet.</p>
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
              <h2 className="font-display text-2xl">{editing ? "Edit Offer" : "Add Offer"}</h2>
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
              <Field label="Price / Discount text">
                <input
                  value={form.priceText}
                  onChange={(e) => setForm({ ...form, priceText: e.target.value })}
                  placeholder="e.g. 20% off, or 49 SAR"
                  className="admin-input"
                />
              </Field>

              <label className="flex items-center gap-2 font-body text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                Active (shown on site)
              </label>

              <Field label="Image">
                {form.image && (
                  <img src={form.image} className="w-24 h-24 object-cover rounded mb-3" />
                )}
                <label className="flex items-center gap-2 border border-dashed border-foreground/30 rounded px-4 py-3 cursor-pointer hover:border-gold transition-colors w-fit">
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span className="font-body text-sm">
                    {uploading ? "Uploading..." : form.image ? "Replace photo" : "Upload photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
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
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Offer"}
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
