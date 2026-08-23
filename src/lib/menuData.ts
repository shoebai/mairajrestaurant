export interface MenuItem {
  name: string
  nameAr?: string
  desc: string
  descAr?: string
  price: string
  category: string
  categoryAr?: string
  video?: string
  image?: string
  featured?: boolean
}

// PLACEHOLDER DATA — replace with your real menu.
// Fill in `nameAr`/`descAr` for Arabic; add `video`/`image` per dish as needed.
export const menu: MenuItem[] = [
  {
    name: "Butter Chicken",
    nameAr: "بتر تشيكن",
    desc: "Tandoor-grilled chicken simmered in a velvet tomato-butter gravy",
    descAr: "دجاج مشوي بالتندور مطهو في صلصة الطماطم والزبدة",
    price: "28",
    category: "Signature Mains",
    categoryAr: "الأطباق الرئيسية المميزة",
    featured: true,
  },
  {
    name: "Mutton Rogan Josh",
    nameAr: "روغان جوش لحم",
    desc: "Slow-braised lamb, Kashmiri chilli, whole warm spices",
    descAr: "لحم ضأن مطهو ببطء، فلفل كشميري، وتوابل دافئة كاملة",
    price: "34",
    category: "Signature Mains",
    categoryAr: "الأطباق الرئيسية المميزة",
    featured: true,
  },
  {
    name: "Paneer Tikka Masala",
    nameAr: "بانير تكة مسالا",
    desc: "Charred cottage cheese in a smoky cashew-tomato sauce",
    descAr: "جبن بانير مشوي في صلصة الكاجو والطماطم المدخنة",
    price: "24",
    category: "Signature Mains",
    categoryAr: "الأطباق الرئيسية المميزة",
  },
  {
    name: "Dal Makhani",
    nameAr: "دال مخاني",
    desc: "Black lentils, butter, cream, simmered overnight",
    descAr: "عدس أسود، زبدة، وكريمة، مطهو طوال الليل",
    price: "18",
    category: "Vegetarian",
    categoryAr: "أطباق نباتية",
  },
  {
    name: "Hyderabadi Chicken Biryani",
    nameAr: "برياني دجاج حيدر آبادي",
    desc: "Long-grain basmati, slow-dum cooked with chicken and saffron",
    descAr: "أرز بسمتي طويل الحبة مطهو مع الدجاج والزعفران",
    price: "26",
    category: "Biryani & Rice",
    categoryAr: "البرياني والأرز",
    featured: true,
  },
  {
    name: "Mutton Biryani",
    nameAr: "برياني لحم",
    desc: "Fragrant basmati layered with tender mutton, dum-sealed",
    descAr: "أرز بسمتي عطر مع طبقات من لحم الضأن الطري",
    price: "32",
    category: "Biryani & Rice",
    categoryAr: "البرياني والأرز",
  },
  {
    name: "Garlic Naan",
    nameAr: "نان بالثوم",
    desc: "Tandoor bread, roasted garlic, fresh coriander",
    descAr: "خبز التندور مع الثوم المحمص والكزبرة الطازجة",
    price: "6",
    category: "Breads",
    categoryAr: "الخبز",
  },
  {
    name: "Seekh Kebab",
    nameAr: "سيخ كباب",
    desc: "Spiced minced lamb, char-grilled on skewers",
    descAr: "لحم ضأن مفروم متبل، مشوي على أسياخ",
    price: "22",
    category: "Starters",
    categoryAr: "المقبلات",
  },
  {
    name: "Gulab Jamun",
    nameAr: "جولاب جامون",
    desc: "Warm milk dumplings in cardamom-rose syrup",
    descAr: "كرات حليب دافئة في شراب الهيل والورد",
    price: "12",
    category: "Desserts",
    categoryAr: "الحلويات",
  },
]

export const categories = Array.from(new Set(menu.map((m) => m.category)))
