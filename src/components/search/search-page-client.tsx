"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import type { SearchResult, Aggregates } from "@/lib/api";

type Facets = Aggregates["facets"];

const sortOptions = [
  { label: "Most Popular", value: "most_popular" },
  { label: "Newest", value: "latest" },
  { label: "Price Low to High", value: "price_asc" },
  { label: "Price High to Low", value: "price_desc" },
];

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.045 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

function parseActive(sp: URLSearchParams) {
  return {
    brands: sp.get("brands")?.split(",").filter(Boolean) ?? [],
    category: sp.get("category") ?? "",
    sex: sp.get("sex") ?? "",
    shipping: sp.get("shipping") ?? "",
    sizes: sp.get("sizes")?.split(",").filter(Boolean) ?? [],
  };
}

export function SearchPageClient({
  initialResults,
  total,
  initialPage,
  initialQuery,
  initialSort,
  facets,
}: {
  initialResults: SearchResult[];
  total: number;
  initialPage: number;
  initialQuery: string;
  initialSort: string;
  facets: Facets | null;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const active = parseActive(sp);

  const buildParams = (changes: Record<string, string>) => {
    const params = new URLSearchParams(sp.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (key === "__clear") {
        for (const k of [
          "brands",
          "category",
          "sex",
          "shipping",
          "sizes",
          "sort_by",
          "page",
          "q",
        ]) {
          params.delete(k);
        }
      } else if (value === "") {
        params.delete(key);
      } else {
        const current = params.get(key);
        if (key === "brands") {
          const list = current?.split(",").filter(Boolean) ?? [];
          const idx = list.indexOf(value);
          if (idx >= 0) list.splice(idx, 1);
          else list.push(value);
          if (list.length) params.set(key, list.join(","));
          else params.delete(key);
        } else if (key === "sizes") {
          const list = current?.split(",").filter(Boolean) ?? [];
          const idx = list.indexOf(value);
          if (idx >= 0) list.splice(idx, 1);
          else list.push(value);
          if (list.length) params.set(key, list.join(","));
          else params.delete(key);
        } else {
          if (params.get(key) === value) params.delete(key);
          else params.set(key, value);
        }
      }
    });
    params.delete("page");
    return params.toString();
  };

  const handleToggle = (key: string, value: string) => {
    const qs = buildParams({ [key]: value });
    startTransition(() => router.push(`/search?${qs}`));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = buildParams({ q: query });
    startTransition(() => router.push(`/search?${qs}`));
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(page));
    startTransition(() => router.push(`/search?${params.toString()}`));
  };

  const sort = initialSort || "most_popular";

  const activeCount =
    active.brands.length +
    (active.category ? 1 : 0) +
    (active.sex ? 1 : 0) +
    (active.shipping ? 1 : 0) +
    active.sizes.length;

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex w-full items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 transition-colors focus-within:border-neutral-950 sm:px-5">
          <SearchIcon className="size-4 shrink-0 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search authentic sneakers, apparel, luxury..."
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 flex-1 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="sm"
            className="shrink-0 rounded-full px-4"
            disabled={isPending}
          >
            Search
          </Button>
        </div>
      </form>

      {/* Header + sort */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mb-5 flex flex-wrap items-center justify-between gap-3"
      >
        <h1 className="text-lg font-bold tracking-tight lg:text-xl">
          {initialQuery ? (
            <>Results for &ldquo;{initialQuery}&rdquo;</>
          ) : (
            "All Products"
          )}{" "}
          <span className="text-sm font-normal text-neutral-500">
            {total.toLocaleString("id-ID")} items
          </span>
        </h1>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:border-neutral-950 lg:hidden"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal className="size-3.5" />
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          {sortOptions.map((opt) => (
            <motion.button
              key={opt.value}
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleToggle("sort_by", opt.value)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                sort === opt.value
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-950"
              }`}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Active chips (desktop) */}
      {activeCount > 0 && (
        <div className="mb-5 hidden flex-wrap gap-1.5 lg:flex">
          {active.brands.map((b) => (
            <button
              key={`b-${b}`}
              type="button"
              onClick={() => handleToggle("brands", b)}
              className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 text-xs font-medium hover:border-neutral-900"
            >
              {b} <X className="size-3" />
            </button>
          ))}
          {active.category && (
            <button
              type="button"
              onClick={() => handleToggle("category", active.category)}
              className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 text-xs font-medium hover:border-neutral-900"
            >
              {active.category} <X className="size-3" />
            </button>
          )}
          {active.sex && (
            <button
              type="button"
              onClick={() => handleToggle("sex", active.sex)}
              className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 text-xs font-medium hover:border-neutral-900"
            >
              {active.sex === "M"
                ? "Men"
                : active.sex === "F"
                  ? "Women"
                  : "Unisex"}{" "}
              <X className="size-3" />
            </button>
          )}
          {active.sizes.map((s) => (
            <button
              key={`s-${s}`}
              type="button"
              onClick={() => handleToggle("sizes", s)}
              className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 text-xs font-medium hover:border-neutral-900"
            >
              Size {s} <X className="size-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleToggle("__clear", "")}
            className="text-xs text-neutral-500 hover:text-neutral-900 underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex items-start gap-6 lg:gap-10">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            facets={facets}
            active={active}
            onToggle={handleToggle}
          />
        </div>

        {/* Mobile filter overlay */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                className="absolute inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileFilterOpen(false)}
              />
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-xl"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">Filters</h2>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9, rotate: 90 }}
                    onClick={() => setMobileFilterOpen(false)}
                  >
                    <X className="size-5" />
                  </motion.button>
                </div>
                <FilterSidebar
                  facets={facets}
                  active={active}
                  onToggle={(k, v) => {
                    handleToggle(k, v);
                  }}
                />
                <Button
                  className="mt-4 w-full"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Apply
                </Button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {initialResults.length === 0 ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center py-24 text-center"
            >
              <motion.span
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 16, stiffness: 240 }}
                className="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400"
              >
                <PackageSearch className="size-8" />
              </motion.span>
              <p className="mt-4 text-lg font-semibold">No products found</p>
              <p className="mt-1 text-sm text-neutral-500">
                Try a different keyword or filter.
              </p>
              <Button
                variant="outline"
                className="mt-5 rounded-full"
                onClick={() => handleToggle("__clear", "")}
              >
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={sp.toString()}
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${isPending ? "opacity-50 transition-opacity" : ""}`}
              >
                {initialResults.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    variants={cardVariants}
                    className="min-w-0"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                size="sm"
                disabled={initialPage <= 1 || isPending}
                onClick={() => goToPage(initialPage - 1)}
              >
                Previous
              </Button>
            </motion.div>
            <span className="px-3 text-sm text-neutral-500">
              Page {initialPage}
            </span>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                size="sm"
                disabled={initialResults.length < 20 || isPending}
                onClick={() => goToPage(initialPage + 1)}
              >
                Next
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
