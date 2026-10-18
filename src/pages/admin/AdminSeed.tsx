import { useMemo, useState } from "react"
import { toast } from "sonner"
import { CheckCircle2, Copy, Loader2, PackagePlus } from "lucide-react"
import { menu as starterMenu } from "@/lib/menuData"
import {
  useMenuItems,
  useDeletedDishKeys,
  addMenuItemsBatch,
  updateAndDeleteMenuItems,
  forgetDeletedDishes,
  menuKey as keyOf,
  type MenuItem,
} from "@/lib/firestoreMenu"
import { PageHeader, PrimaryButton } from "@/components/admin/AdminUI"

/** Which copy of a duplicated dish to keep: the one with the most work in it. */
function score(item: MenuItem) {
  return (
    (item.images?.length ?? 0) * 100 +
    (item.featured ? 10 : 0) +
    (item.desc ? 2 : 0) +
    (item.video ? 2 : 0) +
    (item.nameAr ? 1 : 0)
  )
}

export default function AdminSeed() {
  const { items, loading } = useMenuItems()
  const { keys: deletedKeys, loading: logLoading } = useDeletedDishKeys()
  const [busy, setBusy] = useState<"" | "import" | "dedupe">("")
  const [showRemoved, setShowRemoved] = useState(false)
  const [progress, setProgress] = useState(0)

  const existingKeys = useMemo(() => new Set(items.map((i) => keyOf(i.name))), [items])

  // Category and price aren't compared, so a dish you've edited is still
  // recognised and never imported twice.
  const notInMenu = useMemo(
    () => starterMenu.filter((d) => !existingKeys.has(keyOf(d.name))),
    [existingKeys]
  )
  const deletedSet = useMemo(() => new Set(deletedKeys), [deletedKeys])
  const missing = notInMenu.filter((d) => !deletedSet.has(keyOf(d.name)))
  const removedByYou = notInMenu.filter((d) => deletedSet.has(keyOf(d.name)))

  // Groups of 2+ dishes in the database with the same name.
  const duplicateGroups = useMemo(() => {
    const groups = new Map<string, MenuItem[]>()
    items.forEach((i) => {
      const k = keyOf(i.name)
      groups.set(k, [...(groups.get(k) ?? []), i])
    })
    return Array.from(groups.values()).filter((g) => g.length > 1)
  }, [items])

  const extraCopies = duplicateGroups.reduce((n, g) => n + g.length - 1, 0)

  const handleImport = async (list = missing) => {
    if (list.length === 0) return
    if (!confirm(`Add ${list.length} dish${list.length === 1 ? "" : "es"} that aren't in your menu yet?`)) return

    setBusy("import")
    setProgress(0)
    try {
      const startOrder = items.reduce((m, i) => Math.max(m, i.order ?? 0), -1) + 1
      await addMenuItemsBatch(
        list.map((d, i) => ({
          name: d.name,
          nameAr: d.nameAr ?? "",
          desc: d.desc ?? "",
          descAr: d.descAr ?? "",
          price: d.price,
          category: d.category,
          categoryAr: d.categoryAr ?? "",
          video: d.video ?? "",
          images: [],
          featured: d.featured ?? false,
          order: startOrder + i,
        })),
        setProgress
      )
      await forgetDeletedDishes(list.map((d) => d.name)).catch(() => {})
      toast.success(`Added ${list.length} dishes to your menu`)
    } catch {
      toast.error("Import stopped partway. Check your connection and press the button again — it only adds what's still missing.")
    } finally {
      setBusy("")
    }
  }

  const handleDedupe = async () => {
    if (
      !confirm(
        `Remove ${extraCopies} duplicate cop${extraCopies === 1 ? "y" : "ies"}?\n\nFor each dish, the copy with the most photos and details is kept. Photos from the removed copies are moved onto the kept one, so nothing you uploaded is lost.`
      )
    )
      return

    setBusy("dedupe")
    try {
      const updates: { id: string; data: Partial<MenuItem> }[] = []
      const deleteIds: string[] = []

      duplicateGroups.forEach((group) => {
        const sorted = [...group].sort((a, b) => score(b) - score(a) || (a.order ?? 0) - (b.order ?? 0))
        const [keep, ...extras] = sorted

        const images = Array.from(new Set(sorted.flatMap((i) => i.images ?? [])))
        const featured = sorted.some((i) => i.featured)
        const changed = images.length !== (keep.images?.length ?? 0) || featured !== !!keep.featured
        if (changed) updates.push({ id: keep.id, data: { images, featured } })

        deleteIds.push(...extras.map((e) => e.id))
      })

      await updateAndDeleteMenuItems(updates, deleteIds)
      toast.success(`Removed ${deleteIds.length} duplicate cop${deleteIds.length === 1 ? "y" : "ies"}`)
    } catch {
      toast.error("Couldn't finish cleaning up. Check your connection and try again.")
    } finally {
      setBusy("")
    }
  }

  if (loading || logLoading) {
    return (
      <p className="flex items-center gap-2 font-body text-foreground/50">
        <Loader2 size={16} className="animate-spin" /> Checking your menu…
      </p>
    )
  }

  const stats = [
    { label: "Dishes in the website code", value: starterMenu.length },
    { label: "Dishes in your admin menu", value: items.length },
    { label: "Duplicate copies", value: extraCopies, warn: extraCopies > 0 },
  ]

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Import menu"
        subtitle="Copies the original menu saved in the website code into the admin panel. Safe to use any time: dishes you already have are skipped, never added twice."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border p-4 ${s.warn ? "border-amber-300 bg-amber-50" : "border-foreground/10 bg-white"}`}
          >
            <p className={`font-display text-3xl ${s.warn ? "text-amber-800" : ""}`}>{s.value}</p>
            <p className="font-body text-sm text-foreground/60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Step 1: clean up duplicates from earlier imports */}
      {duplicateGroups.length > 0 && (
        <section className="mb-5 rounded-xl border border-amber-300 bg-white p-5 md:p-6">
          <div className="mb-3 flex items-start gap-3">
            <Copy size={20} className="mt-0.5 shrink-0 text-amber-700" />
            <div>
              <h2 className="font-display text-2xl">Some dishes appear more than once</h2>
              <p className="font-body text-sm text-foreground/65">
                This usually happens when the old import button was pressed more than once. Guests see these
                dishes twice on the menu.
              </p>
            </div>
          </div>

          <ul className="mb-5 flex flex-wrap gap-2">
            {duplicateGroups.slice(0, 18).map((g) => (
              <li key={g[0].id} className="rounded-full bg-amber-50 px-3 py-1 font-body text-sm text-amber-900">
                {g[0].name} <strong>×{g.length}</strong>
              </li>
            ))}
            {duplicateGroups.length > 18 && (
              <li className="px-1 py-1 font-body text-sm text-foreground/55">
                and {duplicateGroups.length - 18} more
              </li>
            )}
          </ul>

          <PrimaryButton onClick={handleDedupe} disabled={!!busy}>
            {busy === "dedupe" && <Loader2 size={16} className="animate-spin" />}
            {busy === "dedupe" ? "Removing…" : `Remove ${extraCopies} duplicate${extraCopies === 1 ? "" : "s"}`}
          </PrimaryButton>
          <p className="mt-2 font-body text-xs text-foreground/50">
            Keeps the copy with photos. Photos on the removed copies are moved to the kept one.
          </p>
        </section>
      )}

      {/* Step 2: add only what's missing */}
      <section className="rounded-xl border border-foreground/10 bg-white p-5 md:p-6">
        {missing.length === 0 ? (
          <div className="flex items-start gap-3">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600" />
            <div>
              <h2 className="font-display text-2xl">Everything is imported</h2>
              <p className="font-body text-sm text-foreground/65">
                All {starterMenu.length} dishes from the website code are already in your menu. There's nothing to add.
                From now on, add and edit dishes in <strong>Menu</strong>.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-start gap-3">
              <PackagePlus size={20} className="mt-0.5 shrink-0 text-teal" />
              <div>
                <h2 className="font-display text-2xl">
                  {missing.length} dish{missing.length === 1 ? "" : "es"} not in your menu yet
                </h2>
                <p className="font-body text-sm text-foreground/65">
                  Only these will be added. Dishes you already have, including ones you've renamed in Arabic or
                  repriced, are left exactly as they are.
                </p>
              </div>
            </div>

            <ul className="mb-5 flex flex-wrap gap-2">
              {missing.slice(0, 18).map((d) => (
                <li key={d.name} className="rounded-full bg-cream px-3 py-1 font-body text-sm">
                  {d.name}
                </li>
              ))}
              {missing.length > 18 && (
                <li className="px-1 py-1 font-body text-sm text-foreground/55">and {missing.length - 18} more</li>
              )}
            </ul>

            <PrimaryButton onClick={() => handleImport()} disabled={!!busy}>
              {busy === "import" && <Loader2 size={16} className="animate-spin" />}
              {busy === "import"
                ? `Adding… ${progress}`
                : `Add ${missing.length} missing dish${missing.length === 1 ? "" : "es"}`}
            </PrimaryButton>
            <p className="mt-2 font-body text-xs text-foreground/50">
              Photos aren't included. Add them per dish in Menu, or use the “Needs a photo” filter.
            </p>
          </>
        )}
      </section>

      {removedByYou.length > 0 && (
        <div className="mt-5 font-body text-sm text-foreground/60">
          <button
            onClick={() => setShowRemoved((v) => !v)}
            className="font-semibold text-teal underline-offset-4 hover:underline"
          >
            {showRemoved ? "Hide" : "Show"} {removedByYou.length} dish{removedByYou.length === 1 ? "" : "es"} you deleted
          </button>{" "}
          — these are never added back unless you choose to.
          {showRemoved && (
            <div className="mt-3 rounded-xl border border-foreground/10 bg-white p-4">
              <ul className="mb-4 flex flex-wrap gap-2">
                {removedByYou.map((d) => (
                  <li key={d.name} className="rounded-full bg-cream px-3 py-1 text-foreground/75">
                    {d.name}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleImport(removedByYou)}
                disabled={!!busy}
                className="rounded-md border border-teal px-4 py-2 font-semibold text-teal hover:bg-teal/5 disabled:opacity-50"
              >
                Add them back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
