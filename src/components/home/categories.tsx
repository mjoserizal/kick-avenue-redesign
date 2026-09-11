import Link from "next/link";
import Image from "next/image";
import { getBrands } from "@/lib/api";
import type { Brand } from "@/lib/api";

function getPopularBrands(brands: Brand[]) {
  return brands
    .filter((b) => b.active === 1 && b.img_url && b.popular_brand)
    .sort(
      (a, b) =>
        Number(a.popular_brand ?? 99) - Number(b.popular_brand ?? 99)
    )
    .slice(0, 10);
}

export async function CategoryGrid() {
  const brands = await getBrands().catch(() => [] as Brand[]);
  const popular = getPopularBrands(brands);

  return (
    <section className="mx-auto max-w-[1440px] px-4 lg:px-24 pb-6 lg:pb-10">
      <div className="flex gap-3 lg:gap-5 overflow-x-auto pb-2 lg:pb-0 lg:grid lg:grid-cols-10">
        {popular.map((brand) => (
          <Link
            key={brand.id}
            href={`/search?brands=${brand.slug}`}
            className="group flex shrink-0 flex-col items-center gap-2 text-center first:pl-4 lg:first:pl-0 last:pr-4 lg:last:pr-0"
          >
            <div className="flex aspect-square w-16 lg:w-full max-w-[96px] items-center justify-center overflow-hidden rounded-xl lg:rounded-2xl bg-neutral-100 p-2 transition-transform duration-200 group-hover:scale-105">
              <div className="relative h-full w-full">
                <Image
                  src={brand.img_url}
                  alt={brand.name}
                  fill
                  sizes="96px"
                  className="object-contain mix-blend-multiply"
                />
              </div>
            </div>
            <span className="text-xs lg:text-sm font-medium text-neutral-700 transition-colors group-hover:text-neutral-900">
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
    <div className="mx-auto max-w-[1440px] px-4 lg:px-24 pb-6 lg:pb-10">
      <div className="flex gap-3 lg:gap-5 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <div className="aspect-square w-16 lg:w-[96px] animate-pulse rounded-xl bg-neutral-200" />
            <div className="h-3 w-14 animate-pulse rounded bg-neutral-200 lg:h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}