import { useEffect, useRef, useState } from "react"
import {
  ImagePlus,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RotateCcw,
  Loader2,
} from "lucide-react"
import {
  uploadImage,
  deleteImageByUrl,
  isImageFile,
  isStorageConfigured,
  optimizedImage,
  MAX_UPLOAD_MB,
} from "@/lib/storage"

interface PendingUpload {
  id: string
  file: File
  preview: string
  progress: number
  error?: string
}

interface ImageUploaderProps {
  /** Photo URLs currently attached. The first one is the cover photo. */
  value: string[]
  onChange: (urls: string[]) => void
  /** Cloudinary sub-folder, e.g. "menu-items". */
  folder: string
  /** false = a single photo; a new upload replaces the old one. */
  multiple?: boolean
  /** Lets the parent disable its Save button while uploads are running. */
  onBusyChange?: (busy: boolean) => void
  hint?: string
}

let idCounter = 0

export default function ImageUploader({
  value,
  onChange,
  folder,
  multiple = true,
  onBusyChange,
  hint,
}: ImageUploaderProps) {
  const [pending, setPending] = useState<PendingUpload[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Uploads finish one by one, so always add to the newest list of photos.
  const valueRef = useRef(value)
  valueRef.current = value

  const busy = pending.some((p) => !p.error)
  useEffect(() => {
    onBusyChange?.(busy)
  }, [busy, onBusyChange])

  // Free preview memory when the uploader closes.
  const pendingRef = useRef(pending)
  pendingRef.current = pending
  useEffect(() => () => pendingRef.current.forEach((p) => URL.revokeObjectURL(p.preview)), [])

  const patch = (id: string, changes: Partial<PendingUpload>) =>
    setPending((list) => list.map((p) => (p.id === id ? { ...p, ...changes } : p)))

  const finish = (id: string) =>
    setPending((list) => {
      const done = list.find((p) => p.id === id)
      if (done) URL.revokeObjectURL(done.preview)
      return list.filter((p) => p.id !== id)
    })

  const runUpload = async (item: PendingUpload) => {
    patch(item.id, { error: undefined, progress: 0 })
    try {
      const url = await uploadImage(item.file, folder, (progress) => patch(item.id, { progress }))
      const next = multiple ? [...valueRef.current, url] : [url]
      if (!multiple) valueRef.current.forEach((old) => deleteImageByUrl(old))
      valueRef.current = next
      onChange(next)
      finish(item.id)
    } catch (err) {
      patch(item.id, { error: err instanceof Error ? err.message : "Upload failed." })
    }
  }

  const addFiles = (fileList: FileList | File[]) => {
    let files = Array.from(fileList).filter(isImageFile)
    if (files.length === 0) return
    if (!multiple) files = files.slice(0, 1)

    const items = files.map<PendingUpload>((file) => ({
      id: `up-${++idCounter}`,
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      error:
        file.size > MAX_UPLOAD_MB * 1024 * 1024
          ? `Larger than ${MAX_UPLOAD_MB} MB. Choose a smaller photo.`
          : undefined,
    }))

    setPending((list) => (multiple ? [...list, ...items] : items))
    items.filter((i) => !i.error).forEach(runUpload)
  }

  // Paste a photo straight from the clipboard (Ctrl/Cmd + V).
  useEffect(() => {
    if (!isStorageConfigured) return
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? [])
      if (files.some(isImageFile)) {
        e.preventDefault()
        addFiles(files)
      }
    }
    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, multiple])

  const remove = (url: string) => {
    onChange(value.filter((u) => u !== url))
    deleteImageByUrl(url)
  }

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const makeCover = (index: number) => {
    if (index === 0) return
    const next = [...value]
    const [picked] = next.splice(index, 1)
    onChange([picked, ...next])
  }

  if (!isStorageConfigured) {
    return (
      <div className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 font-body text-sm text-amber-900">
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
        <p>
          Photo uploads aren't connected yet. Add your Cloudinary cloud name and upload preset
          (see <strong>SETUP-IMAGES.md</strong> in the project), then redeploy.
        </p>
      </div>
    )
  }

  const showDropZone = multiple || (value.length === 0 && pending.length === 0)

  return (
    <div className="flex flex-col gap-3">
      {(value.length > 0 || pending.length > 0) && (
        <ul className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((url, i) => (
            <li key={url} className="group relative aspect-square rounded-lg overflow-hidden bg-foreground/5 ring-1 ring-foreground/10">
              <img src={optimizedImage(url, 300)} alt="" className="h-full w-full object-cover" />

              {multiple && i === 0 && value.length > 1 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-gold px-1.5 py-0.5 font-body text-[10px] font-medium text-white">
                  Cover
                </span>
              )}

              <button
                type="button"
                onClick={() => remove(url)}
                aria-label="Remove photo"
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white hover:bg-destructive focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                <X size={14} />
              </button>

              {multiple && value.length > 1 && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-1.5 pt-5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move earlier"
                    className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-white/20 disabled:opacity-0 rtl:rotate-180"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(i)}
                      className="flex items-center gap-1 rounded px-1.5 py-0.5 font-body text-[10px] text-white hover:bg-white/20"
                    >
                      <Star size={11} /> Make cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    aria-label="Move later"
                    className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-white/20 disabled:opacity-0 rtl:rotate-180"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </li>
          ))}

          {pending.map((p) => (
            <li key={p.id} className="relative aspect-square rounded-lg overflow-hidden bg-foreground/5 ring-1 ring-foreground/10">
              <img src={p.preview} alt="" className={`h-full w-full object-cover ${p.error ? "opacity-40" : "opacity-60"}`} />

              {p.error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-white/80 p-2 text-center">
                  <AlertCircle size={18} className="text-destructive" />
                  <p className="font-body text-[11px] leading-tight text-destructive line-clamp-3">{p.error}</p>
                  <div className="flex gap-1">
                    {p.file.size <= MAX_UPLOAD_MB * 1024 * 1024 && (
                      <button
                        type="button"
                        onClick={() => runUpload(p)}
                        className="flex items-center gap-1 rounded bg-foreground px-2 py-1 font-body text-[11px] text-white"
                      >
                        <RotateCcw size={11} /> Retry
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => finish(p.id)}
                      className="rounded px-2 py-1 font-body text-[11px] text-foreground/70 hover:bg-foreground/10"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin text-white drop-shadow" />
                  <div className="h-1.5 w-3/4 overflow-hidden rounded-full bg-white/50">
                    <div
                      className="h-full bg-gold transition-[width] duration-200"
                      style={{ width: `${Math.max(p.progress, 5)}%` }}
                    />
                  </div>
                  <span className="font-body text-[11px] font-medium text-white drop-shadow">
                    {p.progress < 100 ? `${p.progress}%` : "Finishing…"}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {showDropZone && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            addFiles(e.dataTransfer.files)
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-7 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
            dragging ? "border-gold bg-gold/10" : "border-foreground/20 bg-white hover:border-gold hover:bg-gold/5"
          }`}
        >
          <ImagePlus size={26} className="text-gold" />
          <p className="font-body text-sm font-medium">
            {dragging ? "Drop to upload" : multiple ? "Add photos" : "Add a photo"}
          </p>
          <p className="font-body text-xs text-foreground/55">
            Drag photos here, tap to choose, or paste
            <span className="hidden sm:inline"> with Ctrl+V</span>
          </p>
        </div>
      )}

      {!multiple && value.length > 0 && pending.length === 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-fit font-body text-sm text-gold underline-offset-4 hover:underline"
        >
          Replace photo
        </button>
      )}

      {hint && <p className="font-body text-xs text-foreground/55">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files)
          e.target.value = ""
        }}
      />
    </div>
  )
}
