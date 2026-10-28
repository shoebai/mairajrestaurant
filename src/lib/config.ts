// Central place for site-wide constants.
// Restaurant WhatsApp number: country code + number, digits only, no + or spaces.
export const RESTAURANT_WHATSAPP = "966580748325"
export const RESTAURANT_PHONE_DISPLAY = "+966 58 074 8325"
export const RESTAURANT_MAP_URL = "https://maps.app.goo.gl/TC1TU7UGmo3D5pMu8"

// The restaurant's name exactly as on Google Maps. Keep these identical
// everywhere (website, Google Maps, delivery apps) — Google uses the match.
export const RESTAURANT_NAME = "Mairaj Restaurant"
export const RESTAURANT_NAME_AR = "مطعم معراج"

// Full address — keep identical to Google Maps and delivery apps.
export const RESTAURANT_ADDRESS = "Sayed Al Shouhada, Al Masani, Madinah 42313"
export const RESTAURANT_ADDRESS_AR = "سيد الشهداء، المصانع، المدينة المنورة 42313"
export const RESTAURANT_LANDMARK = "Near Shohada Street, close to Al-Masjid an-Nabawi"
export const RESTAURANT_LANDMARK_AR = "بالقرب من شارع الشهداء، بالقرب من المسجد النبوي"

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
