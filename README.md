# Mairaj Restaurant website

React + Vite + Tailwind site for Mairaj Restaurant, Madinah. Bilingual (English / Arabic),
deployed to GitHub Pages.

- **Public site:** home, full menu with WhatsApp ordering, About page.
- **Admin panel:** `/admin` — manage dishes, offers, gallery albums, homepage photos and the
  About page. Works on phones, with drag-and-drop photo uploads.

## Services used

| What | Service |
| --- | --- |
| Admin login | Firebase Authentication |
| Menu, offers, gallery and About text | Cloud Firestore |
| Photos | Cloudinary (free plan) — see **[SETUP-IMAGES.md](SETUP-IMAGES.md)** |
| Hosting | GitHub Pages (`.github/workflows/deploy.yml`) |

## Run locally

```bash
npm install
cp .env.example .env   # then add your Cloudinary details
npm run dev            # http://localhost:3000/mairajrestaurant/
```

## Build

```bash
npm run build
```
