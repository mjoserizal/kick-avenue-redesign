export type AppLang = "id" | "en";

const STORAGE_KEY = "ka-lang";

export const APP_DOWNLOAD_URL = "https://www.kickavenue.com";

export interface Translation {
  announcement1: string;
  announcement2: string;
  announcement3: string;
  navHome: string;
  navMarket: string;
  navSell: string;
  navTrending: string;
  navNewArrivals: string;
  searchPlaceholder: string;
  seeAll: string;
  viewAll: string;
  trendingNow: string;
  top50Subtitle: string;
  underRetail: string;
  shopTheDrop: string;
  marketplacePromise: string;
  verifiedTitle: string;
  verifiedCopy: string;
  shopMarketplace: string;
  expressShipping: string;
  expressShippingSubtitle: string;
  freshDrops: string;
  newArrivals: string;
  brandsWeLove: string;
  shopByBrand: string;
  brandFocus: string;
  startWithTrust: string;
  exploreByMood: string;
  browseAll: string;
  curatedEdits: string;
  browseCollection: string;
  items: string;
}

const dict = {
  en: {
    announcement1: "100% Authentic. Guaranteed.",
    announcement2: "Express shipping available",
    announcement3: "Free 7-day returns",
    navHome: "Home",
    navMarket: "Market",
    navSell: "Sell",
    navTrending: "Trending",
    navNewArrivals: "New Arrivals",
    searchPlaceholder: "1,000,000+ authentic items here",
    seeAll: "See All",
    viewAll: "View All",
    trendingNow: "Trending Now",
    top50Subtitle: "The most wanted sneakers, ranked right now",
    underRetail: "Under retail",
    shopTheDrop: "Shop the drop",
    marketplacePromise: "Marketplace promise",
    verifiedTitle: "Buy with confidence. Every single item is verified.",
    verifiedCopy:
      "Over 1,000,000 authentic products from trusted sellers across sneakers, apparel, luxuries and collectibles.",
    shopMarketplace: "Shop the marketplace",
    expressShipping: "Express Shipping",
    expressShippingSubtitle: "Ship today before 15.00 WIB",
    freshDrops: "Fresh drops",
    newArrivals: "New Arrivals",
    brandsWeLove: "Brands we love",
    shopByBrand: "Shop by Brand",
    brandFocus: "Brand focus",
    startWithTrust: "Start with a name you trust",
    exploreByMood: "Explore by mood",
    browseAll: "Browse all",
    curatedEdits: "Curated edits",
    browseCollection: "Browse collection",
    items: "items",
  },
  id: {
    announcement1: "100% Original. Dijamin.",
    announcement2: "Pengiriman ekspres tersedia",
    announcement3: "Retur gratis 7 hari",
    navHome: "Beranda",
    navMarket: "Market",
    navSell: "Jual",
    navTrending: "Sedang Tren",
    navNewArrivals: "Baru Masuk",
    searchPlaceholder: "1.000.000+ barang original di sini",
    seeAll: "Lihat Semua",
    viewAll: "Lihat Semua",
    trendingNow: "Sedang Tren",
    top50Subtitle: "Sneakers paling diminati saat ini",
    underRetail: "Di bawah harga retail",
    shopTheDrop: "Belanja sekarang",
    marketplacePromise: "Jaminan marketplace",
    verifiedTitle: "Belanja dengan tenang. Semua item telah diverifikasi.",
    verifiedCopy:
      "Lebih dari 1.000.000 produk original dari seller tepercaya, mulai dari sneakers, apparel, luxury, hingga koleksi.",
    shopMarketplace: "Belanja di marketplace",
    expressShipping: "Pengiriman Ekspres",
    expressShippingSubtitle: "Dikirim hari ini sebelum 15.00 WIB",
    freshDrops: "Rilisan terbaru",
    newArrivals: "Barang Baru",
    brandsWeLove: "Brand pilihan kami",
    shopByBrand: "Belanja berdasarkan Brand",
    brandFocus: "Fokus brand",
    startWithTrust: "Mulai dari nama yang tepercaya",
    exploreByMood: "Jelajahi sesuai minat",
    browseAll: "Lihat semua",
    curatedEdits: "Pilihan kurasi",
    browseCollection: "Lihat koleksi",
    items: "item",
  },
} satisfies Record<AppLang, Translation>;

export const appLangs: { value: AppLang; label: string }[] = [
  { value: "id", label: "ID" },
  { value: "en", label: "EN" },
];

export function getT(lang: AppLang): Translation {
  return dict[lang];
}

export function loadStoredLang(): AppLang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "id" || stored === "en" ? stored : "en";
}

export function storeLang(lang: AppLang): void {
  window.localStorage.setItem(STORAGE_KEY, lang);
  document.cookie = `${STORAGE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
}
