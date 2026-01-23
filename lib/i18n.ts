export const translations = {
  en: {
    // Navigation
    home: "Home",
    categories: "Categories",
    cart: "Cart",
    profile: "Profile",
    search: "Search for electronics...",

    // Categories
    smartphones: "Smartphones",
    laptops: "Laptops",
    tablets: "Tablets",
    smartwatches: "Smartwatches",
    headphones: "Headphones",
    cameras: "Cameras",
    gaming: "Gaming",
    accessories: "Accessories",
    allProducts: "All Products",

    // Product
    addToCart: "Add to Cart",
    specifications: "Specifications",
    reviews: "Reviews",
    description: "Description",
    price: "Price",
    inStock: "In Stock",
    outOfStock: "Out of Stock",

    // Cart
    cartEmpty: "Your cart is empty",
    continueShopping: "Continue Shopping",
    checkout: "Checkout",
    payWithPi: "Pay with Pi",
    total: "Total",
    subtotal: "Subtotal",
    quantity: "Quantity",
    remove: "Remove",

    // User
    myProfile: "My Profile",
    orderHistory: "Order History",
    savedProducts: "Saved Products",
    logout: "Logout",
    piUsername: "Pi Username",

    // Payment
    paymentSuccess: "Payment Successful!",
    paymentFailed: "Payment Failed",
    processingPayment: "Processing Payment...",

    // Common
    loading: "Loading...",
    error: "Error",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    categories: "الفئات",
    cart: "السلة",
    profile: "الملف الشخصي",
    search: "ابحث عن الإلكترونيات...",

    // Categories
    smartphones: "الهواتف الذكية",
    laptops: "اللابتوب",
    tablets: "الأجهزة اللوحية",
    smartwatches: "الساعات الذكية",
    headphones: "سماعات الرأس",
    cameras: "الكاميرات",
    gaming: "الألعاب",
    accessories: "الإكسسوارات",
    allProducts: "جميع المنتجات",

    // Product
    addToCart: "أضف إلى السلة",
    specifications: "المواصفات",
    reviews: "التقييمات",
    description: "الوصف",
    price: "السعر",
    inStock: "متوفر",
    outOfStock: "غير متوفر",

    // Cart
    cartEmpty: "سلتك فارغة",
    continueShopping: "متابعة التسوق",
    checkout: "الدفع",
    payWithPi: "ادفع بعملة Pi",
    total: "الإجمالي",
    subtotal: "المجموع الفرعي",
    quantity: "الكمية",
    remove: "إزالة",

    // User
    myProfile: "ملفي الشخصي",
    orderHistory: "سجل الطلبات",
    savedProducts: "المنتجات المحفوظة",
    logout: "تسجيل الخروج",
    piUsername: "اسم مستخدم Pi",

    // Payment
    paymentSuccess: "تم الدفع بنجاح!",
    paymentFailed: "فشل الدفع",
    processingPayment: "جاري معالجة الدفع...",

    // Common
    loading: "جاري التحميل...",
    error: "خطأ",
    close: "إغلاق",
    save: "حفظ",
    cancel: "إلغاء",
  },
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

export function t(key: TranslationKey, lang: Language = "en"): string {
  return translations[lang][key]
}
