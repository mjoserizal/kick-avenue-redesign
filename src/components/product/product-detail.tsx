"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Heart,
  ZoomIn,
  ShieldCheck,
  Truck,
  Zap,
  RotateCcw,
  Banknote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/api";
import type { ProductDetail, ProductAvailable } from "@/lib/api";

const sectionVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const sectionItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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
    <div className="lg:sticky lg:top-28">
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-neutral-50 via-white to-brand-soft/40">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6 transition-transform duration-300 group-hover:scale-105 sm:p-10"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <span className="absolute left-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-neutral-700 shadow-sm backdrop-blur">
          {active + 1}/{images.length}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/80 text-neutral-500 shadow-sm backdrop-blur">
          <ZoomIn className="size-4" />
        </span>
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() =>
                setActive((a) => (a - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow-sm ring-1 ring-black/5 transition-opacity hover:bg-white lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => setActive((a) => (a + 1) % images.length)}
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow-sm ring-1 ring-black/5 transition-opacity hover:bg-white lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <motion.button
              key={src + i}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setActive(i)}
              className={`relative aspect-square size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-neutral-50 transition-colors ${
                i === active
                  ? "border-neutral-950"
                  : "border-transparent hover:border-neutral-300"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain p-1" />
            </motion.button>
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

type SizeInfo = ProductAvailable["size"];

function sizeLabel(size?: SizeInfo): string {
  return size?.US ?? size?.EUR ?? size?.UK ?? size?.cm ?? "-";
}

function sizeSub(size?: SizeInfo): string {
  const parts: string[] = [];
  if (size?.US) parts.push(`US ${size.US}`);
  if (size?.UK) parts.push(`UK ${size.UK}`);
  if (size?.EUR) parts.push(`EU ${size.EUR}`);
  if (size?.cm) parts.push(`${size.cm} cm`);
  return parts.join(" · ");
}

type SizeSystem = "US" | "UK" | "EU";

const sizeSystems: { key: SizeSystem; label: string }[] = [
  { key: "US", label: "US" },
  { key: "UK", label: "UK" },
  { key: "EU", label: "EU" },
];

function sizeBySystem(size: SizeInfo | undefined, system: SizeSystem): string {
  const value =
    system === "US"
      ? size?.US
      : system === "UK"
        ? size?.UK
        : size?.EUR;
  return value ?? sizeLabel(size);
}

function sizeSubForSystem(
  size: SizeInfo | undefined,
  system: SizeSystem,
): string {
  const parts: string[] = [];
  if (system !== "US" && size?.US) parts.push(`US ${size.US}`);
  if (system !== "UK" && size?.UK) parts.push(`UK ${size.UK}`);
  if (system !== "EU" && size?.EUR) parts.push(`EU ${size.EUR}`);
  return parts.join(" · ");
}

type ListingGroupKey = "new" | "used" | "preorder";

export function BuyPanel({ detail }: { detail: ProductDetail }) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>("US");
  const [wished, setWished] = useState(false);

  const available = detail.availables ?? [];
  const preOrders = detail.pre_orders ?? [];
  const used = detail.useds ?? [];
  const all = [...available, ...preOrders, ...used];

  const groups: { key: ListingGroupKey; label: string; list: ProductAvailable[] }[] = (
    [
      { key: "new", label: "Brand New", list: available },
      { key: "preorder", label: "Pre-order", list: preOrders },
      { key: "used", label: "Pre-loved", list: used },
    ] as { key: ListingGroupKey; label: string; list: ProductAvailable[] }[]
  ).filter((g) => g.list.length > 0);

  const [groupKey, setGroupKey] = useState<ListingGroupKey>(() => {
    if (available.length) return "new";
    if (preOrders.length) return "preorder";
    return "used";
  });

  const activeList = groups.find((g) => g.key === groupKey)?.list ?? all;
  const bySize = groupBySize(activeList);

  const price =
    all.length > 0
      ? detail.start_from_price_slashed
        ? parseFloat(detail.start_from_price_slashed)
        : Math.min(...all.map((l) => parseFloat(l.asking_price)))
      : null;
  const slashed = detail.retail_price
    ? parseFloat(detail.retail_price) * 20000
    : null;

  const selectedListings = selectedSize ? bySize.get(selectedSize) ?? [] : [];
  const selectedMin = selectedListings.length
    ? Math.min(...selectedListings.map((l) => parseFloat(l.asking_price)))
    : null;
  const displayPrice = selectedMin ?? price;

  const hasExpress = available.some((l) => l.pre_verified);
  const expressEta = detail.eta_text_size?.pre_verified;

  return (
    <>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        <motion.div variants={sectionItem}>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold uppercase tracking-wide text-neutral-950">
              {detail.product.brand.name}
            </span>
            <Badge variant="secondary" className="text-xs capitalize">
              {detail.product.category.name}
            </Badge>
            {detail.editors_choice && (
              <Badge variant="outline" className="gap-1 text-xs">
                <BadgeCheck className="size-3 text-brand-dark" />
                Editor&apos;s Choice
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight lg:text-3xl">
            {detail.display_name}
          </h1>
          {detail.colour && (
            <p className="mt-1.5 text-sm text-neutral-500">
              Colour: <span className="text-neutral-800">{detail.colour}</span>
            </p>
          )}
          <p className="mt-0.5 text-xs text-neutral-400">SKU: {detail.SKU}</p>
        </motion.div>

        <motion.div
          variants={sectionItem}
          className="rounded-2xl border border-neutral-200/80 bg-white p-4"
        >
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {slashed && price && slashed > price && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(slashed)}
              </span>
            )}
            <span className="text-2xl font-bold tracking-tight text-neutral-950">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={displayPrice ?? "ask"}
                  className="inline-block"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {displayPrice != null ? formatPrice(displayPrice) : "Ask Price"}
                </motion.span>
              </AnimatePresence>
            </span>
            {detail.biddable && (
              <Badge variant="outline" className="ml-auto">
                Negotiable
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">
            {selectedSize
              ? "Harga terbaik untuk ukuran terpilih"
              : "Termasuk autentikasi & perlindungan pembeli"}
          </p>
        </motion.div>

        {hasExpress && (
          <motion.div
            variants={sectionItem}
            className="flex items-center gap-3 rounded-2xl border border-amber-300/40 bg-amber-50 p-3.5 text-sm"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-amber-400">
              <Zap className="size-4 fill-current" />
            </span>
            <div>
              <p className="font-bold text-neutral-950">
                Pengiriman Express Tersedia
              </p>
              <p className="mt-0.5 text-xs leading-5 text-neutral-600">
                {expressEta ?? "Stok pre-verified siap dikirim cepat."}
              </p>
            </div>
          </motion.div>
        )}

        {groups.length > 1 && (
          <motion.div
            variants={sectionItem}
            className="flex gap-1 rounded-full bg-neutral-100 p-1"
          >
            {groups.map((g) => {
              const isActive = groupKey === g.key;
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => {
                    setGroupKey(g.key);
                    setSelectedSize(null);
                  }}
                  className="relative flex-1 rounded-full px-3 py-2 text-xs font-semibold"
                >
                  {isActive && (
                    <motion.span
                      layoutId="listing-tab-pill"
                      className="absolute inset-0 rounded-full bg-neutral-950 shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      isActive ? "text-white" : "text-neutral-600"
                    }`}
                  >
                    {g.label}
                    <span className="ml-1 text-[10px] font-normal opacity-70">
                      {g.list.length}
                    </span>
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}

        <motion.div variants={sectionItem}>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-sm font-bold">Select Size</span>
            <span className="text-xs text-neutral-500">
              {bySize.size} size{bySize.size > 1 ? "s" : ""} available
            </span>
          </div>
          <div className="mb-3 flex w-fit items-center gap-0.5 rounded-full bg-neutral-100 p-1">
            {sizeSystems.map((sys) => {
              const isActive = sizeSystem === sys.key;
              return (
                <button
                  key={sys.key}
                  type="button"
                  onClick={() => {
                    setSizeSystem(sys.key);
                    setSelectedSize(null);
                  }}
                  className="relative z-10 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                >
                  {isActive && (
                    <motion.span
                      layoutId="size-system-pill"
                      className="absolute inset-0 rounded-full bg-neutral-950 shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      isActive ? "text-white" : "text-neutral-600"
                    }`}
                  >
                    {sys.label}
                  </span>
                </button>
              );
            })}
          </div>
          <motion.div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            <AnimatePresence initial={false} mode="popLayout">
              {[...bySize.keys()].map((sizeId) => {
                const listings = bySize.get(sizeId)!;
                const first = listings[0];
                const isSelected = selectedSize === sizeId;
                const sub = sizeSubForSystem(first.size, sizeSystem);
                return (
                  <motion.button
                    key={sizeId}
                    type="button"
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() =>
                      setSelectedSize(isSelected ? null : sizeId)
                    }
                    className={`rounded-xl border px-2 py-2 text-center transition-colors ${
                      isSelected
                        ? "border-neutral-950 bg-neutral-950 text-white shadow-md"
                        : "border-neutral-300 text-neutral-800 hover:border-neutral-950"
                    }`}
                  >
                    <span className="block text-sm font-semibold">
                      {sizeBySystem(first.size, sizeSystem)}
                    </span>
                    {sub && (
                      <span
                        className={`mt-0.5 block truncate text-[10px] font-normal ${
                          isSelected ? "text-white/70" : "text-neutral-500"
                        }`}
                      >
                        {sub}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <AnimatePresence initial={false}>
          {selectedSize && selectedListings.length > 0 && (
            <motion.div
              key="offers"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4 text-xs text-neutral-600">
                <p className="mb-2.5 flex items-center gap-1.5 font-bold text-neutral-950">
                  <BadgeCheck className="size-4 text-brand-dark" />
                  Penawaran ukuran {sizeSub(selectedListings[0].size) || selectedListings[0].size?.US}
                </p>
                <div className="divide-y divide-neutral-200/70">
                  {selectedListings.slice(0, 4).map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between gap-2 py-2"
                    >
                      <span className="flex items-center gap-1.5 font-semibold text-neutral-950">
                        <span>{formatPrice(l.asking_price)}</span>
                        {l.pre_verified && (
                          <Badge className="h-4 gap-0.5 px-1.5 text-[10px]">
                            <BadgeCheck className="size-2.5" /> Verified
                          </Badge>
                        )}
                      </span>
                      <span
                        className={
                          l.is_expired
                            ? "text-neutral-400 line-through"
                            : "text-neutral-500"
                        }
                      >
                        {l.sneakers_condition} · {l.box_condition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={sectionItem} className="flex flex-col gap-2.5">
          <Button
            size="lg"
            className="h-12 w-full rounded-full text-base"
            disabled={!selectedSize}
          >
            {selectedSize
              ? `Buy Now — ${formatPrice(selectedMin ?? price ?? 0)}`
              : "Pilih Ukuran untuk Membeli"}
          </Button>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full text-sm"
            >
              Buat Penawaran
            </Button>
            <Button
              variant={wished ? "default" : "outline"}
              size="lg"
              className="h-12 gap-1.5 rounded-full text-sm"
              onClick={() => setWished((w) => !w)}
            >
              <motion.span
                key={wished ? "wished" : "unwished"}
                initial={{ scale: 0.5, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 16 }}
                className="inline-flex"
              >
                <Heart
                  className={`size-4 ${wished ? "fill-current" : ""}`}
                />
              </motion.span>
              {wished ? "Diwishlist" : "Wishlist"}
            </Button>
          </div>
        </motion.div>

        {detail.wants_count > 0 && (
          <motion.p
            variants={sectionItem}
            className="text-center text-xs text-neutral-500"
          >
            {detail.wants_count.toLocaleString("id-ID")} sneakerheads ingin
            produk ini
          </motion.p>
        )}

        <motion.div
          variants={sectionItem}
          className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand-soft/60 p-4 text-sm text-neutral-700"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="font-bold text-neutral-950">Autentikasi Dijamin</p>
            <p className="mt-0.5 leading-5">
              Setiap produk diperiksa tim ahli kami sebelum dikirim. 100%
              Original, Dijamin.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={sectionItem}
          className="flex items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 text-sm text-neutral-700"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
            {hasExpress ? (
              <Zap className="size-5 fill-current text-amber-500" />
            ) : (
              <Truck className="size-5" />
            )}
          </span>
          <div>
            <p className="font-bold text-neutral-950">Estimasi Pengiriman</p>
            <p className="mt-0.5 leading-5">
              {expressEta
                ? `${expressEta} untuk stok pre-verified. Pilih ekspedisi express untuk pengiriman lebih cepat.`
                : "Pesanan diproses dalam 1x24 jam. Pilih ekspedisi express untuk pengiriman lebih cepat."}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Sticky mobile CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.15 }}
        className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-neutral-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden"
      >
        <div className="shrink-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
            {selectedSize ? "Harga terpilih" : "Harga mulai"}
          </p>
          <p className="text-base font-bold tracking-tight text-neutral-950">
            {displayPrice != null ? formatPrice(displayPrice) : "Ask Price"}
          </p>
        </div>
        <Button
          size="lg"
          className="h-11 flex-1 rounded-full text-sm"
          disabled={!selectedSize}
        >
          {selectedSize ? "Buy Now" : "Pilih Ukuran"}
        </Button>
      </motion.div>
    </>
  );
}

const benefits = [
  {
    icon: ShieldCheck,
    title: "Autentikasi Dijamin",
    copy: "Dicek tim ahli sebelum dikirim",
  },
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    copy: "Opsi ekspedisi express tersedia",
  },
  {
    icon: RotateCcw,
    title: "Mudah Dikembalikan",
    copy: "7 hari setelah produk diterima",
  },
  {
    icon: Banknote,
    title: "Pembayaran Aman",
    copy: "Dana dilindungi hingga produk sampai",
  },
];

export function ProductBenefits() {
  return (
    <section className="mt-10 grid grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-4 lg:gap-4">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            className="flex items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
              <Icon className="size-4.5" />
            </span>
            <div>
              <p className="text-sm font-bold text-neutral-950">
                {benefit.title}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-neutral-500">
                {benefit.copy}
              </p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}