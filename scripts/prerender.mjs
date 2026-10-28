// Runs after `vite build` (see .github/workflows/deploy.yml).
//
// The website loads its menu from the database after the page opens, so a
// search engine that reads the raw HTML sees almost nothing. This script
// reads the live menu and homepage text from Firestore (public, read-only)
// and writes a plain, readable copy of each page — in English and Arabic —
// into the HTML files. When the page loads, the normal site replaces it.
//
// It also gives each page its own title, description and structured data
// (the full menu with prices in schema.org format).
//
// If anything fails (no internet, rules changed), it still writes the pages
// without the snapshot, so a deploy never breaks because of this script.

import { mkdir, readFile, writeFile } from "node:fs/promises"

const PROJECT = "mairaj-restaruant"
const API_KEY = "AIzaSyAMfcgA93rjA0Urrm8KdL4C1nMPEte8H8I"
const SITE = "https://mairajhyd.com"
const NAME = "Mairaj Restaurant"
const NAME_AR = "مطعم معراج"
const PHONE = "+966580748325"
const PHONE_DISPLAY = "+966 58 074 8325"
const HOURS = "Open every day, 1 PM – 12 AM"
const HOURS_AR = "مفتوح يومياً من ١ ظهراً حتى ١٢ منتصف الليل"
const DIST = new URL("../dist/", import.meta.url)

// ── Firestore REST helpers ─────────────────────────────────────────────
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`

function value(v) {
  if (!v) return undefined
  if ("stringValue" in v) return v.stringValue
  if ("integerValue" in v) return Number(v.integerValue)
  if ("doubleValue" in v) return v.doubleValue
  if ("booleanValue" in v) return v.booleanValue
  if ("nullValue" in v) return null
  if ("arrayValue" in v) return (v.arrayValue.values ?? []).map(value)
  if ("mapValue" in v) return fields(v.mapValue.fields)
  return undefined
}
const fields = (f = {}) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, value(v)]))

async function getCollection(name) {
  const out = []
  let token = ""
  do {
    const res = await fetch(`${BASE}/${name}?pageSize=300&key=${API_KEY}${token ? `&pageToken=${token}` : ""}`)
    if (!res.ok) throw new Error(`${name}: ${res.status}`)
    const json = await res.json()
    for (const d of json.documents ?? []) out.push({ id: d.name.split("/").pop(), ...fields(d.fields) })
    token = json.nextPageToken ?? ""
  } while (token)
  return out
}

async function getDoc(path) {
  const res = await fetch(`${BASE}/${path}?key=${API_KEY}`)
  if (res.status === 404) return {}
  if (!res.ok) throw new Error(`${path}: ${res.status}`)
  return fields((await res.json()).fields)
}

// ── HTML helpers ───────────────────────────────────────────────────────
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])
const ar = (s) => (s ? `<span lang="ar" dir="rtl">${esc(s)}</span>` : "")
const both = (en, arText, tag = "p") =>
  `<${tag}>${esc(en)}${arText ? ` · ${ar(arText)}` : ""}</${tag}>`

function dishList(items) {
  return `<ul>${items
    .map(
      (i) =>
        `<li><strong>${esc(i.name)}</strong>${i.nameAr ? ` — ${ar(i.nameAr)}` : ""} — ${esc(i.price)} SAR${
          i.desc ? `<br><small>${esc(i.desc)}</small>` : ""
        }</li>`
    )
    .join("")}</ul>`
}

const nav = `<nav><a href="/">Home · ${ar("الرئيسية")}</a> | <a href="/menu">Menu · ${ar(
  "القائمة"
)}</a> | <a href="/about">About · ${ar("من نحن")}</a></nav>`

const ADDRESS = "Sayed Al Shouhada, Al Masani, Madinah 42313 — near Shohada Street, close to Al-Masjid an-Nabawi"
const ADDRESS_AR = "سيد الشهداء، المصانع، المدينة المنورة 42313 — بالقرب من شارع الشهداء، بالقرب من المسجد النبوي"

const contact = `<p>${esc(HOURS)} · ${ar(HOURS_AR)}</p><p>Call or WhatsApp: <a href="tel:${PHONE}">${PHONE_DISPLAY}</a></p><address>${esc(ADDRESS)}<br>${ar(ADDRESS_AR)}</address>`

const wrap = (inner) => `<div class="seo-snapshot">${inner}</div>`

// ── Page builders ──────────────────────────────────────────────────────
function homeSnapshot({ items, text }) {
  const t = (key, en, arDefault) => [text[key]?.en || en, text[key]?.ar || arDefault]
  const [title, titleAr] = t(
    "heroTitle",
    "The old way of making biryani, in Madinah.",
    "البرياني على الطريقة الأصيلة، في المدينة المنورة."
  )
  const [body, bodyAr] = t(
    "heroBody",
    "Rice and meat sealed together and slow-cooked on dum, the way Hyderabadi kitchens have done it for generations.",
    "أرز ولحم يُغلقان معاً ويُطهيان على نار هادئة بطريقة الدم، كما تفعل مطابخ حيدر أباد منذ أجيال."
  )
  const featured = items.filter((i) => i.featured)
  const biryanis = items.filter((i) => /biryani|برياني/i.test(`${i.name} ${i.nameAr ?? ""}`))

  return wrap(`
