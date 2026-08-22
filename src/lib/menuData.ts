export interface MenuItem {
  name: string
  desc: string
  price: string
  category: string
  video?: string
  featured?: boolean
}

// Replace desc/price with your real menu, and add a `video` field
// (e.g. video: '/videos/butter-chicken.mp4') to any dish with a clip.
export const menu: MenuItem[] = [
  {
    name: "Butter Chicken",
    desc: "Tandoor-grilled chicken simmered in a velvet tomato-butter gravy",
    price: "28",
    category: "Signature Mains",
    featured: true,
  },
  {
    name: "Mutton Rogan Josh",
    desc: "Slow-braised lamb, Kashmiri chilli, whole warm spices",
    price: "34",
    category: "Signature Mains",
    featured: true,
  },
  {
    name: "Paneer Tikka Masala",
    desc: "Charred cottage cheese in a smoky cashew-tomato sauce",
    price: "24",
    category: "Signature Mains",
  },
  {
    name: "Dal Makhani",
    desc: "Black lentils, butter, cream, simmered overnight",
    price: "18",
    category: "Vegetarian",
  },
  {
    name: "Chana Masala",
    desc: "Chickpeas in a tangy onion-tomato masala",
    price: "16",
    category: "Vegetarian",
  },
  {
    name: "Vegetable Biryani",
    desc: "Basmati layered with garden vegetables and saffron",
    price: "20",
    category: "Biryani & Rice",
  },
  {
    name: "Hyderabadi Chicken Biryani",
    desc: "Long-grain basmati, slow-dum cooked with chicken and saffron",
    price: "26",
    category: "Biryani & Rice",
    featured: true,
  },
  {
    name: "Mutton Biryani",
    desc: "Fragrant basmati layered with tender mutton, dum-sealed",
    price: "32",
    category: "Biryani & Rice",
  },
  {
    name: "Garlic Naan",
    desc: "Tandoor bread, roasted garlic, fresh coriander",
    price: "6",
    category: "Breads",
  },
  {
    name: "Tandoori Roti",
    desc: "Whole wheat bread, baked fresh to order",
    price: "4",
    category: "Breads",
  },
  {
    name: "Seekh Kebab",
    desc: "Spiced minced lamb, char-grilled on skewers",
    price: "22",
    category: "Starters",
  },
  {
    name: "Chicken Tikka",
    desc: "Yogurt-marinated chicken, smoked in the tandoor",
    price: "20",
    category: "Starters",
  },
  {
    name: "Gulab Jamun",
    desc: "Warm milk dumplings in cardamom-rose syrup",
    price: "12",
    category: "Desserts",
  },
  {
    name: "Kheer",
    desc: "Slow-cooked rice pudding, saffron, pistachio",
    price: "12",
    category: "Desserts",
  },
]

export const categories = Array.from(new Set(menu.map((m) => m.category)))
