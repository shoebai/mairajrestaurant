import { useEffect } from "react"
import { useLanguage } from "@/lib/i18n"

const SITE = "https://mairajhyd.com"

function setMeta(selector: string, attr: "content" | "href", value: string) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

/**
 * Sets the browser tab title, description and canonical link for a page,
 * in the visitor's language. (The same English titles are also baked into
 * the HTML at build time by scripts/prerender.mjs.)
 */
export function usePageMeta(path: string, meta: { en: { title: string; description: string }; ar: { title: string; description: string } }) {
  const { lang } = useLanguage()
  useEffect(() => {
    const m = meta[lang]
    const url = `${SITE}${path}${lang === "ar" ? "?lang=ar" : ""}`
    document.title = m.title
    setMeta('meta[name="description"]', "content", m.description)
    setMeta('meta[property="og:title"]', "content", m.title)
    setMeta('meta[property="og:description"]', "content", m.description)
    setMeta('meta[property="og:url"]', "content", url)
    setMeta('link[rel="canonical"]', "href", url)
    setMeta('link[hreflang="en"]', "href", `${SITE}${path}`)
    setMeta('link[hreflang="ar"]', "href", `${SITE}${path}?lang=ar`)
    setMeta('link[hreflang="x-default"]', "href", `${SITE}${path}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, path])
}

export const PAGE_META = {
  home: {
    en: {
      title: "Mairaj Restaurant | Hyderabadi Biryani & Indian Food in Madinah | مطعم معراج",
      description:
        "Hyderabadi biryani, tandoori and Indian curries in Madinah. Open daily 1 PM – 12 AM. Order on WhatsApp for pickup or delivery.",
    },
    ar: {
      title: "مطعم معراج | برياني حيدر أبادي ومأكولات هندية في المدينة المنورة",
      description:
        "برياني حيدر أبادي ومشويات التندور والمأكولات الهندية في المدينة المنورة. مفتوح يومياً من ١ ظهراً حتى ١٢ منتصف الليل. اطلب عبر واتساب.",
    },
  },
  menu: {
    en: {
      title: "Menu — Hyderabadi Biryani, Tandoori & Curries in Madinah | Mairaj Restaurant",
      description:
        "Full menu with prices in SAR: Hyderabadi chicken and mutton biryani, tandoori, curries, seafood and breads. Order on WhatsApp.",
    },
    ar: {
      title: "قائمة الطعام — برياني حيدر أبادي وتندوري في المدينة المنورة | مطعم معراج",
      description: "قائمة مطعم معراج بالأسعار: برياني حيدر أبادي بالدجاج واللحم، تندوري، كاري، مأكولات بحرية وخبز. اطلب عبر واتساب.",
    },
  },
  about: {
    en: {
      title: "About Mairaj Restaurant — Hyderabadi Food in Madinah | مطعم معراج",
      description: "The story of Mairaj Restaurant, a Hyderabadi and Indian kitchen in Madinah: services, catering, location and contact.",
    },
    ar: {
      title: "عن مطعم معراج — مأكولات حيدر أبادية في المدينة المنورة",
      description: "قصة مطعم معراج، مطبخ حيدر أبادي وهندي في المدينة المنورة: الخدمات، الضيافة، الموقع والتواصل.",
    },
  },
}
