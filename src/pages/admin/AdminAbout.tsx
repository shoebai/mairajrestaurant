import { useEffect, useState } from "react"
import { useAbout, updateAbout } from "@/lib/firestoreAbout"

export default function AdminAbout() {
  const { about, loading } = useAbout()
  const [form, setForm] = useState(about)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(about)
  }, [about])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await updateAbout(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="p-8 font-body text-foreground/50">Loading...</p>
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-3xl mb-1">About Us</h1>
      <p className="font-body text-foreground/60 text-sm mb-8">
        This content appears on the site's About page.
      </p>

      <div className="flex flex-col gap-6">
        <Section title="Our Story">
          <Field label="English">
            <textarea
              value={form.story}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
              rows={4}
              className="admin-input resize-none"
            />
          </Field>
          <Field label="Arabic">
            <textarea
              value={form.storyAr ?? ""}
              onChange={(e) => setForm({ ...form, storyAr: e.target.value })}
              rows={4}
              dir="rtl"
              className="admin-input resize-none"
            />
          </Field>
        </Section>

        <Section title="Services">
          <Field label="English">
            <textarea
              value={form.services}
              onChange={(e) => setForm({ ...form, services: e.target.value })}
              rows={3}
              className="admin-input resize-none"
            />
          </Field>
          <Field label="Arabic">
            <textarea
              value={form.servicesAr ?? ""}
              onChange={(e) => setForm({ ...form, servicesAr: e.target.value })}
              rows={3}
              dir="rtl"
              className="admin-input resize-none"
            />
          </Field>
        </Section>

        <Section title="Staff">
          <Field label="English">
            <textarea
              value={form.staff}
              onChange={(e) => setForm({ ...form, staff: e.target.value })}
              rows={3}
              className="admin-input resize-none"
            />
          </Field>
          <Field label="Arabic">
            <textarea
              value={form.staffAr ?? ""}
              onChange={(e) => setForm({ ...form, staffAr: e.target.value })}
              rows={3}
              dir="rtl"
              className="admin-input resize-none"
            />
          </Field>
        </Section>

        <Section title="Catering">
          <Field label="English">
            <textarea
              value={form.catering}
              onChange={(e) => setForm({ ...form, catering: e.target.value })}
              rows={3}
              className="admin-input resize-none"
            />
          </Field>
          <Field label="Arabic">
            <textarea
              value={form.cateringAr ?? ""}
              onChange={(e) => setForm({ ...form, cateringAr: e.target.value })}
              rows={3}
              dir="rtl"
              className="admin-input resize-none"
            />
          </Field>
        </Section>

        <Section title="Location">
          <Field label="English">
            <textarea
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              rows={2}
              className="admin-input resize-none"
            />
          </Field>
          <Field label="Arabic">
            <textarea
              value={form.locationAr ?? ""}
              onChange={(e) => setForm({ ...form, locationAr: e.target.value })}
              rows={2}
              dir="rtl"
              className="admin-input resize-none"
            />
          </Field>
        </Section>

        <Section title="Contact">
          <Field label="Phone">
            <input
              value={form.phone ?? ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="admin-input"
            />
          </Field>
          <Field label="Email">
            <input
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="admin-input"
            />
          </Field>
          <Field label="Hours">
            <input
              value={form.hours ?? ""}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              placeholder="Daily · 1:00 PM – 12:00 AM"
              className="admin-input"
            />
          </Field>
        </Section>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold text-cream px-8 py-3 text-xs tracking-mega uppercase font-body hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && <span className="font-body text-sm text-gold">Saved</span>}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-foreground/10 rounded p-5">
      <h2 className="font-display text-xl mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
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
