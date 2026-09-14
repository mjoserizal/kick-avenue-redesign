import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, TicketPercent } from "lucide-react";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/product/product-card";
import { SectionHeading } from "@/components/product/product-section";
import { getFeaturedProducts } from "@/lib/api";
import { getServerT } from "@/lib/server-i18n";

const COLLECTION_IMAGE_BASE =
  "https://kickavenue-assets.s3.amazonaws.com/collections";

const promo = {
  eyebrow: "Under retail",
  title: "UP TO 70%",
  copy: "Authentic sneakers priced below retail — the best deals drop here.",
  href: "/search?sort_by=most_popular&under_retail=true&category=sneakers&start_price=459000",
};

const sports = [
  {
    index: "01",
    title: "Running",
    slug: "running-sneakers",
    tagline: "Performance sneakers",
    image: `${COLLECTION_IMAGE_BASE}/804/90c352cbfd39aa0845f8786a6ef66a97.jpg`,
  },
  {
    index: "02",
    title: "Court",
    slug: "tennis-padel",
    tagline: "Court sneakers",
    image: `${COLLECTION_IMAGE_BASE}/809/a18d0c5f11375583dd6f17dedf738733.jpg`,
  },
  {
    index: "03",
    title: "Basket",
    slug: "basketball-sneakers",
    tagline: "Hoops sneakers",
    image: `${COLLECTION_IMAGE_BASE}/807/9c1f3f9a346c0a187ff2965e9f6eef3a.jpg`,
  },
  {
    index: "04",
    title: "Jersey",
    slug: "sport-jerseys",
    tagline: "Official team kits",
    image: `${COLLECTION_IMAGE_BASE}/808/d7e4609eddb4903861e21409e6c2524a.jpg`,
  },
];

export async function Top50Banner() {
  const data = await getFeaturedProducts().catch(() => null);
  const ranked = data?.data.slice(0, 8) ?? [];
  const t = await getServerT();

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-4 py-6 lg:px-24 lg:py-10">
        <SectionHeading
          eyebrow={t.trendingNow}
          title="Top 50"
          subtitle={t.top50Subtitle}
          linkHref="/search?sort_by=most_popular&category=sneakers"
          linkLabel={t.seeAll}
        />

        {ranked.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-5">
            {ranked.map((product, index) => (
              <div key={product.id} className="relative">
                <span className="absolute -left-2 -top-2 z-20 flex size-8 items-center justify-center rounded-lg bg-neutral-950 text-sm font-black text-white shadow-sm ring-2 ring-background lg:-left-2.5 lg:-top-2.5 lg:size-9 lg:text-base">
                  {index + 1}
                </span>
                <ProductCard product={product} hasRankingBadge />
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-6 lg:px-24 lg:pb-10">
        <div className="flex flex-col gap-3 lg:gap-5">
          <PromoBand />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-5">
            {sports.map((tile) => (
              <SportTile key={tile.title} tile={tile} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

async function PromoBand() {
  const t = await getServerT();
  return (
    <Link
      href={promo.href}
      className="group flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-800 to-brand-dark p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center sm:gap-8 lg:rounded-3xl lg:px-10"
    >
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand">
          <TicketPercent className="size-4" />
          {t.underRetail}
        </p>
        <h3 className="text-3xl font-black tracking-tighter text-white lg:text-5xl">
          {promo.title}
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-300">
          {promo.copy}
        </p>
      </div>
      <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors duration-300 group-hover:bg-brand-soft">
        {t.shopTheDrop}
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

function SportTile({ tile }: { tile: (typeof sports)[number] }) {
  return (
    <Link
      href={`/collection/${tile.slug}`}
      className="group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl bg-neutral-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:min-h-52 lg:rounded-3xl lg:p-7"
    >
      <Image
        src={tile.image}
        alt={tile.title}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-75"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/55 to-neutral-950/15" />

      <div className="relative z-10 flex items-start justify-between">
        <span className="text-xs font-black tracking-[0.2em] text-brand lg:text-sm">
          {tile.index}
        </span>
        <span className="flex size-8 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-neutral-950 lg:size-9">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-black tracking-tight text-white lg:text-4xl">
          {tile.title}
        </h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-neutral-300 lg:text-sm">
          {tile.tagline}
        </p>
      </div>
    </Link>
  );
}

export function Top50BannerSkeleton() {
  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-24 lg:py-10">
        <div className="mb-5 flex items-end justify-between lg:mb-7">
          <div>
            <div className="mb-1.5 h-3 w-20 animate-pulse rounded bg-neutral-200" />
            <h2 className="text-xl font-bold tracking-tight lg:text-3xl">
              <div className="h-8 w-28 animate-pulse rounded bg-neutral-200 lg:h-9" />
            </h2>
            <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-neutral-200" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded-full bg-neutral-200" />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-6 lg:px-24 lg:pb-10">
        <div className="flex flex-col gap-3 lg:gap-5">
          <div className="h-40 animate-pulse rounded-2xl bg-neutral-200 lg:h-44 lg:rounded-3xl" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-h-40 animate-pulse rounded-2xl bg-neutral-100 lg:min-h-48 lg:rounded-3xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
