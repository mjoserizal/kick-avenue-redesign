"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/api";
import type { ProductDetail, ProductAvailable } from "@/lib/api";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-neutral-100" />
    );
  }

  return (
    <div className="sticky top-24">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-50">
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                setActive((a) => (a - 1 + images.length) % images.length);
              }}
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                setActive((a) => (a + 1) % images.length);
              }}
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-neutral-50 transition-colors ${
                i === active
                  ? "border-neutral-900"
                  : "border-transparent hover:border-neutral-300"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function groupBySize(listings: ProductAvailable[]) {
  const map = new Map<number, ProductAvailable[]>();
  for (const l of listings) {
    const key = l.size_id;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(l);
  }
  return map;
}

export function BuyPanel({ detail }: { detail: ProductDetail }) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const available = detail.availables ?? [];
  const preOrders = detail.pre_orders ?? [];
  const used = detail.useds ?? [];
  const all = [...available, ...preOrders, ...used];
  const bySize = groupBySize(all);

  const price = detail.start_from_price_slashed
    ? parseFloat(detail.start_from_price_slashed)
    : Math.min(
        ...all.map((l) => parseFloat(l.asking_price))
      );
  const slashed = detail.retail_price
    ? parseFloat(detail.retail_price) * 20000
    : null;

  const selectedListings = selectedSize ? bySize.get(selectedSize) ?? [] : [];
  const selectedMin = selectedListings.length
    ? Math.min(...selectedListings.map((l) => parseFloat(l.asking_price)))
    : null;
  const displayPrice = selectedMin ?? (price || null);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{detail.product.brand.name}</span>
          <Badge variant="secondary" className="text-xs">
            {detail.product.category.name}
          </Badge>
        </div>
        <h1 className="mt-1.5 text-xl lg:text-2xl font-bold tracking-tight">
          {detail.display_name}
        </h1>
        {detail.colour && (
          <p className="mt-1 text-sm text-neutral-500">
            Colour: {detail.colour}
          </p>
        )}
        <p className="text-xs text-neutral-400">SKU: {detail.SKU}</p>
      </div>

      <div className="flex items-baseline gap-2 border-y border-neutral-200 py-3">
        <span className="text-2xl font-bold">
          {displayPrice != null ? formatPrice(displayPrice) : "Ask Price"}
        </span>
        {slashed && price && slashed > price && (
          <span className="text-sm text-neutral-400 line-through">
            {formatPrice(slashed)}
          </span>
        )}
        {detail.biddable && (
          <Badge variant="outline" className="ml-auto">
            Negotiable
          </Badge>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">Select Size</span>
          <span className="text-xs text-neutral-500">
            {bySize.size} sizes available
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[...bySize.keys()].map((sizeId) => {
            const listings = bySize.get(sizeId)!;
            const first = listings[0];
            const isSelected = selectedSize === sizeId;
            return (
              <button
                key={sizeId}
                type="button"
                onClick={() =>
                  setSelectedSize(isSelected ? null : sizeId)
                }
                className={`rounded-lg border px-2 py-2.5 text-center text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 hover:border-neutral-900"
                }`}
              >
                {first.size?.US ?? first.size?.EUR ?? "-"}
              </button>
            );
          })}
        </div>
      </div>

      {selectedSize && selectedListings.length > 0 && (
        <div className="rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600">
          <p className="mb-2 font-semibold text-neutral-900">
            Offers for size {selectedListings[0].size?.US}:
          </p>
          {selectedListings.slice(0, 4).map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between py-1"
            >
              <span className="flex items-center gap-1.5">
                <span>{formatPrice(l.asking_price)}</span>
                {l.pre_verified && <Badge className="h-4 text-[10px]">Verified</Badge>}
              </span>
              <span
                className={
                  l.is_expired ? "text-neutral-400 line-through" : "text-neutral-500"
                }
              >
                {l.sneakers_condition} · {l.box_condition}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <Button size="lg" className="w-full text-base" disabled={!selectedSize}>
          {selectedSize ? `Buy Now — ${formatPrice(selectedMin ?? price ?? 0)}` : "Select a Size to Buy"}
        </Button>
        <Button size="lg" variant="outline" className="w-full text-base">
          Make an Offer
        </Button>
      </div>

      {detail.wants_count > 0 && (
        <p className="text-center text-xs text-neutral-500">
          {detail.wants_count.toLocaleString("id-ID")} sneakerheads want this
        </p>
      )}

      <div className="rounded-xl border border-neutral-200 p-4 text-sm text-neutral-600">
        <p className="mb-1 font-semibold text-neutral-900">
          Authenticity Guaranteed
        </p>
        <p>
          Every item is checked by our team of authentication experts before it
          is shipped. 100% Authentic. Guaranteed.
        </p>
      </div>
    </div>
  );
}