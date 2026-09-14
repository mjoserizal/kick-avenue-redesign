import Link from "next/link";
import Image from "next/image";
import { getBrands } from "@/lib/api";
import type { Brand } from "@/lib/api";
import { SectionHeading } from "@/components/product/product-section";
import { getServerT } from "@/lib/server-i18n";

function getPopularBrands(brands: Brand[]) {
  return brands
    .filter((b) => b.active === 1 && b.img_url && b.popular_brand)
    .sort(
      (a, b) => Number(a.popular_brand ?? 99) - Number(b.popular_brand ?? 99),
    )
    .slice(0, 10);
}

export async function CategoryGrid() {
  const brands = await getBrands().catch(() => [] as Brand[]);
  const popular = getPopularBrands(brands);
  const t = await getServerT();

  if (!popular.length) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-8 lg:px-24 lg:py-12">
      <SectionHeading
        eyebrow={t.brandFocus}
        title={t.startWithTrust}
        linkHref="/search"
        linkLabel={t.viewAll}
      />
      <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-10 lg:gap-4 lg:overflow-visible lg:pb-0">
        {popular.map((brand) => (
          <Link
            key={brand.id}
            href={`/search?brands=${brand.slug}`}
            className="group flex shrink-0 flex-col items-center gap-2.5 text-center first:pl-1 lg:first:pl-0 last:pr-1 lg:last:pr-0"
          >
            <div className="flex aspect-square w-16 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-neutral-950 group-hover:shadow-md lg:w-full lg:max-w-[110px]">
              <div className="relative h-12 w-full">
                <Image
                  src={brand.signed_url || brand.img_url}
                  alt={brand.name}
                  fill
                  sizes="120px"
                  className="object-contain opacity-80 mix-blend-multiply transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
                />
              </div>
            </div>
            <span className="text-xs font-medium text-neutral-600 transition-colors group-hover:text-neutral-950 lg:text-sm">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-24 lg:py-12">
      <div className="flex gap-3 overflow-hidden lg:grid lg:grid-cols-10 lg:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex shrink-0 flex-col items-center gap-2.5">
            <div className="aspect-square w-16 animate-pulse rounded-2xl bg-neutral-200 lg:w-[110px]" />
            <div className="h-3 w-14 animate-pulse rounded bg-neutral-200 lg:h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
