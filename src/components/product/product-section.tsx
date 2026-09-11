import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import type { SearchResult } from "@/lib/api";

export function ProductSection({
  title,
  subtitle,
  products,
  linkHref,
  linkLabel = "See All",
}: {
  title: string;
  subtitle?: string;
  products: SearchResult[];
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 lg:px-24 py-6 lg:py-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-lg lg:text-2xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
          )}
        </div>
        {linkHref && (
          <Link
            href={linkHref}
            className="shrink-0 text-sm font-semibold text-neutral-900 hover:underline"
          >
            {linkLabel} →
          </Link>
        )}
      </div>

      <div className="relative -mx-4 overflow-hidden px-4 lg:mx-0 lg:overflow-visible lg:px-0">
        <Carousel
          opts={{ align: "start", skipSnaps: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 lg:-ml-5">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 lg:pl-5 basis-[calc((100%-48px)/4.15)] sm:basis-[calc((100%-60px)/3.15)] md:basis-1/4 lg:basis-1/5 min-w-0"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

export function ProductSectionSkeleton({
  title,
  subtitle,
  linkLabel,
}: {
  title: string;
  subtitle?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-24 py-6 lg:py-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-lg lg:text-2xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-neutral-200" />
          )}
        </div>
        {linkLabel && (
          <div className="h-4 w-14 animate-pulse rounded bg-neutral-200" />
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}