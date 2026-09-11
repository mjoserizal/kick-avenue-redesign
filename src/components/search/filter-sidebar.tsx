"use client";

import { useState } from "react";
import { SearchIcon, X, ChevronDown } from "lucide-react";
import type { Aggregates } from "@/lib/api";

type Facets = Aggregates["facets"];

interface ActiveFilters {
  brands: string[];
  category: string;
  sex: string;
  shipping: string;
  sizes: string[];
}

export function FilterSidebar({
  facets,
  active,
  onToggle,
}: {
  facets: Facets | null;
  active: ActiveFilters;
  onToggle: (key: string, value: string) => void;
}) {
  const [brandSearch, setBrandSearch] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    gender: true,
    highlights: true,
    sizes: false,
    conditions: false,
  });

  const toggle = (section: string) =>
    setOpen((p) => ({ ...p, [section]: !p[section] }));

  if (!facets) return null;

  const filteredBrands = brandSearch
    ? facets.brands.filter((b) =>
        b.label.toLowerCase().includes(brandSearch.toLowerCase()),
      )
    : facets.brands.slice(0, 20);

  const activeCount =
    active.brands.length +
    (active.category ? 1 : 0) +
    (active.sex ? 1 : 0) +
    (active.shipping ? 1 : 0) +
    active.sizes.length;

  return (
    <aside className="w-full lg:sticky lg:top-36 lg:w-72 lg:shrink-0 lg:self-start">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:p-5">
        <div className="flex items-center justify-between gap-2 pb-4">
          <div>
            <h3 className="text-base font-bold">Filters</h3>
            <p className="mt-1 text-xs text-neutral-500">Refine your search</p>
          </div>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onToggle("__clear", "")}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
            >
              Clear all ({activeCount})
            </button>
          )}
        </div>

        {/* Active chips */}
        {activeCount > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5 lg:hidden">
            {active.brands.map((b) => (
              <Chip
                key={`brand-${b}`}
                label={b}
                onRemove={() => onToggle("brands", b)}
              />
            ))}
            {active.category && (
              <Chip
                label={formatFilterLabel(active.category)}
                onRemove={() => onToggle("category", active.category)}
              />
            )}
            {active.sex && (
              <Chip
                label={
                  active.sex === "M"
                    ? "Men"
                    : active.sex === "F"
                      ? "Women"
                      : "Unisex"
                }
                onRemove={() => onToggle("sex", active.sex)}
              />
            )}
            {active.sizes.map((s) => (
              <Chip
                key={`size-${s}`}
                label={`Size ${s}`}
                onRemove={() => onToggle("sizes", s)}
              />
            ))}
          </div>
        )}

        {/* Categories */}
        <FilterGroup
          title="Categories"
          open={open.categories}
          onToggle={() => toggle("categories")}
        >
          {facets.categories.map((cat) => (
            <FilterRow
              key={cat.value}
              label={formatFilterLabel(cat.label)}
              count={cat.count}
              active={active.category === cat.value}
              onClick={() => onToggle("category", cat.value)}
            />
          ))}
        </FilterGroup>

        {/* Brands */}
        <FilterGroup
          title="Brands"
          open={open.brands}
          onToggle={() => toggle("brands")}
        >
          <div className="mb-2 flex items-center gap-1.5 rounded-md border border-neutral-200 px-2 py-1.5">
            <SearchIcon className="size-3.5 shrink-0 text-neutral-400" />
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="Search brands"
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-neutral-400"
            />
          </div>
          <div className="max-h-56 space-y-0.5 overflow-y-auto">
            {filteredBrands.map((brand) => (
              <FilterRow
                key={brand.value}
                label={brand.label}
                count={brand.count}
                active={active.brands.includes(brand.value)}
                onClick={() => onToggle("brands", brand.value)}
              />
            ))}
            {!brandSearch && facets.brands.length > 20 && (
              <p className="pt-1 text-[11px] text-neutral-400">
                + {facets.brands.length - 20} more brands
              </p>
            )}
            {brandSearch && filteredBrands.length === 0 && (
              <p className="pt-1 text-[11px] text-neutral-400">No match</p>
            )}
          </div>
        </FilterGroup>

        {/* Gender */}
        <FilterGroup
          title="Gender"
          open={open.gender}
          onToggle={() => toggle("gender")}
        >
          {facets.genders.map((g) => (
            <FilterRow
              key={g.value}
              label={g.label}
              count={g.count}
              active={active.sex === g.value}
              onClick={() => onToggle("sex", g.value)}
            />
          ))}
        </FilterGroup>

        {/* Highlights */}
        <FilterGroup
          title="Highlights"
          open={open.highlights}
          onToggle={() => toggle("highlights")}
        >
          {facets.highlights.map((h) => (
            <FilterRow
              key={h.value}
              label={h.label}
              count={h.count}
              active={active.shipping === h.filter_value}
              onClick={() =>
                onToggle(h.filter_param ?? "shipping", String(h.filter_value))
              }
            />
          ))}
        </FilterGroup>

        {/* Sizes */}
        <FilterGroup
          title="Sizes"
          open={open.sizes}
          onToggle={() => toggle("sizes")}
        >
          <div className="flex flex-wrap gap-1.5">
            {facets.sizes.slice(0, 30).map((sz) => (
              <button
                key={sz.id}
                type="button"
                onClick={() => onToggle("sizes", sz.value)}
                className={`flex h-8 items-center justify-center rounded-md border px-2.5 text-xs font-medium transition-colors ${
                  active.sizes.includes(sz.value)
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 hover:border-neutral-900"
                }`}
              >
                {sz.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Conditions */}
        <FilterGroup
          title="Condition"
          open={open.conditions}
          onToggle={() => toggle("conditions")}
        >
          {facets.conditions.map((c) => (
            <FilterRow
              key={c.value}
              label={c.label}
              count={c.count}
              active={false}
              onClick={() => {}}
            />
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}

function formatFilterLabel(label: string): string {
  return label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function FilterGroup({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-neutral-200 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-sm font-semibold"
      >
        {title}
        <ChevronDown
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3 space-y-0.5">{children}</div>}
    </div>
  );
}

function FilterRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-neutral-50 ${active ? "bg-neutral-50" : ""}`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
            active
              ? "border-neutral-900 bg-neutral-900"
              : "border-neutral-300 bg-white"
          }`}
        >
          {active && (
            <svg viewBox="0 0 12 12" fill="none" className="size-2 text-white">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className={active ? "font-medium" : ""}>{label}</span>
      </span>
      <span className="text-xs text-neutral-400">
        {count.toLocaleString("id-ID")}
      </span>
    </button>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 text-xs font-medium">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label}`}>
        <X className="size-3" />
      </button>
    </span>
  );
}
