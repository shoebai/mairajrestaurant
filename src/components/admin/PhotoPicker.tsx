import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useMenuItems } from "@/lib/firestoreMenu"
import { useGallery } from "@/lib/firestoreGallery"
import { optimizedImage } from "@/lib/storage"
import { AdminModal, PrimaryButton } from "@/components/admin/AdminUI"

interface PhotoPickerProps {
  /** Photos already chosen; picking toggles a photo in or out of this list. */
  selected: string[]
  onDone: (urls: string[]) => void
  onClose: () => void
}

/**
 * Pick photos that are already on the site (dish photos and gallery albums)
 * without uploading them again.
 */
export default function PhotoPicker({ selected, onDone, onClose }: PhotoPickerProps) {
  const { items } = useMenuItems()
  const { entries } = useGallery()
  const [picked, setPicked] = useState<string[]>(selected)
  const [tab, setTab] = useState<"menu" | "gallery">("menu")
  const [search, setSearch] = useState("")

  const dishPhotos = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items
      .filter((i) => i.images?.length && (!q || i.name.toLowerCase().includes(q) || (i.nameAr ?? "").includes(search.trim())))
      .flatMap((i) => (i.images ?? []).map((url) => ({ url, label: i.name })))
  }, [items, search])

  const galleryPhotos = useMemo(
    () => entries.flatMap((e) => (e.images ?? []).map((url) => ({ url, label: e.title }))),
    [entries]
  )

  const list = tab === "menu" ? dishPhotos : galleryPhotos
  const added = picked.filter((u) => !selected.includes(u)).length

  const toggle = (url: string) =>
    setPicked((p) => (p.includes(url) ? p.filter((u) => u !== url) : [...p, url]))

  return (
    <AdminModal
      title="Choose photos"
      onClose={onClose}
      dirty={JSON.stringify(picked) !== JSON.stringify(selected)}
      footer={
        <PrimaryButton onClick={() => onDone(picked)}>
          Use {picked.length} photo{picked.length === 1 ? "" : "s"}
          {added > 0 && ` (+${added})`}
        </PrimaryButton>
      }
    >
      <p className="font-body text-sm text-foreground/60">
        Tap photos to add them to the slideshow, tap again to remove. Numbers show the order they'll appear in.
      </p>

      <div className="flex gap-2">
        {(
          [
            ["menu", `Dish photos (${dishPhotos.length})`],
            ["gallery", `Gallery (${galleryPhotos.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 rounded-md border py-2.5 font-body text-sm font-semibold ${
              tab === key ? "border-teal bg-teal text-cream" : "border-foreground/20 hover:border-teal"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "menu" && (
        <label className="relative block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <span className="sr-only">Search dishes</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes"
            className="admin-input !pl-9"
          />
        </label>
      )}

      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed border-foreground/20 py-10 text-center font-body text-sm text-foreground/55">
          {tab === "menu"
            ? search
              ? "No dish photos match your search."
              : "No dish photos yet. Add photos to dishes in Menu first."
            : "No gallery photos yet. Add an album in Gallery first."}
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {list.map(({ url, label }) => {
            const index = picked.indexOf(url)
            const on = index !== -1
            return (
              <li key={url}>
                <button
                  type="button"
                  onClick={() => toggle(url)}
                  aria-pressed={on}
                  className={`relative block aspect-square w-full overflow-hidden rounded-lg ring-offset-2 transition ${
                    on ? "ring-[3px] ring-teal" : "ring-1 ring-foreground/10 hover:ring-teal/50"
                  }`}
                >
                  <img src={optimizedImage(url, 300)} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1 pt-4 text-left font-body text-[11px] text-white">
                    {label}
                  </span>
                  {on && (
                    <span className="absolute right-1.5 top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-teal px-1 font-body text-xs font-bold text-cream">
                      {index + 1}
                    </span>
                  )}
                  {!on && (
                    <span className="absolute right-1.5 top-1.5 h-6 w-6 rounded-full border-2 border-white bg-black/30" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </AdminModal>
  )
}
