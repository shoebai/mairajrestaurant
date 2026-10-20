import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Lang = "en" | "ar"

interface Dict {
  [key: string]: { en: string; ar: string }
}

// All static UI text lives here. Add a new key, use t('yourKey') anywhere.
const dict: Dict = {
  navHome: { en: "Home", ar: "الرئيسية" },
  navMenu: { en: "Menu", ar: "القائمة" },
  navAbout: { en: "About", ar: "من نحن" },
  navReserve: { en: "Reserve", ar: "احجز طاولة" },
  navReserveTable: { en: "Reserve a table", ar: "احجز طاولة" },
  brandArabic: { en: "مطعم معراج", ar: "Mairaj Restaurant" },
  heritageEyebrow: { en: "From Hyderabad, with patience", ar: "من حيدر أباد، بكل صبر" },
  heritageTitle: { en: "The old way of making biryani, in Madinah.", ar: "البرياني على الطريقة الأصيلة، في المدينة المنورة." },
  heritageBody: {
    en: "Rice and meat sealed together and slow-cooked on dum, the way Hyderabadi kitchens have done it for generations.",
    ar: "أرز ولحم يُغلقان معاً ويُطهيان على نار هادئة بطريقة الدم، كما تفعل مطابخ حيدر أباد منذ أجيال.",
  },
  heritageSecondLine: { en: "برياني حيدر أبادي على الطريقة الأصيلة", ar: "" },
  heritageExplore: { en: "Explore the menu", ar: "تصفح القائمة" },
  heritageOrderWhatsApp: { en: "Order on WhatsApp", ar: "اطلب عبر واتساب" },
  infoEveryDay: { en: "Every day", ar: "يومياً" },
  infoHours: { en: "1 PM – 12 AM", ar: "١ ظهراً – ١٢ منتصف الليل" },
  infoCallWhatsApp: { en: "Call or WhatsApp", ar: "اتصال أو واتساب" },
  infoDineIn: { en: "Dine in or take away", ar: "تناول في المطعم أو سفري" },
  infoFamilies: { en: "Families welcome", ar: "نرحب بالعائلات" },
  favouritesEyebrow: { en: "From the tandoor & the kadai", ar: "من التنور والكداي" },
  favouritesTitle: { en: "Dishes guests come back for", ar: "أطباق يعود الضيوف من أجلها" },
  biryaniEyebrow: { en: "The biryani house", ar: "بيت البرياني" },
  biryaniTitle: { en: "One pot, sealed to order.", ar: "قدر واحد، يُغلق عند الطلب." },
  biryaniBody: {
    en: "Every biryani is layered and sealed when you order. Ask for extra raita and mirchi ka salan.",
    ar: "كل برياني يُرتّب ويُغلق عند طلبك. اطلب رائتة إضافية وصالونة الفلفل.",
  },
  menuSearch: { en: "Search dishes", ar: "ابحث عن طبق" },
  menuPageTitle: { en: "Our menu", ar: "قائمة الطعام" },
  menuPageOther: { en: "قائمة الطعام", ar: "Our menu" },
  menuAll: { en: "All", ar: "الكل" },
  menuNoMatch: { en: "No dishes match your search.", ar: "لا توجد أطباق مطابقة لبحثك." },
  menuDishes: { en: "dishes · prices in SAR", ar: "طبقاً · الأسعار بالريال" },
  menuItemsCount: { en: "items", ar: "عناصر" },
  menuViewOrder: { en: "View order", ar: "عرض الطلب" },
  menuTotal: { en: "Total", ar: "المجموع" },
  menuResults: { en: "results", ar: "نتيجة" },
  menuClearSearch: { en: "Clear search", ar: "مسح البحث" },
  menuScrollLeft: { en: "Scroll categories left", ar: "تمرير الأقسام لليسار" },
  menuScrollRight: { en: "Scroll categories right", ar: "تمرير الأقسام لليمين" },
  menuSubtotal: { en: "Items total", ar: "مجموع الأصناف" },
  menuDeliveryFee: { en: "Delivery charge", ar: "رسوم التوصيل" },
  menuDeliveryFeeValue: { en: "Confirmed on WhatsApp", ar: "تُؤكد عبر واتساب" },
  menuDeliveryNote: {
    en: "Delivery charges apply and depend on your area. We'll confirm the final total with you on WhatsApp before preparing your order.",
    ar: "تُطبق رسوم توصيل حسب منطقتك. سنؤكد لك المبلغ النهائي عبر واتساب قبل تجهيز طلبك.",
  },
  menuPickupNote: {
    en: "Pickup from Mairaj Restaurant, Madinah. We'll message you on WhatsApp when your order is ready.",
    ar: "الاستلام من مطعم معراج، المدينة المنورة. سنراسلك عبر واتساب عندما يكون طلبك جاهزاً.",
  },
  menuUseLocation: { en: "Use my current location", ar: "استخدم موقعي الحالي" },
  menuLocating: { en: "Finding your location…", ar: "جارٍ تحديد موقعك…" },
  menuLocationAdded: { en: "Location pinned", ar: "تم تحديد الموقع" },
  menuLocationView: { en: "Check on map", ar: "عرض على الخريطة" },
  menuLocationRemove: { en: "Remove", ar: "إزالة" },
  menuLocationDenied: {
    en: "Location access was blocked. Allow it in your browser settings, or type your address instead.",
    ar: "تم رفض الوصول إلى الموقع. اسمح به من إعدادات المتصفح أو اكتب عنوانك.",
  },
  menuLocationFailed: { en: "Couldn't find your location. Please type your address.", ar: "تعذر تحديد موقعك. يرجى كتابة عنوانك." },
  menuAddressOrLocation: {
    en: "Add your address or pin your location to continue.",
    ar: "أضف عنوانك أو حدد موقعك للمتابعة.",
  },
  menuAddressOptional: { en: "Building, street, landmark (helps the driver)", ar: "المبنى، الشارع، معلم قريب (يساعد السائق)" },
  menuOrderNote: { en: "Notes for the kitchen", ar: "ملاحظات للمطبخ" },
  menuOrderNotePlaceholder: {
    en: "e.g. make it extra spicy, 2 extra roti, extra rice",
    ar: "مثلاً: حار جداً، ٢ خبز روتي إضافي، أرز إضافي",
  },
  menuNoteSpicy: { en: "Extra spicy", ar: "حار جداً" },
  menuNoteMild: { en: "Less spicy", ar: "قليل الحرارة" },
  menuNoteRoti: { en: "Extra roti", ar: "روتي إضافي" },
  menuNoteRice: { en: "Extra rice", ar: "أرز إضافي" },
  menuNoteRaita: { en: "Extra raita", ar: "رائتة إضافية" },
  menuNoteOnion: { en: "No onion", ar: "بدون بصل" },
  navFindUs: { en: "Find us", ar: "موقعنا" },
  navCall: { en: "Call", ar: "اتصل" },
  navWhatsApp: { en: "WhatsApp", ar: "واتساب" },
  navDirections: { en: "Directions", ar: "الاتجاهات" },
  navOpenMenu: { en: "Open menu", ar: "فتح القائمة" },
  navCloseMenu: { en: "Close menu", ar: "إغلاق القائمة" },
  navOpenDaily: { en: "Open daily, 1 PM – 12 AM", ar: "مفتوح يومياً، ١ ظهراً – ١٢ منتصف الليل" },
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

  offersEyebrow: { en: "Special Offers", ar: "عروض خاصة" },
  offersTitle: { en: "This week at Mairaj", ar: "هذا الأسبوع في مائرج" },

  aboutEyebrow: { en: "About Us", ar: "من نحن" },
  aboutTitle: { en: "Mairaj Restaurant", ar: "مطعم مائرج" },
  aboutStoryTitle: { en: "Our Story", ar: "قصتنا" },
  aboutServicesTitle: { en: "Our Services", ar: "خدماتنا" },
  aboutStaffTitle: { en: "Our Team", ar: "فريقنا" },
  aboutCateringTitle: { en: "Catering", ar: "خدمة الضيافة" },
  aboutLocationTitle: { en: "Location", ar: "الموقع" },
  aboutContactTitle: { en: "Contact", ar: "تواصل معنا" },
}

export function useT() {
  const { lang } = useLanguage()
  return (key: keyof typeof dict) => dict[key]?.[lang] ?? key
}

/** Built-in text for a key in a specific language (used by the admin panel). */
export function translate(key: keyof typeof dict, lang: Lang) {
  return dict[key]?.[lang] ?? ""
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
