import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, TicketPercent } from "lucide-react";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/product/product-card";
import { SectionHeading } from "@/components/product/product-section";
import { getFeaturedProducts } from "@/lib/api";

const IMAGE_BASE =
  "https://kickavenue-assets.s3.amazonaws.com/asset-images/homepage";

const promo = {
  eyebrow: "Under retail",
  title: "UP TO 70%",
  copy: "Authentic sneakers priced below retail — the best deals drop here.",
  href: "/search?sort_by=most_popular&under_retail=true&category=sneakers&start_price=459000",
};

const sports = [
  {
    title: "Running",
    href: "/collection/running-sneakers",
    image: `${IMAGE_BASE}/44cf2064d033f214fc8b0a5f8dba4970.jpg`,
  },
  {
    title: "Court",
    href: "/collection/tennis-padel",
    image: `${IMAGE_BASE}/0d848f49732696d3b6a76a0af62fec34.jpg`,
  },
  {
    title: "Basket",
    href: "/collection/basketball-sneakers",
    image: `${IMAGE_BASE}/8f29209c59ce1effa520784a8bee6ddd.jpg`,
  },
  {
    title: "Jersey",
    href: "/collection/sport-jerseys",
    image: `${IMAGE_BASE}/ae464363354223b98d6fddb86c6e0b07.jpg`,
  },
];

export async function Top50Banner() {
  const data = await getFeaturedProducts().catch(() => null);
  const ranked = data?.data.slice(0, 8) ?? [];

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-4 py-6 lg:px-24 lg:py-10">
        <SectionHeading
          eyebrow="Trending Now"
          title="Top 50"
          subtitle="The most wanted sneakers, ranked right now"
          linkHref="/search?sort_by=most_popular&category=sneakers"
          linkLabel="See All"
        />

        {ranked.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-5">
            {ranked.map((product, index) => (
              <div key={product.id} className="relative">
                <span className="absolute -left-2 -top-2 z-20 flex size-8 items-center justify-center rounded-lg bg-neutral-950 text-sm font-black text-white shadow-sm ring-2 ring-background lg:-left-2.5 lg:-top-2.5 lg:size-9 lg:text-base">
                  {index + 1}
                </span>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-6 lg:px-24 lg:pb-10">
        <div className="flex flex-col gap-3 lg:gap-5">
          <PromoBand />

          <div className="grid grid-cols-4 gap-3 lg:gap-5">
            {sports.map((tile) => (
              <SportTile key={tile.title} tile={tile} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PromoBand() {
  return (
    <Link
      href={promo.href}
      className="group flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-800 to-brand-dark p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center sm:gap-8 lg:rounded-3xl lg:px-10"
    >
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand">
          <TicketPercent className="size-4" />
          {promo.eyebrow}
        </p>
        <h3 className="text-3xl font-black tracking-tighter text-white lg:text-5xl">
          {promo.title}
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-300">
          {promo.copy}
        </p>
      </div>
      <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors duration-300 group-hover:bg-brand-soft">
        Shop the drop
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

function SportTile({
  tile,
}: {
  tile: (typeof sports)[number];
}) {
  return (
    <Link
      href={tile.href}
      className="group flex flex-col items-center gap-2 text-center"
    >
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-neutral-200/80 bg-white p-2 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-neutral-950 group-hover:shadow-md">
        <div className="relative h-3/4 w-full">
          <Image
            src={tile.image}
            alt={tile.title}
            fill
            sizes="(max-width: 1024px) 25vw, 20vw"
            className="object-contain opacity-80 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
          />
        </div>
      </div>
      <span className="text-xs font-medium text-neutral-600 transition-colors group-hover:text-neutral-950 lg:text-sm">
        {tile.title}
      </span>
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
          <div className="grid grid-cols-4 gap-3 lg:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="aspect-square w-full animate-pulse rounded-2xl bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}