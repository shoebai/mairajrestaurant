import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Lang = "en" | "ar"

interface Dict {
  [key: string]: { en: string; ar: string }
}

// All static UI text lives here. Add a new key, use t('yourKey') anywhere.
const dict: Dict = {
  navHome: { en: "Home", ar: "الرئيسية" },
  navMenu: { en: "Menu", ar: "القائمة" },
  navReserve: { en: "Reserve", ar: "احجز طاولة" },
  brandTagline: { en: "Restaurant · Madinah", ar: "مطعم · المدينة المنورة" },

  heroEyebrow: { en: "Est. in the heart of Madinah", ar: "في قلب المدينة المنورة" },
  heroTitleLine1: { en: "A table set with", ar: "مائدة تحمل" },
  heroTitleEmphasis: { en: "generations", ar: "أجيالاً" },
  heroTitleLine2: { en: "of spice", ar: "من التوابل" },
  heroBody: {
    en: "Mairaj brings the slow-cooked traditions of Indian kitchens to Madinah — hand-ground spice, tandoor smoke, and recipes that have never needed updating.",
    ar: "يقدّم مائرج تقاليد المطبخ الهندي الأصيلة إلى المدينة المنورة — توابل مطحونة يدوياً، ودخان التندور، ووصفات لم تحتج يوماً للتغيير.",
  },
  heroViewMenu: { en: "View Menu", ar: "عرض القائمة" },
  heroReserveTable: { en: "Reserve a Table", ar: "احجز طاولة" },
  heroSinceDayOne: { en: "since day one", ar: "منذ اليوم الأول" },

  storyEyebrow: { en: "Our Story", ar: "قصتنا" },
  storyTitle: { en: "Every dish carries a", ar: "كل طبق يحمل" },
  storyTitleEmphasis: { en: "household recipe", ar: "وصفة بيتية" },
  storyBody: {
    en: "Mairaj began as a single kitchen and a belief that good food shouldn't be rushed. Our spices are ground fresh each morning, our bread comes straight from the tandoor, and our curries simmer for as long as they need to — not a minute less. Today, our kitchen in Madinah carries that same tradition forward, dish by dish, for guests who know the difference.",
    ar: "بدأ مائرج كمطبخ واحد وإيمان بأن الطعام الجيد لا يجب أن يُستعجل. توابلنا تُطحن طازجة كل صباح، وخبزنا يأتي مباشرة من التندور، وأطباقنا تُطهى ببطء للوقت الذي تحتاجه تماماً. اليوم، يواصل مطبخنا في المدينة المنورة هذا التقليد نفسه، طبقاً بعد طبق، لضيوف يعرفون الفرق.",
  },
  statBranches: { en: "Branch in Madinah", ar: "فرع في المدينة المنورة" },
  statDishes: { en: "Signature Dishes", ar: "طبقاً مميزاً" },
  statFresh: { en: "Ground Daily", ar: "طازج يومياً" },

  menuTeaserEyebrow: { en: "From the Kitchen", ar: "من المطبخ" },
  menuTeaserTitle: { en: "A few house favourites", ar: "بعض أشهى أطباقنا" },
  seeFullMenu: { en: "See Full Menu", ar: "عرض القائمة الكاملة" },

  galleryEyebrow: { en: "Inside Mairaj", ar: "داخل مائرج" },
  galleryTitle: { en: "A glimpse of the kitchen", ar: "لمحة من المطبخ" },
  galleryIntro: {
    en: "A closer look at the kitchen, the fire, and the room where it all comes together.",
    ar: "نظرة أقرب على المطبخ، النار، والمكان الذي يجتمع فيه كل شيء.",
  },

  findUs: { en: "Find Us", ar: "موقعنا" },
  visitMairaj: { en: "Visit Mairaj", ar: "زوروا مائرج" },
  openInMaps: { en: "Open in Google Maps", ar: "افتح في خرائط جوجل" },
  secondBranch: { en: "Second Branch", ar: "الفرع الثاني" },
  openingSoon: { en: "Opening soon — details to follow", ar: "قريباً — التفاصيل لاحقاً" },

  reserveEyebrow: { en: "Reserve a Table", ar: "احجز طاولة" },
  reserveTitle: { en: "We'll save your seat", ar: "سنحجز لك مكاناً" },
  reserveSubtitle: {
    en: "Fill in your details below — it opens WhatsApp with your request ready to send.",
    ar: "املأ بياناتك أدناه — سيفتح واتساب برسالتك جاهزة للإرسال.",
  },
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  phoneNumber: { en: "Phone Number", ar: "رقم الجوال" },
  date: { en: "Date", ar: "التاريخ" },
  time: { en: "Time", ar: "الوقت" },
  guests: { en: "Guests", ar: "عدد الضيوف" },
  guest: { en: "guest", ar: "ضيف" },
  branch: { en: "Branch", ar: "الفرع" },
  sendViaWhatsApp: { en: "Send via WhatsApp", ar: "إرسال عبر واتساب" },

  fullMenuEyebrow: { en: "The Full Menu", ar: "القائمة الكاملة" },
  fullMenuTitle: { en: "Every dish, every craving", ar: "كل طبق، كل رغبة" },
  addToOrder: { en: "Add", ar: "أضف" },
  yourOrder: { en: "Your Order", ar: "طلبك" },
  orderViaWhatsApp: { en: "Order via WhatsApp", ar: "اطلب عبر واتساب" },
  emptyOrder: { en: "No items added yet", ar: "لم تتم إضافة أي عناصر بعد" },
  items: { en: "items", ar: "عناصر" },
  clear: { en: "Clear", ar: "مسح" },
  orderType: { en: "Order Type", ar: "نوع الطلب" },
  pickup: { en: "Pickup", ar: "استلام من المطعم" },
  delivery: { en: "Delivery", ar: "توصيل" },
  deliveryAddress: { en: "Delivery Address", ar: "عنوان التوصيل" },
  deliveryAddressPlaceholder: { en: "Building, street, area...", ar: "المبنى، الشارع، الحي..." },
  viewPhoto: { en: "View photo", ar: "عرض الصورة" },

  footerTagline: {
    en: "Indian cuisine, rooted in tradition, served in the heart of Madinah.",
    ar: "مطبخ هندي أصيل، متجذر في التقاليد، يُقدَّم في قلب المدينة المنورة.",
  },
  explore: { en: "Explore", ar: "استكشف" },
  reservations: { en: "Reservations", ar: "الحجوزات" },
  contact: { en: "Contact", ar: "تواصل معنا" },
}

export function useT() {
  const { lang } = useLanguage()
  return (key: keyof typeof dict) => dict[key]?.[lang] ?? key
}

interface LanguageContextValue {
  lang: Lang
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("mairaj-lang") : null
    return saved === "ar" ? "ar" : "en"
  })

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    localStorage.setItem("mairaj-lang", lang)
  }, [lang])

  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"))

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
