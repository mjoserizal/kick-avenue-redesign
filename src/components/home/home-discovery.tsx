import Link from "next/link";
import {
  ArrowUpRight,
  Box,
  Bike,
  CreditCard,
  Footprints,
  Shirt,
} from "lucide-react";
import { getAggregates, getFeaturedProducts, getSearchResults } from "@/lib/api";
import type { SearchResult } from "@/lib/api";
import { ProductSection } from "@/components/product/product-section";

const categoryCards = [
  { value: "sneakers", name: "Sneakers", icon: Footprints },
  { value: "trading cards", name: "Trading Cards", icon: CreditCard },
  { value: "apparels", name: "Apparels", icon: Shirt },
  { value: "handbags", name: "Handbags", icon: Box },
  { value: "lifestyles", name: "Lifestyles", icon: Bike },
];

const shelfLinks = [
  { title: "Top 50", subtitle: "The pairs everyone is watching", category: "sneakers", href: "/search?sort_by=most_popular&category=sneakers" },
  { title: "Sneakers top selling", subtitle: "The rotation starts here", category: "sneakers", href: "/search?sort_by=most_popular&category=sneakers" },
  { title: "Soccer edit", subtitle: "Match-day energy, off the pitch", category: "jersey", href: "/search?category=jersey" },
  { title: "Padel and tennis", subtitle: "Court-ready from first serve", category: "court", href: "/search?category=court" },
  { title: "Apparel picks", subtitle: "Layers that do more", category: "apparels", href: "/search?category=apparels" },
  { title: "Sport jerseys", subtitle: "Wear the moment", category: "jersey", href: "/search?category=jersey" },
];

async function getShelfProducts(category: string): Promise<SearchResult[]> {
  const result = await getSearchResults({
    page: 1,
    per_page: 10,
    category,
    sort_by: "most_popular",
    availables: true,
  }).catch(() => null);
  return result?.data ?? [];
}

export async function HomeCategories() {
  const facets = await getAggregates().catch(() => null);

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-8 lg:px-24 lg:py-14">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Find your next</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight lg:text-4xl">Explore by mood</h2>
        </div>
        <Link href="/search" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold hover:underline">
          Browse all <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categoryCards.map((card) => {
          const Icon = card.icon;
          const count = facets?.categories.find((category) => category.value === card.value)?.count;
          return (
            <Link
              key={card.name}
              href={`/search?category=${encodeURIComponent(card.value)}`}
              className="group relative min-h-36 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 text-neutral-900 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-lg"
            >
              <Icon className="size-7 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.6} />
              <span className="absolute bottom-4 left-4 right-3">
                <strong className="block text-base font-bold">{card.name}</strong>
                <small className="mt-1 block text-xs opacity-65">
                  {count?.toLocaleString("id-ID") ?? "Browse collection"} items
                </small>
              </span>
              <ArrowUpRight className="absolute right-4 top-4 size-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export async function HomeShelves() {
  const [featured, ...shelves] = await Promise.all([
    getFeaturedProducts().catch(() => ({ data: [] as SearchResult[] })),
    ...shelfLinks.map((shelf) => getShelfProducts(shelf.category)),
  ]);

  const fallback = featured.data;
  return (
    <>
      {shelfLinks.map((shelf, index) => (
        <ProductSection
          key={shelf.title}
          title={shelf.title}
          subtitle={shelf.subtitle}
          products={shelves[index].length ? shelves[index] : fallback}
          linkHref={shelf.href}
        />
      ))}
    </>
  );
}
