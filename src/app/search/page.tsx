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
  const page = Math.max(1, parseInt(String(params.page ?? "1"), 10) || 1);

  const aggregateParams: Record<string, string | number> = {};
  if (q) aggregateParams.keyword = q;
  if (category) aggregateParams.category = category;
  if (brands) aggregateParams.brands = brands;
  if (sex) aggregateParams.sex = sex;
  if (shipping) aggregateParams.shipping = shipping;
  if (sizes) aggregateParams.sizes = sizes;

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
      availables: true,
    }).catch(() => ({ current_page: 1, total: 0, data: [] })),
    getAggregates(aggregateParams).catch(() => null),
    getBrands().catch(() => [] as Brand[]),
  ]);

  const resultData = (data as { data?: never[] }).data ?? [];

  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-24 py-6 lg:py-8">
      {category || brands ? (
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-neutral-900">Market</Link>
          <span>/</span>
          {category && (
            <>
              <span className="text-neutral-900 font-medium">{category}</span>
              {brands && <span className="text-neutral-400 mx-1">in</span>}
            </>
          )}
          {brands && (
            <span className="text-neutral-900 font-medium">
              {brands
                .split(",")
                .map((slug) => allBrands.find((b) => b.slug === slug)?.name ?? slug)
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