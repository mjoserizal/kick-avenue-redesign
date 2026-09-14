import { SearchPageClient } from "@/components/search/search-page-client";
import { getSearchResults, getAggregates, getBrands } from "@/lib/api";
import type { Brand } from "@/lib/api";
import Link from "next/link";

export const metadata = {
  title: "Market - Kick Avenue Redesign",
  description:
    "Browse and search authenticated sneakers, apparel, luxury and collectibles.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const brands = typeof params.brands === "string" ? params.brands : "";
  const sex = typeof params.sex === "string" ? params.sex : "";
  const shipping = typeof params.shipping === "string" ? params.shipping : "";
  const sizes = typeof params.sizes === "string" ? params.sizes : "";
  const sort_by =
    typeof params.sort_by === "string" ? params.sort_by : "most_popular";
  const under_retail =
    typeof params.under_retail === "string" ? params.under_retail : "";
  const start_price =
    typeof params.start_price === "string" ? params.start_price : "";
  const page = Math.max(1, parseInt(String(params.page ?? "1"), 10) || 1);

  const aggregateParams: Record<string, string | number> = {};
  if (q) aggregateParams.keyword = q;
  if (category) aggregateParams.category = category;
  if (brands) aggregateParams.brands = brands;
  if (sex) aggregateParams.sex = sex;
  if (shipping) aggregateParams.shipping = shipping;
  if (sizes) aggregateParams.sizes = sizes;
  if (under_retail) aggregateParams.under_retail = under_retail;
  if (start_price) aggregateParams.start_price = start_price;

  const [data, facets, allBrands] = await Promise.all([
    getSearchResults({
      page,
      per_page: 20,
      keyword: q,
      sort_by,
      category,
      brands,
      sex,
      shipping,
      sizes,
      under_retail,
      start_price,
      availables: true,
    }).catch(() => ({ current_page: 1, total: 0, data: [] })),
    getAggregates(aggregateParams).catch(() => null),
    getBrands().catch(() => [] as Brand[]),
  ]);

  const resultData = (data as { data?: never[] }).data ?? [];
  const categoryLabel =
    facets?.categories.find((item) => item.value === category)?.label ??
    category;

  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-24 py-6 lg:py-8">
      {category || brands ? (
        <nav className="no-scrollbar mb-6 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
          <Link href="/" className="transition-colors hover:text-neutral-950">
            Home
          </Link>
          <span className="text-neutral-300">/</span>
          <Link
            href="/search"
            className="transition-colors hover:text-neutral-950"
          >
            Market
          </Link>
          <span className="text-neutral-300">/</span>
          {category && (
            <>
              <span className="font-medium text-neutral-950">
                {formatCategoryLabel(categoryLabel)}
              </span>
              {brands && <span className="mx-1 text-neutral-400">in</span>}
            </>
          )}
          {brands && (
            <span className="font-medium text-neutral-950">
              {brands
                .split(",")
                .map(
                  (slug) =>
                    allBrands.find((b) => b.slug === slug)?.name ?? slug,
                )
                .join(", ")}
            </span>
          )}
        </nav>
      ) : null}

      <SearchPageClient
        initialResults={resultData}
        total={(data as { total?: number }).total ?? 0}
        initialPage={page}
        initialQuery={q}
        initialSort={sort_by}
        facets={facets}
      />
    </div>
  );
}

function formatCategoryLabel(label: string): string {
  return label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
