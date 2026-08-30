// Auto-discovers every photo dropped in these two folders — no imports
// or code changes needed to add more. See README notes in Gallery.tsx
// and menuData.ts for the exact naming convention.
const dishModules = import.meta.glob("/src/assets/dishes/*", {
  eager: true,
  import: "default",
}) as Record<string, string>

const galleryModules = import.meta.glob("/src/assets/gallery/*", {
  eager: true,
  import: "default",
}) as Record<string, string>

function imagesForSlug(modules: Record<string, string>, slug: string): string[] {
  if (!slug) return []
  const target = slug.toLowerCase()
  return Object.entries(modules)
    .filter(([path]) => {
      const file = path.split("/").pop()!.toLowerCase()
      const nameNoExt = file.replace(/\.[^.]+$/, "")
      // Matches "slug.ext" (single photo) or "slug-1.ext", "slug-2.ext", etc (multiple)
      return nameNoExt === target || nameNoExt.startsWith(`${target}-`)
    })
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, url]) => url)
}

export function getDishImages(slug?: string): string[] {
  return imagesForSlug(dishModules, slug ?? "")
}

export function getGalleryImages(slug?: string): string[] {
  return imagesForSlug(galleryModules, slug ?? "")
}
