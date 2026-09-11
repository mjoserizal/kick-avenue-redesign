import Link from "next/link";
import Image from "next/image";
import { Heart, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  getLowestPrice,
  getSlashedPrice,
  getProductImage,
} from "@/lib/api";
import type { SearchResult } from "@/lib/api";

export function ProductCard({ product }: { product: SearchResult }) {
  const price = getLowestPrice(product);
  const slashed = getSlashedPrice(product);
  const image = getProductImage(product);
  const hasDiscount = slashed && price && slashed > price;
  const discountPct = hasDiscount
    ? Math.round(((slashed - price) / slashed) * 100)
    : 0;
  const sizeCount = product.total_available_sizes?.brand_new;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-50"
      >
        {image ? (
          <Image
            src={image}
            alt={product.display_name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <div className="h-16 w-16 rounded-full bg-neutral-200" />
          </div>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
        >
          <Heart className="size-4" />
        </button>

        {hasDiscount && (
          <Badge className="absolute left-2.5 top-2.5 bg-red-600 text-white border-0">
            {discountPct}% OFF
          </Badge>
        )}

        {product.editors_choice && (
          <div className="absolute bottom-2.5 left-2.5">
            <Badge className="bg-white/95 text-neutral-900 border-0 gap-1">
              <BadgeCheck className="size-3.5" />
              Editor&apos;s Choice
            </Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-1 pt-2.5">
        <div className="flex items-center gap-2 text-xs">
          {product.brands?.[0] && (
            <span className="font-semibold text-neutral-900">
              {product.brands[0]}
            </span>
          )}
          {sizeCount ? (
            <span className="text-neutral-400">
              · {sizeCount} size{sizeCount > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm text-neutral-700 group-hover:underline"
        >
          {product.display_name}
        </Link>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-1">
          {hasDiscount && slashed != null && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(slashed)}
            </span>
          )}
          <span className="font-bold text-neutral-900">
            {price != null ? formatPrice(price) : "Sold Out"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <div className="aspect-square w-full animate-pulse rounded-xl bg-neutral-200" />
      <div className="flex flex-col gap-1.5 pt-2">
        <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
      </div>
    </div>
  );
}