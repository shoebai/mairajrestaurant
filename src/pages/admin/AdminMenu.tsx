import { useCallback, useMemo, useState } from "react"
import { useSearchParams } from "react-router"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Search, Camera, Star, Loader2 } from "lucide-react"
import {
  useMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItem,
} from "@/lib/firestoreMenu"
import { optimizedImage } from "@/lib/storage"
import ImageUploader from "@/components/admin/ImageUploader"
import {
  AdminModal,
  BilingualRow,
  Field,
  PageHeader,
  PrimaryButton,
  Toggle,
} from "@/components/admin/AdminUI"

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

type Form = typeof emptyForm

function toForm(item: MenuItem): Form {
  return {
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
  }
}

export default function AdminMenu() {
  const { items, loading } = useMenuItems()
  const [params, setParams] = useSearchParams()
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Form>(emptyForm)
  const [initial, setInitial] = useState<Form>(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")

  const category = params.get("category") ?? ""
  const noPhotoOnly = params.get("filter") === "no-photo"

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).filter(Boolean),
    [items]
  )

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((i) => {
      if (category && i.category !== category) return false
      if (noPhotoOnly && i.images?.length) return false
      if (!q) return true
      return (
        i.name.toLowerCase().includes(q) ||
        (i.nameAr ?? "").includes(q) ||
        i.category.toLowerCase().includes(q)
      )
    })
  }, [items, search, category, noPhotoOnly])

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const open = (item: MenuItem | null) => {
    const f = item ? toForm(item) : { ...emptyForm, category: category || "" }
    if (!item && category) {
      f.categoryAr = items.find((i) => i.category === category)?.categoryAr ?? ""
    }
    setEditing(item)
    setForm(f)
    setInitial(f)
    setShowForm(true)
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(initial)
  const onBusyChange = useCallback((b: boolean) => setUploading(b), [])

  // When an existing category is typed, fill in its Arabic name automatically.
  const setCategory = (value: string) => {
    const match = items.find((i) => i.category === value)
    setForm((f) => ({
      ...f,
      category: value,
      categoryAr: match?.categoryAr && !f.categoryAr ? match.categoryAr : f.categoryAr,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = { ...form, order: editing?.order ?? items.length }
      if (editing) {
        await updateMenuItem(editing.id, data)
        toast.success(`Saved "${form.name}"`)
      } else {
        await addMenuItem(data)
        toast.success(`Added "${form.name}" to the menu`)
      }
      setShowForm(false)
    } catch {
      toast.error("Couldn't save. Check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Delete "${item.name}" from the menu? This can't be undone.`)) return
    try {
      await deleteMenuItem(item.id)
      toast.success(`Deleted "${item.name}"`)
    } catch {
      toast.error("Couldn't delete. Check your connection and try again.")
    }
  }

  const toggleFeatured = async (item: MenuItem) => {
    try {
      await updateMenuItem(item.id, { featured: !item.featured })
      toast.success(item.featured ? `Removed "${item.name}" from homepage` : `"${item.name}" is now on the homepage`)
    } catch {
      toast.error("Couldn't update. Try again.")
    }
  }

  return (
    <div>
      <PageHeader
        title="Menu"
        subtitle={`${items.length} dishes · tap a dish to edit it or add photos`}
        action={
          <PrimaryButton onClick={() => open(null)}>
            <Plus size={18} /> Add dish
          </PrimaryButton>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes"
            className="admin-input !pl-9"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setFilter("category", e.target.value)}
          className="admin-input sm:w-56"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={() => setFilter("filter", noPhotoOnly ? "" : "no-photo")}
          className={`inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 font-body text-sm transition-colors ${
            noPhotoOnly ? "border-gold bg-gold/10 text-foreground" : "border-foreground/15 bg-white text-foreground/70 hover:border-gold"
          }`}
        >
          <Camera size={16} /> Needs a photo
        </button>
      </div>

      {loading ? (
        <p className="flex items-center gap-2 font-body text-foreground/50">
          <Loader2 size={16} className="animate-spin" /> Loading menu…
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-foreground/10 bg-white p-2.5 pr-2 sm:gap-4 sm:p-3"
            >
              <button
                onClick={() => open(item)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
              >
                {item.images?.[0] ? (
                  <img
                    src={optimizedImage(item.images[0], 160)}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md border border-dashed border-foreground/20 text-foreground/35">
                    <Camera size={16} />
                    <span className="font-body text-[9px]">Add photo</span>
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg leading-tight">{item.name}</span>
                  <span className="block truncate font-body text-xs text-foreground/55">
                    {item.category} · {item.price} SAR
                    {(item.images?.length ?? 0) > 1 && ` · ${item.images!.length} photos`}
                  </span>
                </span>
              </button>
              <button
                onClick={() => toggleFeatured(item)}
                title={item.featured ? "Shown on homepage" : "Show on homepage"}
                aria-label={item.featured ? "Remove from homepage" : "Show on homepage"}
                className={`rounded-md p-2 transition-colors ${item.featured ? "text-gold" : "text-foreground/25 hover:text-gold"}`}
              >
                <Star size={18} fill={item.featured ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => open(item)}
                aria-label={`Edit ${item.name}`}
                className="hidden rounded-md p-2 text-foreground/50 transition-colors hover:text-gold sm:block"
              >
                <Pencil size={17} />
              </button>
              <button
                onClick={() => handleDelete(item)}
                aria-label={`Delete ${item.name}`}
                className="rounded-md p-2 text-foreground/40 transition-colors hover:text-destructive"
              >
                <Trash2 size={17} />
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="rounded-lg border border-dashed border-foreground/20 py-12 text-center font-body text-foreground/60">
              No dishes yet. Add your first one, or use “Import starter menu” to load the existing menu.
            </li>
          )}
          {items.length > 0 && visible.length === 0 && (
            <li className="py-10 text-center font-body text-foreground/60">
              No dishes match. Try a different search or category.
            </li>
          )}
        </ul>
      )}

      {showForm && (
        <AdminModal
          title={editing ? "Edit dish" : "Add a dish"}
          onClose={() => setShowForm(false)}
          dirty={dirty}
          footer={
            <PrimaryButton
              onClick={handleSave}
              disabled={saving || uploading || !form.name.trim() || !form.price.trim()}
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {uploading ? "Waiting for photos…" : saving ? "Saving…" : editing ? "Save changes" : "Add dish"}
            </PrimaryButton>
          }
        >
          <Field label="Photos">
            <ImageUploader
              value={form.images}
              onChange={(images) => setForm((f) => ({ ...f, images }))}
              folder="menu-items"
              onBusyChange={onBusyChange}
              hint="The first photo is shown on the menu. Add more and guests can swipe through them."
            />
          </Field>

          <BilingualRow>
            <Field label="Dish name (English)">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="admin-input"
                placeholder="Chicken Biryani"
              />
            </Field>
            <Field label="Dish name (Arabic)">
              <input
                value={form.nameAr}
                onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                dir="rtl"
                className="admin-input"
                placeholder="برياني دجاج"
              />
            </Field>
          </BilingualRow>

          <BilingualRow>
            <Field label="Price (SAR)">
              <input
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                inputMode="decimal"
                className="admin-input"
                placeholder="20"
              />
            </Field>
            <Field label="Category" hint="Pick an existing one or type a new name.">
              <input
                value={form.category}
                onChange={(e) => setCategory(e.target.value)}
                list="menu-categories"
                className="admin-input"
              />
              <datalist id="menu-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
          </BilingualRow>

          <Field label="Category (Arabic)">
            <input
              value={form.categoryAr}
              onChange={(e) => setForm({ ...form, categoryAr: e.target.value })}
              dir="rtl"
              className="admin-input"
            />
          </Field>

          <BilingualRow>
            <Field label="Short description (English)" hint="Optional">
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                rows={2}
                className="admin-input resize-none"
              />
            </Field>
            <Field label="Short description (Arabic)" hint="Optional">
              <textarea
                value={form.descAr}
                onChange={(e) => setForm({ ...form, descAr: e.target.value })}
                rows={2}
                dir="rtl"
                className="admin-input resize-none"
              />
            </Field>
          </BilingualRow>

          <Toggle
            checked={form.featured}
            onChange={(featured) => setForm({ ...form, featured })}
            label="Show on homepage"
            description="Featured dishes appear in “A few house favourites”."
          />

          <Field label="Video link" hint="Optional. A link to an .mp4 video of this dish.">
            <input
              value={form.video}
              onChange={(e) => setForm({ ...form, video: e.target.value })}
              placeholder="https://…/dish.mp4"
              className="admin-input"
            />
          </Field>
        </AdminModal>
      )}
    </div>
  )
}
