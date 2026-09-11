import { Suspense } from "react";
import Image from "next/image";
import { Hero } from "@/components/home/hero";
import { CategoryGrid, CategoryGridSkeleton } from "@/components/home/categories";
import {
  ProductSection,
  ProductSectionSkeleton,
} from "@/components/product/product-section";
import { getFeaturedProducts, getNewArrivals } from "@/lib/api";
import { WhatsappButton } from "@/components/whatsapp-button";
import {
  HomeCategories,
  HomeShelves,
} from "@/components/home/home-discovery";
import { ServiceRail } from "@/components/home/service-rail";

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">
        Kick Avenue - Indonesia&apos;s Trusted Marketplace for Authentic
        Sneakers, Apparel, Luxury &amp; Collectibles
      </h1>

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1440px] px-4 lg:px-24 py-4 lg:py-8">
            <div className="aspect-[16/5] animate-pulse rounded-xl bg-neutral-200" />
          </div>
        }
      >
        <Hero />
      </Suspense>

      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoryGrid />
      </Suspense>

      <HomeCategories />
      <ServiceRail />

      <Suspense
        fallback={
          <ProductSectionSkeleton
            title="Trending Now"
            subtitle="Most popular items right now"
          />
        }
      >
        <TrendingSection />
      </Suspense>

      <Suspense
        fallback={
          <ProductSectionSkeleton
            title="New Arrivals"
            subtitle="Fresh drops added recently"
          />
        }
      >
        <NewArrivalsSection />
      </Suspense>

      <Suspense
        fallback={
          <ProductSectionSkeleton
            title="Curated edits"
            subtitle="Fresh finds across every corner of the marketplace"
          />
        }
      >
        <HomeShelves />
      </Suspense>

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1440px] px-4 lg:px-24 py-6 lg:py-10">
            <div className="h-7 w-48 animate-pulse rounded bg-neutral-200" />
            <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 lg:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-neutral-100"
                />
              ))}
            </div>
          </div>
        }
      >
        <BrandSection />
      </Suspense>

      <WhatsappButton />
    </>
  );
}

async function TrendingSection() {
  const data = await getFeaturedProducts();
  return (
    <ProductSection
      title="Trending Now"
      subtitle="Most popular items right now"
      products={data.data.slice(0, 10)}
      linkHref="/search?sort_by=most_popular"
    />
  );
}

async function NewArrivalsSection() {
  const data = await getNewArrivals();
  return (
    <ProductSection
      title="New Arrivals"
      subtitle="Fresh drops added recently"
      products={data.data.slice(0, 10)}
      linkHref="/search?sort_by=latest"
    />
  );
}

async function BrandSection() {
  const { getBrands } = await import("@/lib/api");
  const brands = await getBrands().catch(() => []);
  const popular = brands
    .filter((b) => b.active === 1 && b.img_url && b.popular_brand)
    .sort(
      (a, b) =>
        Number(a.popular_brand ?? 99) - Number(b.popular_brand ?? 99)
    )
    .slice(0, 12);

  if (!popular.length) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 lg:px-24 py-6 lg:py-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-lg lg:text-2xl font-bold tracking-tight">
          Shop by Brand
        </h2>
        <a
          href="/search"
          className="shrink-0 text-sm font-semibold text-neutral-900 hover:underline"
        >
          See All →
        </a>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 lg:gap-5">
        {popular.map((brand) => (
          <a
            key={brand.id}
            href={`/search?brands=${brand.slug}`}
            className="group flex aspect-square items-center justify-center rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-400 hover:shadow-sm"
          >
            <div className="relative h-14 w-full">
              <Image
                src={brand.signed_url || brand.img_url}
                alt={brand.name}
                fill
                sizes="120px"
                className="object-contain opacity-80 transition-all group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}