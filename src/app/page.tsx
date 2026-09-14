import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Top50Banner, Top50BannerSkeleton } from "@/components/home/top50-banner";
import {
  CategoryGrid,
  CategoryGridSkeleton,
} from "@/components/home/categories";
import {
  ProductSection,
  ProductSectionSkeleton,
  SectionHeading,
} from "@/components/product/product-section";
import {
  getFeaturedProducts,
  getNewArrivals,
  getSearchResults,
} from "@/lib/api";
import { WhatsappButton } from "@/components/whatsapp-button";
import { HomeCategories, HomeShelves } from "@/components/home/home-discovery";
import { ServiceRail } from "@/components/home/service-rail";

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">
        Kick Avenue - Indonesia&apos;s Trusted Marketplace for Authentic
        Sneakers, Apparel, Luxury &amp; Collectibles
      </h1>

      <Suspense fallback={<HeroFallback />}>
        <Hero />
      </Suspense>

      <Suspense fallback={<Top50BannerSkeleton />}>
        <Top50Banner />
      </Suspense>

      <Suspense
        fallback={
          <ProductSectionSkeleton
            title="Express Shipping"
            subtitle="Ship today before 15.00 WIB"
            linkLabel="View All"
          />
        }
      >
        <ExpressShippingSection />
      </Suspense>

      <ServiceRail />

      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoryGrid />
      </Suspense>

      <HomeCategories />

      <PromoBand />

      <Suspense
        fallback={
          <ProductSectionSkeleton
            eyebrow="Hype"
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
            eyebrow="Fresh drops"
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
            eyebrow="Curated edits"
            title="Curated edits"
            subtitle="Fresh finds across every corner of the marketplace"
          />
        }
      >
        <HomeShelves />
      </Suspense>

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-24 lg:py-10">
            <div className="mb-5 h-8 w-48 animate-pulse rounded bg-neutral-200" />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl bg-neutral-100"
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

function HeroFallback() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-3 lg:px-24 lg:py-6">
      <div className="aspect-[16/7] animate-pulse rounded-2xl bg-neutral-200 lg:aspect-[16/5]" />
    </div>
  );
}

function PromoBand() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6 lg:px-24 lg:py-8">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-800 to-brand-dark lg:rounded-3xl">
        <div className="grid items-center gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-12">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              <BadgeCheck className="size-4" />
              Marketplace promise
            </p>
            <h2 className="max-w-xl text-2xl font-bold leading-tight tracking-tight text-white lg:text-4xl">
              Buy with confidence. Every single item is verified.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-300">
              Over 1,000,000 authentic products from trusted sellers across
              sneakers, apparel, luxuries and collectibles.
            </p>
          </div>
          <Link
            href="/search"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-brand-soft"
          >
            Shop the marketplace
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

async function TrendingSection() {
  const data = await getFeaturedProducts();
  return (
    <ProductSection
      eyebrow="Hype"
      title="Trending Now"
      subtitle="Most popular items right now"
      products={data.data.slice(0, 10)}
      linkHref="/search?sort_by=most_popular"
    />
  );
}

async function ExpressShippingSection() {
  const data = await getSearchResults({
    page: 1,
    per_page: 10,
    availables: true,
    sneakers_condition: "pre_verified",
    sort_by: "featured_item_score_desc",
  });
  return (
    <ProductSection
      title="Express Shipping"
      subtitle="Ship today before 15.00 WIB"
      products={data.data}
      linkHref="/search?availables=true&sneakers_condition=pre_verified&sort_by=featured_item_score_desc"
      linkLabel="View All"
    />
  );
}

async function NewArrivalsSection() {
  const data = await getNewArrivals();
  return (
    <ProductSection
      eyebrow="Fresh drops"
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
      (a, b) => Number(a.popular_brand ?? 99) - Number(b.popular_brand ?? 99),
    )
    .slice(0, 12);

  if (!popular.length) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6 lg:px-24 lg:py-10">
      <SectionHeading
        eyebrow="Brands we love"
        title="Shop by Brand"
        linkHref="/search"
        linkLabel="See All"
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:gap-4">
        {popular.map((brand) => (
          <a
            key={brand.id}
            href={`/search?brands=${brand.slug}`}
            className="group flex aspect-square items-center justify-center rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-950 hover:shadow-md lg:p-5"
          >
            <div className="relative h-12 w-full lg:h-14">
              <Image
                src={brand.signed_url || brand.img_url}
                alt={brand.name}
                fill
                sizes="120px"
                className="object-contain opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}