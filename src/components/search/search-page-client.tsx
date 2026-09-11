"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, SlidersHorizontal, X } from "lucide-react";
import type { SearchResult, Aggregates } from "@/lib/api";

type Facets = Aggregates["facets"];

const sortOptions = [
  { label: "Most Popular", value: "most_popular" },
  { label: "Newest", value: "latest" },
  { label: "Price Low to High", value: "price_asc" },
  { label: "Price High to Low", value: "price_desc" },
];

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
      <form onSubmit={handleSearch} className="mb-5">
        <div className="flex w-full items-center gap-2 rounded-xl bg-neutral-50 px-4 py-3">
          <SearchIcon className="size-4 shrink-0 text-neutral-800" />
          <Input
            type="text"
            placeholder="Search authentic sneakers, apparel, luxury..."
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-auto flex-1 border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="sm"
            className="shrink-0"
            disabled={isPending}
          >
            Search
          </Button>
        </div>
      </form>

      {/* Header + sort */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">
          {initialQuery ? (
            <>Results for &ldquo;{initialQuery}&rdquo;</>
          ) : (
            "All Products"
          )}{" "}
          <span className="text-sm font-normal text-neutral-500">
            {total.toLocaleString("id-ID")} items
          </span>
        </h1>
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            className="flex lg:hidden items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:border-neutral-900"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal className="size-3.5" />
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleToggle("sort_by", opt.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                sort === opt.value
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

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
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  <X className="size-5" />
                </button>
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
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {initialResults.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-lg font-semibold">No products found</p>
              <p className="mt-1 text-sm text-neutral-500">
                Try a different keyword or filter.
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${isPending ? "opacity-50 transition-opacity" : ""}`}
            >
              {initialResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={initialPage <= 1 || isPending}
              onClick={() => goToPage(initialPage - 1)}
            >
              Previous
            </Button>
            <span className="px-3 text-sm text-neutral-500">
              Page {initialPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={initialResults.length < 20 || isPending}
              onClick={() => goToPage(initialPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
