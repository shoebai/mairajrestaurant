import { useEffect, useRef, type ReactNode } from "react"
import { X } from "lucide-react"

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block font-body text-sm font-medium text-foreground/80">{label}</label>
      {children}
      {hint && <p className="mt-1 font-body text-xs text-foreground/50">{hint}</p>}
    </div>
  )
}

/** Side-by-side English / Arabic inputs, stacked on phones. */
export function BilingualRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 font-body text-sm text-foreground/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-gold px-5 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-[hsl(42_50%_46%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

/**
 * Edit form that slides up as a sheet on phones and shows as a centred
 * dialog on larger screens. The Save button stays visible while scrolling.
 */
export function AdminModal({
  title,
  onClose,
  dirty = false,
  footer,
  children,
}: {
  title: string
  onClose: () => void
  /** Ask before closing if there are unsaved changes. */
  dirty?: boolean
  footer: ReactNode
  children: ReactNode
}) {
  const requestClose = () => {
    if (dirty && !confirm("Close without saving? Your changes will be lost.")) return
    onClose()
  }

  const closeRef = useRef(requestClose)
  closeRef.current = requestClose

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current()
    }
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-cream shadow-2xl sm:max-w-2xl sm:rounded-xl"
      >
        <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4 sm:px-6">
          <h2 className="font-display text-2xl">{title}</h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="rounded-full p-2 text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5">{children}</div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-foreground/10 bg-cream px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-b-xl sm:px-6">
          <button
            type="button"
            onClick={requestClose}
            className="rounded-md px-4 py-2.5 font-body text-sm text-foreground/70 hover:bg-foreground/5"
          >
            Cancel
          </button>
          {footer}
        </div>
      </div>
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-foreground/10 bg-white p-3.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
          checked ? "bg-gold" : "bg-foreground/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
      <span>
        <span className="block font-body text-sm font-medium">{label}</span>
        {description && <span className="block font-body text-xs text-foreground/55">{description}</span>}
      </span>
    </label>
  )
}
