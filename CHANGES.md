# What changed

## Navigation bar
- Solid, readable bar on the Menu and About pages (it was transparent with light text on a light page until you scrolled).
- Transparent only over the homepage photo, with a soft shadow so the links stay legible.
- “Reserve a table” and the Find us link now work from every page (they used to point to a section that only exists on the homepage).
- New phone menu: slides in from the side (from the left in Arabic), large links, a Reserve button, and one-tap Call, WhatsApp and Directions. Locks page scrolling, closes with Escape or a tap outside.
- Active page is underlined in gold; full links appear from 1024 px wide, the phone menu below that.

## Photos without Firebase Storage
- Uploads go to Cloudinary (free) — see SETUP-IMAGES.md. Firebase Storage and `storage.rules` are removed.
- Photos are resized and converted to WebP in the browser before upload.
- The website requests correctly sized images from Cloudinary (thumbnails ~160 px instead of full 2 MB photos).

## Admin panel
- Works on phones: top bar with a slide-out menu.
- New photo uploader for dishes, offers, gallery and homepage: drag and drop, tap to choose, or paste; progress bar per photo; retry on failure; reorder; set the cover photo.
- New **Homepage photos** page to change the big slideshow without touching code.
- Menu: search, filter by category, “Needs a photo” filter, one-tap star to show a dish on the homepage.
- Offers: one-tap Live / Hidden switch.
- Gallery: reorder albums; the first is shown largest.
- Edit forms open as a sheet on phones with the Save button always visible, warn before closing with unsaved changes, and confirm saves with a short message.