<header><p><strong>${esc(NAME)}</strong> · ${ar(NAME_AR)}</p>${nav}</header>
<main>
<h1>${esc(title)}</h1>
<p lang="ar" dir="rtl">${esc(titleAr)}</p>
<p>${esc(body)}</p>
<p lang="ar" dir="rtl">${esc(bodyAr)}</p>
<p>Hyderabadi biryani, tandoori and Indian food in Madinah, a short walk from Al-Masjid an-Nabawi — dine in, takeaway and WhatsApp orders.</p>
<p lang="ar" dir="rtl">برياني حيدر أبادي ومشويات التندور والمأكولات الهندية في المدينة المنورة، بالقرب من المسجد النبوي — تناول في المطعم، سفري، وطلبات واتساب.</p>
${contact}
${featured.length ? `<h2>Dishes guests come back for · ${ar("أطباق يعود الضيوف من أجلها")}</h2>${dishList(featured)}` : ""}
${biryanis.length ? `<h2>Hyderabadi biryani · ${ar("برياني حيدر أبادي")}</h2>${dishList(biryanis)}` : ""}
<p><a href="/menu">See the full menu (${items.length} dishes) · ${ar("القائمة الكاملة")}</a></p>
</main>`)
}

function groupByCategory(items) {
  const groups = new Map()
  for (const i of items) {
    if (!groups.has(i.category)) groups.set(i.category, { name: i.category, nameAr: i.categoryAr, items: [] })
    groups.get(i.category).items.push(i)
  }
  return [...groups.values()]
}

function menuSnapshot({ items }) {
  const sections = groupByCategory(items)
  return wrap(`
<header><p><strong>${esc(NAME)}</strong> · ${ar(NAME_AR)}</p>${nav}</header>
<main>
<h1>Menu — Hyderabadi biryani &amp; Indian food in Madinah</h1>
<p lang="ar" dir="rtl">قائمة الطعام — برياني حيدر أبادي ومأكولات هندية في المدينة المنورة</p>
<p>${items.length} dishes. Prices in Saudi riyals (SAR). Order on WhatsApp for pickup or delivery.</p>
${sections.map((s) => `<h2>${esc(s.name)}${s.nameAr ? ` · ${ar(s.nameAr)}` : ""}</h2>${dishList(s.items)}`).join("\n")}
${contact}
</main>`)
}

function aboutSnapshot({ about }) {
  const block = (title, titleAr, en, arText) =>
    en || arText
      ? `<h2>${esc(title)} · ${ar(titleAr)}</h2>${en ? `<p>${esc(en)}</p>` : ""}${arText ? `<p lang="ar" dir="rtl">${esc(arText)}</p>` : ""}`
      : ""
  return wrap(`
