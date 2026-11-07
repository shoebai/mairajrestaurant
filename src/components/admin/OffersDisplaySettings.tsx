import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, LayoutGrid, Loader2, MoveHorizontal } from "lucide-react"
import { useOffersDisplay, updateOffersDisplay, OFFER_PLACEMENTS, type OffersDisplay } from "@/lib/firestoreSite"
import { PrimaryButton } from "@/components/admin/AdminUI"

/** "How offers show on the homepage": cards, or a slowly sliding banner. */
export default function OffersDisplaySettings() {
  const { display: saved, loading } = useOffersDisplay()
  const [display, setDisplay] = useState<OffersDisplay>(saved)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading) setDisplay(saved)
  }, [loading, saved])

  const dirty = JSON.stringify(display) !== JSON.stringify(saved)
  const set = (patch: Partial<OffersDisplay>) => setDisplay((d) => ({ ...d, ...patch }))

  const save = async () => {
    setSaving(true)
    try {
      await updateOffersDisplay(display)
      toast.success("Offers settings saved — the homepage is updated")
    } catch {
      toast.error("Couldn't save. Check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const choice = (on: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-md border py-2.5 font-body text-sm font-semibold transition-colors ${
      on ? "border-teal bg-teal text-cream" : "border-foreground/20 bg-white hover:border-teal"
    }`

  if (loading) return null

  return (
    <section className="mb-6 flex flex-col gap-4 rounded-xl border border-foreground/10 bg-white p-5">
      <div>
        <h2 className="font-display text-2xl">How offers show on the homepage</h2>
        <p className="font-body text-sm text-foreground/60">
          The banner slides slowly and pauses when someone touches it or points at it with a mouse.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-body text-xs font-semibold text-foreground/60">Place on the homepage</span>
        <div className="grid gap-2 sm:grid-cols-2">
          {OFFER_PLACEMENTS.map((p) => (
            <button key={p.id} type="button" onClick={() => set({ placement: p.id })} className={choice(display.placement === p.id)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <span className="-mb-2 font-body text-xs font-semibold text-foreground/60">Style</span>
      <div className="flex gap-2">
        <button type="button" onClick={() => set({ layout: "cards" })} className={choice(display.layout === "cards")}>
          <LayoutGrid size={16} /> Cards
        </button>
        <button type="button" onClick={() => set({ layout: "banner" })} className={choice(display.layout === "banner")}>
          <MoveHorizontal size={16} /> Sliding banner
        </button>
      </div>

      {display.layout === "banner" && (
        <>
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-semibold text-foreground/60">Moves</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => set({ direction: "to-left" })} className={choice(display.direction === "to-left")}>
                <ArrowLeft size={16} /> Right to left
              </button>
              <button type="button" onClick={() => set({ direction: "to-right" })} className={choice(display.direction === "to-right")}>
                Left to right <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-semibold text-foreground/60">Speed</span>
            <div className="flex gap-2">
              {(["slow", "medium", "fast"] as const).map((speed) => (
                <button key={speed} type="button" onClick={() => set({ speed })} className={`${choice(display.speed === speed)} capitalize`}>
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-3">
        <PrimaryButton onClick={save} disabled={!dirty || saving}>
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Saving…" : "Save"}
        </PrimaryButton>
        {dirty && !saving && <span className="font-body text-sm text-foreground/55">Unsaved changes</span>}
      </div>
    </section>
  )
}
