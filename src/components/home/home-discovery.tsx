import Link from "next/link";
import {
  ArrowUpRight,
  Box,
  Bike,
  CreditCard,
  Footprints,
  Shirt,
} from "lucide-react";
import {
  getAggregates,
  getFeaturedProducts,
  getSearchResults,
} from "@/lib/api";
import type { SearchResult } from "@/lib/api";
import {
  ProductSection,
  SectionHeading,
} from "@/components/product/product-section";
import { getServerT } from "@/lib/server-i18n";

const categoryCards = [
  {
    value: "sneakers",
    name: "Sneakers",
    icon: Footprints,
  },
  {
    value: "trading cards",
    name: "Trading Cards",
    icon: CreditCard,
  },
  {
    value: "apparels",
    name: "Apparels",
    icon: Shirt,
  },
  {
    value: "handbags",
    name: "Handbags",
    icon: Box,
  },
  {
    value: "lifestyles",
    name: "Lifestyles",
    icon: Bike,
  },
];

const shelfLinks = [
  {
    title: "Top 50",
    subtitle: "The pairs everyone is watching",
    category: "sneakers",
    href: "/search?sort_by=most_popular&category=sneakers",
  },
  {
    title: "Sneakers top selling",
    subtitle: "The rotation starts here",
    category: "sneakers",
    href: "/search?sort_by=most_popular&category=sneakers",
  },
  {
    title: "Soccer edit",
    subtitle: "Match-day energy, off the pitch",
    category: "apparels",
    href: "/search?category=apparels",
  },
  {
    title: "Padel and tennis",
    subtitle: "Court-ready from first serve",
    category: "sneakers",
    href: "/search?sort_by=most_popular&category=sneakers",
  },
  {
    title: "Apparel picks",
    subtitle: "Layers that do more",
    category: "apparels",
    href: "/search?category=apparels",
  },
  {
    title: "Sport jerseys",
    subtitle: "Wear the moment",
    category: "apparels",
    href: "/search?category=apparels",
  },
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
  const t = await getServerT();

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-8 lg:px-24 lg:py-14">
      <SectionHeading
        eyebrow={t.exploreByMood}
        title={t.exploreByMood}
        linkHref="/search"
        linkLabel={t.browseAll}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {categoryCards.map((card) => {
          const Icon = card.icon;
          const count = facets?.categories.find(
            (category) => category.value === card.value,
          )?.count;
          return (
            <Link
              key={card.name}
              href={`/search?category=${encodeURIComponent(card.value)}`}
              className={`group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-neutral-50 to-white p-4 text-neutral-900 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-neutral-950 hover:shadow-lg lg:min-h-44 lg:p-5`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex size-10 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-sm transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <ArrowUpRight className="size-4 text-neutral-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <span className="mt-6">
                <strong className="block text-base font-bold">
                  {card.name}
                </strong>
                <small className="mt-1 block text-xs text-neutral-500">
                  {count?.toLocaleString("id-ID") ?? t.browseCollection}{" "}
                  {t.items}
                </small>
              </span>
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
  const t = await getServerT();
  return (
    <>
      {shelfLinks.map((shelf, index) => (
        <ProductSection
          key={shelf.title}
          eyebrow={t.curatedEdits}
          title={shelf.title}
          subtitle={shelf.subtitle}
          products={shelves[index].length ? shelves[index] : fallback}
          linkHref={shelf.href}
        />
      ))}
    </>
  );
}
