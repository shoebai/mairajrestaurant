import { useCallback, useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Loader2, Tag } from "lucide-react"
import { useOffers, addOffer, updateOffer, deleteOffer, type Offer } from "@/lib/firestoreOffers"
import { optimizedImage } from "@/lib/storage"
import ImageUploader from "@/components/admin/ImageUploader"
import { AdminModal, BilingualRow, Field, PageHeader, PrimaryButton, Toggle } from "@/components/admin/AdminUI"

const emptyForm = {
  title: "",
  titleAr: "",
  desc: "",
  descAr: "",
  priceText: "",
  image: "",
  active: true,
}

type Form = typeof emptyForm

export default function AdminOffers() {
  const { offers, loading } = useOffers()
  const [editing, setEditing] = useState<Offer | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Form>(emptyForm)
  const [initial, setInitial] = useState<Form>(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const open = (offer: Offer | null) => {
    const f: Form = offer
      ? {
          title: offer.title,
          titleAr: offer.titleAr ?? "",
          desc: offer.desc ?? "",
          descAr: offer.descAr ?? "",
          priceText: offer.priceText ?? "",
          image: offer.image ?? "",
          active: offer.active,
        }
      : emptyForm
    setEditing(offer)
    setForm(f)
    setInitial(f)
    setShowForm(true)
  }

  const onBusyChange = useCallback((b: boolean) => setUploading(b), [])
  const dirty = JSON.stringify(form) !== JSON.stringify(initial)

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = { ...form, order: editing?.order ?? offers.length }
      if (editing) {
        await updateOffer(editing.id, data)
        toast.success(`Saved "${form.title}"`)
      } else {
        await addOffer(data)
        toast.success(form.active ? `"${form.title}" is now live` : `Saved "${form.title}" as hidden`)
      }
      setShowForm(false)
    } catch {
      toast.error("Couldn't save. Check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (offer: Offer) => {
    if (!confirm(`Delete the offer "${offer.title}"?`)) return
    try {
      await deleteOffer(offer.id)
      toast.success(`Deleted "${offer.title}"`)
    } catch {
      toast.error("Couldn't delete. Try again.")
    }
  }

  const toggleActive = async (offer: Offer) => {
    try {
      await updateOffer(offer.id, { active: !offer.active })
      toast.success(offer.active ? `"${offer.title}" is hidden` : `"${offer.title}" is now live`)
    } catch {
      toast.error("Couldn't update. Try again.")
    }
  }

  return (
    <div>
      <PageHeader
        title="Offers"
        subtitle="Live offers appear on the homepage. Hide an offer to keep it for later."
        action={
          <PrimaryButton onClick={() => open(null)}>
            <Plus size={18} /> New offer
          </PrimaryButton>
        }
      />

      {loading ? (
        <p className="flex items-center gap-2 font-body text-foreground/50">
          <Loader2 size={16} className="animate-spin" /> Loading offers…
        </p>
      ) : offers.length === 0 ? (
        <button
          onClick={() => open(null)}
          className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-foreground/20 bg-white py-14 text-center transition-colors hover:border-gold"
        >
          <Tag size={30} className="text-gold" />
          <span className="font-display text-2xl">Create your first offer</span>
          <span className="max-w-sm font-body text-sm text-foreground/60">
            A family meal deal, a weekend discount, a Ramadan iftar menu — add a photo and it shows on the homepage.
          </span>
        </button>
      ) : (
        <ul className="flex flex-col gap-2">
          {offers.map((offer) => (
            <li key={offer.id} className="flex items-center gap-3 rounded-lg border border-foreground/10 bg-white p-2.5 sm:p-3">
              <button onClick={() => open(offer)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                {offer.image ? (
                  <img src={optimizedImage(offer.image, 200)} alt="" className="h-14 w-20 shrink-0 rounded-md object-cover" />
                ) : (
                  <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-foreground/5 text-foreground/30">
                    <Tag size={18} />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-display text-lg leading-tight">{offer.title}</span>
                  <span className="block truncate font-body text-xs text-foreground/55">{offer.priceText || "No price text"}</span>
                </span>
              </button>
              <button
                onClick={() => toggleActive(offer)}
                className={`shrink-0 rounded-full px-3 py-1 font-body text-xs font-medium transition-colors ${
                  offer.active ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-foreground/10 text-foreground/60 hover:bg-foreground/15"
                }`}
              >
                {offer.active ? "Live" : "Hidden"}
              </button>
              <button
                onClick={() => handleDelete(offer)}
                aria-label={`Delete ${offer.title}`}
                className="rounded-md p-2 text-foreground/40 hover:text-destructive"
              >
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <AdminModal
          title={editing ? "Edit offer" : "New offer"}
          onClose={() => setShowForm(false)}
          dirty={dirty}
          footer={
            <PrimaryButton onClick={handleSave} disabled={saving || uploading || !form.title.trim()}>
              {saving && <Loader2 size={16} className="animate-spin" />}
              {uploading ? "Waiting for photo…" : saving ? "Saving…" : editing ? "Save changes" : "Create offer"}
            </PrimaryButton>
          }
        >
          <Field label="Photo">
            <ImageUploader
              value={form.image ? [form.image] : []}
              onChange={(urls) => setForm((f) => ({ ...f, image: urls[0] ?? "" }))}
              folder="offers"
              multiple={false}
              onBusyChange={onBusyChange}
              hint="A wide (landscape) photo works best."
            />
          </Field>

          <BilingualRow>
            <Field label="Offer title (English)">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="admin-input"
                placeholder="Family biryani feast"
              />
            </Field>
            <Field label="Offer title (Arabic)">
              <input
                value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                dir="rtl"
                className="admin-input"
              />
            </Field>
          </BilingualRow>

          <BilingualRow>
            <Field label="Details (English)" hint="Optional">
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                rows={2}
                className="admin-input resize-none"
              />
            </Field>
            <Field label="Details (Arabic)" hint="Optional">
              <textarea
                value={form.descAr}
                onChange={(e) => setForm({ ...form, descAr: e.target.value })}
                rows={2}
                dir="rtl"
                className="admin-input resize-none"
              />
            </Field>
          </BilingualRow>

          <Field label="Price or discount">
            <input
              value={form.priceText}
              onChange={(e) => setForm({ ...form, priceText: e.target.value })}
              placeholder="e.g. 20% off, or 49 SAR"
              className="admin-input"
            />
          </Field>

          <Toggle
            checked={form.active}
            onChange={(active) => setForm({ ...form, active })}
            label="Show on the website"
            description="Turn off to hide this offer without deleting it."
          />
        </AdminModal>
      )}
    </div>
  )
}
