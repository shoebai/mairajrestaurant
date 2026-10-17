# Photo uploads (Cloudinary) — one-time setup

Photos you upload in the admin panel are stored on **Cloudinary**, not Firebase
Storage. Cloudinary's free plan is plenty for a restaurant site, needs no credit
card, and automatically serves each photo in the smallest format the visitor's
phone supports.

Firebase is still used for the admin login and the text (menu, offers, About page).

## 1. Create the Cloudinary account

1. Sign up at <https://cloudinary.com> (free plan).
2. On the dashboard, copy your **Cloud name** (for example `dxyz123ab`).

## 2. Create an upload preset

1. Open **Settings** (gear icon) → **Upload** → **Upload presets** → **Add upload preset**.
2. Set **Signing mode** to **Unsigned**.
3. Optional but recommended, to limit misuse:
   - **Asset folder:** `mairaj`
   - **Allowed formats:** `jpg, jpeg, png, webp, heic, heif, avif, gif`
   - **Max file size:** `10000000` (10 MB)
   - **Return delete token:** on (lets the admin undo a photo within 10 minutes of uploading it)
4. Save, and copy the **preset name** (for example `mairaj_unsigned`).

## 3. Give the website these two values

**On your computer** — copy `.env.example` to `.env` and fill it in:

```
VITE_CLOUDINARY_CLOUD_NAME=dxyz123ab
VITE_CLOUDINARY_UPLOAD_PRESET=mairaj_unsigned
```

**On GitHub (for the live site)** — in the repository go to
**Settings → Secrets and variables → Actions → Variables → New repository variable**
and add both:

| Name | Value |
| --- | --- |
| `VITE_CLOUDINARY_CLOUD_NAME` | your cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | your preset name |

Then push any commit (or re-run the "Deploy to GitHub Pages" workflow).

> Prefer not to use variables? Paste the two values directly into
> `src/lib/config.ts` instead. They aren't secret.

## 4. Update the Firestore rules

Open the Firebase console → **Firestore Database → Rules**, paste in the
contents of `firestore.rules` from this project and click **Publish**. The new
rules add the `site` collection used for the homepage slideshow photos.

## Good to know

- Photos are resized in the browser to a maximum of 2000 px and converted to
  WebP before upload, so phone photos upload quickly even on mobile data.
- Removing a photo in the admin panel removes it from the website straight away.
  Photos older than 10 minutes stay in your Cloudinary Media Library; delete them
  there if you want to free up space.
- Because the preset is unsigned, the upload address is visible in the site's
  code. The preset limits above (folder, formats, size) keep that safe for a
  small site; you can also turn the preset off any time in Cloudinary.
