import { useState } from "react"
import { menu as staticMenu } from "@/lib/menuData"
import { addMenuItem, useMenuItems } from "@/lib/firestoreMenu"

export default function AdminSeed() {
  const { items } = useMenuItems()
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)
  const [count, setCount] = useState(0)

  const handleImport = async () => {
    if (
      !confirm(
        `Import ${staticMenu.length} dishes from your existing menu into the database? This adds them alongside whatever's already there — it won't delete anything.`
      )
    )
      return

    setImporting(true)
    setCount(0)
    for (let i = 0; i < staticMenu.length; i++) {
      const item = staticMenu[i]
      await addMenuItem({
        name: item.name,
        nameAr: item.nameAr ?? "",
        desc: item.desc ?? "",
        descAr: item.descAr ?? "",
        price: item.price,
        category: item.category,
        categoryAr: item.categoryAr ?? "",
        video: item.video ?? "",
        images: [],
        featured: item.featured ?? false,
        order: i,
      })
      setCount(i + 1)
    }
    setImporting(false)
    setDone(true)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-3xl mb-1">Import Starter Data</h1>
      <p className="font-body text-foreground/60 text-sm mb-8">
        Your original menu (from before the admin panel existed) currently lives in the site's
        code. Use this once to copy it into the database, so you can manage it here from now on.
      </p>

      <div className="bg-white border border-foreground/10 rounded p-6">
        <p className="font-body text-sm mb-1">
          <strong>{staticMenu.length}</strong> dishes found in the old menu file
        </p>
        <p className="font-body text-sm text-foreground/60 mb-6">
          <strong>{items.length}</strong> dishes currently in the database
        </p>

        {done ? (
          <p className="font-body text-gold">
            Imported {count} dishes. Photos weren't carried over automatically — open each dish
            in "Menu Items" to add its photo(s).
          </p>
        ) : (
          <button
            onClick={handleImport}
            disabled={importing}
            className="bg-gold text-cream px-6 py-3 text-xs tracking-mega uppercase font-body hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {importing ? `Importing ${count}/${staticMenu.length}...` : "Import Now"}
          </button>
        )}
      </div>

      <p className="font-body text-xs text-foreground/40 mt-4">
        Safe to run only once — running it again will create duplicate dishes.
      </p>
    </div>
  )
}
