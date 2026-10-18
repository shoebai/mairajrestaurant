// Photo uploads go to Cloudinary using an *unsigned upload preset*, so the
// site can stay a static site on GitHub Pages — no server, no Firebase Storage.
// Photos are resized and converted in the browser before upload, so a 5 MB
// phone photo usually becomes ~300 KB.
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "./config"

export const isStorageConfigured = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET)

export const MAX_UPLOAD_MB = 25
const MAX_DIMENSION = 2000

// Delete tokens are only returned when "Return delete token" is switched on
// in the upload preset, and they expire 10 minutes after upload. They let the
// admin undo a photo they just uploaded by mistake.
const deleteTokens = new Map<string, string>()

export function isImageFile(file: File) {
  return file.type.startsWith("image/") || /\.(heic|heif|avif|jfif)$/i.test(file.name)
}

/** Shrinks big photos and converts them to WebP (or JPEG on older browsers). */
export async function compressImage(file: File): Promise<Blob> {
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    // Formats the browser can't decode (e.g. HEIC on Chrome) go up as-is;
    // Cloudinary converts them on delivery.
    return file
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    bitmap.close()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85))

  let blob = await toBlob("image/webp")
  if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg")
  if (!blob) return file

  return blob.size < file.size ? blob : file
}

/**
 * Uploads one photo and returns its public URL.
 * `onProgress` receives 0–100 while the file is being sent.
 */
export async function uploadImage(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!isStorageConfigured) {
    throw new Error("Photo uploads aren't set up yet. Add your Cloudinary details in src/lib/config.ts.")
  }
  if (!isImageFile(file)) {
    throw new Error(`"${file.name}" isn't a photo. Use JPG, PNG, WebP or HEIC.`)
  }
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    throw new Error(`"${file.name}" is larger than ${MAX_UPLOAD_MB} MB.`)
  }

  const body = await compressImage(file)
  const form = new FormData()
  form.append("file", body, file.name)
  return send(form, folder, onProgress)
}

function send(form: FormData, folder: string, onProgress?: (percent: number) => void): Promise<string> {
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
  form.append("folder", `mairaj/${folder}`)

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onerror = () => reject(new Error("Upload failed. Check your internet connection and try again."))
    xhr.onload = () => {
      let data: { secure_url?: string; delete_token?: string; error?: { message?: string } } = {}
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        // handled below
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
        if (data.delete_token) deleteTokens.set(data.secure_url, data.delete_token)
        resolve(data.secure_url)
      } else {
        reject(new Error(data.error?.message ?? `Upload failed (error ${xhr.status}).`))
      }
    }
    xhr.send(form)
  })
}

/**
 * Removes a photo from Cloudinary if it was uploaded in the last 10 minutes
 * from this browser. Older photos are simply unlinked from the site; you can
 * clear them out from the Cloudinary Media Library whenever you like.
 */
export async function deleteImageByUrl(url: string) {
  const token = deleteTokens.get(url)
  if (!token || !isStorageConfigured) return
  try {
    const form = new FormData()
    form.append("token", token)
    await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`, {
      method: "POST",
      body: form,
    })
  } catch {
    // Not critical — the photo is already removed from the site.
  } finally {
    deleteTokens.delete(url)
  }
}

/**
 * Returns a lighter, correctly-sized version of a Cloudinary photo
 * (auto format + quality). Other URLs are returned unchanged.
 */
export function optimizedImage(url: string | undefined, width: number): string {
  if (!url) return ""
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`)
}

// ── Automatic white background ─────────────────────────────────────────
// Uses Cloudinary's AI background removal, then fills the background with
// white. The result is saved as a new photo, so the (costly) removal runs
// only once per photo; afterwards it's served like any other image.
//
// Cost: each removal counts as 75 transformations. The free plan includes
// about 25,000 per month, which is plenty for a restaurant menu.

const WHITE_BG = "e_background_removal/b_white,f_jpg,q_90"

/** Finds the Cloudinary public ID inside a delivery URL. */
function publicIdOf(url: string): string | null {
  const m = url.match(/\/image\/upload\/(?:v\d+\/)?([^?#]+?)\.[a-z0-9]+(?:[?#].*)?$/i)
  return m ? m[1] : null
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const loadsAsImage = (url: string) =>
  new Promise<boolean>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`
  })

/**
 * Background removal takes a few seconds. Until it's finished, Cloudinary
 * answers with "processing" (420/423). Keep asking until the image is ready.
 */
async function waitUntilReady(url: string, timeoutMs = 90_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    let status = 0
    try {
      const res = await fetch(url, { cache: "no-store" })
      status = res.status
      if (res.ok) return
    } catch {
      // Couldn't read the response (network hiccup or browser privacy
      // rules); check by loading it as a normal image instead.
      if (await loadsAsImage(url)) return
    }
    if (status && status !== 420 && status !== 423 && status < 500) {
      throw new Error(
        status === 401 || status === 403
          ? "Background removal isn't available on this Cloudinary account."
          : `Background removal failed (error ${status}).`
      )
    }
    await sleep(2500)
  }
  throw new Error("Background removal is taking too long. Try again in a minute.")
}

/**
 * Takes an uploaded photo and returns the URL of a copy with the background
 * replaced by white. The original is removed if it was uploaded in the last
 * 10 minutes from this browser.
 */
export async function makeWhiteBackground(url: string, folder: string): Promise<string> {
  if (!isStorageConfigured) throw new Error("Photo uploads aren't set up yet.")
  const publicId = url.includes("res.cloudinary.com") ? publicIdOf(url) : null
  if (!publicId) throw new Error("Only photos uploaded through this admin panel can be changed.")

  const processed = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${WHITE_BG}/${publicId}.jpg`
  await waitUntilReady(processed)

  // Save the finished image as its own photo (uploading from a URL).
  const form = new FormData()
  form.append("file", processed)
  const newUrl = await send(form, folder)

  deleteImageByUrl(url)
  return newUrl
}