<header><p><strong>${esc(NAME)}</strong> · ${ar(NAME_AR)}</p>${nav}</header>
<main>
<h1>About Mairaj Restaurant — Hyderabadi food in Madinah</h1>
<p lang="ar" dir="rtl">عن مطعم معراج — مأكولات حيدر أبادية في المدينة المنورة</p>
${block("Our story", "قصتنا", about.story, about.storyAr)}
${block("Our services", "خدماتنا", about.services, about.servicesAr)}
${block("Catering", "خدمات الضيافة", about.catering, about.cateringAr)}
${block("Location", "الموقع", about.location, about.locationAr)}
${contact}
</main>`)
}

function menuSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: NAME,
    alternateName: NAME_AR,
    url: `${SITE}/`,
    telephone: PHONE,
    servesCuisine: ["Indian", "Hyderabadi"],
    hasMenu: {
      "@type": "Menu",
      name: "Mairaj Restaurant Menu",
      url: `${SITE}/menu`,
      inLanguage: ["en", "ar"],
      hasMenuSection: groupByCategory(items).map((s) => ({
        "@type": "MenuSection",
        name: s.name,
        ...(s.nameAr ? { alternateName: s.nameAr } : {}),
        hasMenuItem: s.items.map((i) => ({
          "@type": "MenuItem",
          name: i.name,
          ...(i.nameAr ? { alternateName: i.nameAr } : {}),
          ...(i.desc ? { description: i.desc } : {}),
          ...(i.images?.[0] ? { image: i.images[0] } : {}),
          offers: { "@type": "Offer", price: String(i.price), priceCurrency: "SAR" },
        })),
      })),
    },
  }
}

// ── Write files ────────────────────────────────────────────────────────
function setHead(html, { title, description, path }) {
  const url = `${SITE}${path}`
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="alternate" hreflang="en" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="alternate" hreflang="ar" href=")[^"]*(")/, `$1${url}?lang=ar$2`)
    .replace(/(<link rel="alternate" hreflang="x-default" href=")[^"]*(")/, `$1${url}$2`)
}

const withSnapshot = (html, snapshot) =>
  snapshot ? html.replace('<div id="root"></div>', `<div id="root">${snapshot}</div>`) : html

const withSchema = (html, schema) =>
  schema
    ? html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>\n</head>`)
    : html

export const PAGES = {
  "/": {
    title: "Mairaj Restaurant | Hyderabadi Biryani & Indian Food in Madinah | مطعم معراج",
    description:
      "Hyderabadi biryani, tandoori and Indian curries in Madinah, close to Al-Masjid an-Nabawi. Open daily 1 PM – 12 AM. Order on WhatsApp. مطعم معراج: برياني حيدر أبادي بالقرب من المسجد النبوي.",
  },
  "/menu": {
    title: "Menu — Hyderabadi Biryani, Tandoori & Curries in Madinah | Mairaj Restaurant",
    description:
      "Full menu with prices in SAR: Hyderabadi chicken and mutton biryani, tandoori, curries, seafood and breads. Order on WhatsApp. قائمة مطعم معراج بالأسعار.",
  },
  "/about": {
    title: "About Mairaj Restaurant — Hyderabadi Food in Madinah | مطعم معراج",
    description:
      "The story of Mairaj Restaurant, a Hyderabadi and Indian kitchen in Madinah: services, catering, location and contact. عن مطعم معراج في المدينة المنورة.",
  },
}

async function main() {
  // Start from the clean built page (strip a snapshot if this ran before).
  const template = (await readFile(new URL("index.html", DIST), "utf8")).replace(
    /<div id="root"><div class="seo-snapshot">[\s\S]*?<\/main><\/div><\/div>/,
    '<div id="root"></div>'
  )

  let data = null
  try {
    const [items, text, about] = await Promise.all([
      getCollection("menuItems"),
      getDoc("site/homeText"),
      getDoc("about/main"),
    ])
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    data = { items, text, about }
    console.log(`prerender: ${items.length} dishes loaded`)
  } catch (err) {
    console.warn(`prerender: couldn't load data (${err.message}); writing pages without snapshot`)
  }

  const pages = [
    { path: "/", file: "index.html", snapshot: data && homeSnapshot(data), schema: null },
    { path: "/menu", file: "menu/index.html", snapshot: data && menuSnapshot(data), schema: data && menuSchema(data.items) },
    { path: "/about", file: "about/index.html", snapshot: data && aboutSnapshot(data), schema: null },
  ]

  for (const p of pages) {
    let html = setHead(template, { ...PAGES[p.path], path: p.path === "/" ? "/" : p.path })
    html = withSchema(withSnapshot(html, p.snapshot), p.schema)
    const target = new URL(p.file, DIST)
    await mkdir(new URL(".", target), { recursive: true })
    await writeFile(target, html)
    console.log(`prerender: wrote ${p.file}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
