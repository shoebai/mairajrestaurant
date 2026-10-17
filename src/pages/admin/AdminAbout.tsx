import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useAbout, updateAbout } from "@/lib/firestoreAbout"
import { PageHeader, PrimaryButton } from "@/components/admin/AdminUI"

export default function AdminAbout() {
  const { about, loading } = useAbout()
  const [form, setForm] = useState(about)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(about)
  }, [about])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateAbout(form)
      toast.success("About page saved")
    } catch {
      toast.error("Couldn't save. Check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="font-body text-foreground/50">Loading…</p>
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="About us" subtitle="This text appears on the website's About page." />

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

        <Section title="Our services">
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

        <Section title="Our team">
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

        <Section title="Address">
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

        <Section title="Contact details">
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

        <div className="sticky bottom-0 -mx-4 flex items-center gap-4 border-t border-foreground/10 bg-[hsl(38_24%_97%)]/95 px-4 py-4 backdrop-blur md:mx-0 md:px-0">
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-white p-5">
      <h2 className="font-display text-xl mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-body text-sm font-medium text-foreground/70">
        {label}
      </label>
      {children}
    </div>
  )
}
