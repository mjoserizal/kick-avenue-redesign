"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, BadgeCheck, Zap, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  getLowestPrice,
  getSlashedPrice,
  getProductImage,
} from "@/lib/api";
import type { SearchResult } from "@/lib/api";

export function ProductCard({ product }: { product: SearchResult }) {
  const [wished, setWished] = useState(false);
  const price = getLowestPrice(product);
  const slashed = getSlashedPrice(product);
  const image = getProductImage(product);
  const hasDiscount = slashed && price && slashed > price;
  const discountPct = hasDiscount
    ? Math.round(((slashed - price) / slashed) * 100)
    : 0;
  const sizeCount = product.total_available_sizes?.brand_new;
  const soldOut = price == null;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl">
      <Link
        href={`/product/${product.slug}`}
        className={`relative block aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-soft/50 ${
          soldOut ? "saturate-0" : ""
        }`}
      >
        {image ? (
          <Image
            src={image}
            alt={product.display_name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <div className="h-16 w-16 rounded-full bg-neutral-200" />
          </div>
        )}

        {soldOut && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-neutral-950/85 px-3.5 py-1.5 text-xs font-semibold text-white">
              Sold Out
            </span>
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          onClick={() => setWished((w) => !w)}
          className={`absolute right-2.5 top-2.5 z-10 flex size-8 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 transition-all hover:scale-110 ${
            wished ? "bg-white text-red-500" : "bg-white/90 text-neutral-700 hover:bg-white"
          }`}
        >
          <Heart className={`size-4 transition-transform ${wished ? "scale-110 fill-current" : ""}`} />
        </button>

        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1.5">
          {hasDiscount && (
            <Badge className="border-0 bg-red-600 text-white shadow-sm">
              -{discountPct}%
            </Badge>
          )}
          {product.has_express_listing && (
            <Badge className="border-0 bg-neutral-950/85 text-white">
              <Zap className="size-3 fill-current" />
              Express
            </Badge>
          )}
        </div>

        {/* Hover overlay */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center bg-gradient-to-t from-neutral-950/80 to-transparent pb-3 pt-8 transition-transform duration-300 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-neutral-950 shadow-lg">
            <Eye className="size-3.5" />
            Lihat Detail
          </span>
        </span>

        {product.editors_choice && !soldOut && (
          <Badge className="absolute bottom-2.5 left-2.5 z-10 gap-1 border-0 bg-white/95 text-neutral-900 transition-opacity duration-300 group-hover:opacity-0">
            <BadgeCheck className="size-3.5 text-brand-dark" />
            Editor&apos;s Choice
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-2.5 pt-3">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="font-bold uppercase tracking-wide text-neutral-950">
            {product.brands?.[0] ?? "Kick Avenue"}
          </span>
          {sizeCount ? (
            <span className="shrink-0 text-neutral-400">
              {sizeCount} size{sizeCount > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm leading-snug text-neutral-600 transition-colors group-hover:text-neutral-950"
        >
          {product.display_name}
        </Link>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-2">
          {hasDiscount && slashed != null && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(slashed)}
            </span>
          )}
          <span className="text-[15px] font-bold tracking-tight text-neutral-950">
            {!soldOut && sizeCount ? (
              <span className="mr-1 align-middle text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                Mulai
              </span>
            ) : null}
            {soldOut ? "Sold Out" : formatPrice(price)}
          </span>
        </div>

        {product.total_sales != null && product.total_sales > 0 ? (
          <p className="pt-1 text-[11px] text-neutral-400">
            Terjual {product.total_sales.toLocaleString("id-ID")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white">
      <div className="aspect-[4/3] w-full animate-pulse bg-neutral-200" />
      <div className="flex flex-col gap-1.5 p-2.5 pt-3">
        <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
      </div>
    </div>
  );
}