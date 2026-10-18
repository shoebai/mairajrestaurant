// Central place for site-wide constants.
// Restaurant WhatsApp number: country code + number, digits only, no + or spaces.
export const RESTAURANT_WHATSAPP = "966580748325"
export const RESTAURANT_PHONE_DISPLAY = "+966 58 074 8325"
export const RESTAURANT_MAP_URL = "https://maps.app.goo.gl/TC1TU7UGmo3D5pMu8"

// ── Developer tools ────────────────────────────────────────────────────
// Only these admin logins see developer-only pages such as "Import menu".
// Restaurant staff logging in with any other email won't see them.
export const DEVELOPER_EMAILS = ["yshoeb52@gmail.com"]

export function isDeveloper(email?: string | null) {
  return !!email && DEVELOPER_EMAILS.includes(email.toLowerCase())
}

// ── Photo storage (Cloudinary) ─────────────────────────────────────────
// Photos uploaded from the admin panel are stored on Cloudinary (free plan),
// not Firebase Storage. Set these two values once — see SETUP-IMAGES.md.
//
// Either put them in a `.env` file (VITE_CLOUDINARY_CLOUD_NAME=...) and as
// GitHub repository variables, or paste them directly between the quotes.
// Neither value is a secret: they are meant to be used in the browser.
export const CLOUDINARY_CLOUD_NAME: string =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ""
export const CLOUDINARY_UPLOAD_PRESET: string =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ""
