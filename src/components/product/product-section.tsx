import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import type { SearchResult } from "@/lib/api";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  linkHref,
  linkLabel = "See All",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 lg:mb-7">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-dark">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-bold tracking-tight text-neutral-950 lg:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-neutral-500">{subtitle}</p>
        )}
      </div>
      {linkHref && (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-neutral-950"
        >
          {linkLabel}
          <span className="flex size-7 items-center justify-center rounded-full border border-neutral-300 transition-all group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </Link>
      )}
    </div>
  );
}

export function ProductSection({
  title,
  eyebrow,
  subtitle,
  products,
  linkHref,
  linkLabel,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  products: SearchResult[];
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6 lg:px-24 lg:py-10">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        linkHref={linkHref}
        linkLabel={linkLabel}
      />

      <div className="relative -mx-4 overflow-hidden px-4 lg:mx-0 lg:overflow-visible lg:px-0">
        <Carousel opts={{ align: "start", skipSnaps: true }} className="w-full">
          <CarouselContent className="-ml-4 lg:-ml-5">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-[calc((100%-16px)/2.2)] min-w-0 pl-4 lg:basis-1/5 lg:pl-5 sm:basis-[calc((100%-32px)/3.1)] md:basis-1/4"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden w-9 border-neutral-200 bg-white/95 shadow-sm lg:flex lg:w-10" />
          <CarouselNext className="hidden w-9 border-neutral-200 bg-white/95 shadow-sm lg:flex lg:w-10" />
        </Carousel>
      </div>
    </section>
  );
}

export function ProductSectionSkeleton({
  eyebrow,
  title,
  subtitle,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-24 lg:py-10">
      <div className="mb-5 flex items-end justify-between lg:mb-7">
        <div>
          {eyebrow && (
            <div className="mb-1.5 h-3 w-20 animate-pulse rounded bg-neutral-200" />
          )}
          <h2 className="text-xl font-bold tracking-tight lg:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-neutral-200" />
          )}
        </div>
        {linkLabel && (
          <div className="h-8 w-24 animate-pulse rounded-full bg-neutral-200" />
        )}
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}