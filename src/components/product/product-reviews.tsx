"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MessageSquareQuote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProductReview } from "@/lib/api";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={
            i <= rating
              ? "size-3.5 fill-amber-400 text-amber-400"
              : "size-3.5 text-neutral-300"
          }
        />
      ))}
    </div>
  );
}

function initial(name: string): string {
  return (name.trim().charAt(0) || "K").toUpperCase();
}

export function ProductReviews({
  reviews,
  total,
}: {
  reviews: ProductReview[];
  total: number;
}) {
  if (!reviews.length) return null;

  const average =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section id="reviews" className="mt-16 border-t border-neutral-200 pt-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-dark">
            Ulasan pembeli
          </p>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950 lg:text-2xl">
            Kata mereka tentang produk ini
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-3xl font-bold tracking-tight text-neutral-950">
              {average.toFixed(1)}
            </span>
            <div>
              <Stars rating={Math.round(average)} />
              <p className="mt-0.5 text-xs text-neutral-500">
                {total} ulasan terverifikasi
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {reviews.map((review, index) => (
          <motion.figure
            key={review.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
            className="flex flex-col rounded-2xl border border-neutral-200/80 bg-white p-4"
          >
            <figcaption className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-bold text-white">
                {initial(review.display_name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-neutral-950">
                  {review.display_name}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <Stars rating={review.rating} />
                  <span className="text-[11px] text-neutral-400">
                    {review.display_date}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="gap-1 text-[10px]">
                <MessageSquareQuote className="size-3" />
                Verified
              </Badge>
            </figcaption>

            <blockquote className="mt-3 line-clamp-4 text-sm leading-6 text-neutral-700">
              &ldquo;{review.review_text}&rdquo;
            </blockquote>

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
              {review.size && (
                <Badge variant="secondary" className="text-[10px]">
                  Size {review.size}
                </Badge>
              )}
              {review.condition && (
                <Badge variant="secondary" className="text-[10px]">
                  {review.condition.replace(/_/g, " ").toLowerCase()}
                </Badge>
              )}
              {review.shipping_method && (
                <Badge variant="secondary" className="text-[10px]">
                  {review.shipping_method}
                </Badge>
              )}
            </div>

            {review.images && review.images.length > 0 && (
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                {review.images.map((img) => (
                  <div
                    key={img.thumb}
                    className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100"
                  >
                    <Image
                      src={img.medium || img.thumb}
                      alt="Review photo"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.figure>
        ))}
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        Menampilkan {reviews.length} dari {total} ulasan.{" "}
        <Link
          href="#reviews"
          className="font-semibold text-neutral-950 underline underline-offset-4"
        >
          Baca semua ulasan
        </Link>
      </p>
    </section>
  );
}