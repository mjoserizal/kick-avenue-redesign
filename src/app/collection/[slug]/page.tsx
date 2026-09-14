import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getCollection,
  collectionProductToSearchResult,
} from "@/lib/api";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/product/product-section";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const PER_PAGE = 24;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug, { per_page: 1 }).catch(
    () => null,
  );
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: `${collection.name} - Kick Avenue Redesign`,
    description:
      collection.description ||
      `${collection.name} collection at Kick Avenue Redesign. 100% Authentic. Guaranteed.`,
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const collection = await getCollection(slug, {
    page,
    per_page: PER_PAGE,
  }).catch(() => null);
  if (!collection) notFound();

  const { current_page, last_page, total } = collection.products;
  if (page > last_page) notFound();

  const products = collection.products.data.map(
    collectionProductToSearchResult,
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-24 lg:py-10">
      <SectionHeading
        eyebrow="Collection"
        title={collection.name}
        subtitle={
          collection.description ||
          `${total.toLocaleString("id-ID")} items`
        }
      />

      {products.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-neutral-500">
          No items in this collection yet.
        </p>
      )}

      {last_page > 1 ? (
        <Pagination
          current={current_page}
          last={last_page}
          href={`/collection/${collection.slug}`}
        />
      ) : null}
    </div>
  );
}

function Pagination({
  current,
  last,
  href,
}: {
  current: number;
  last: number;
  href: string;
}) {
  const start = Math.max(1, current - 2);
  const end = Math.min(last, current + 2);
  const items: (number | "...")[] = [];
  if (start > 1) {
    items.push(1);
    if (start > 2) items.push("...");
  }
  for (let i = start; i <= end; i++) items.push(i);
  if (end < last) {
    if (end < last - 1) items.push("...");
    items.push(last);
  }

  const linkClass =
    "flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors";
  const activeClass = "bg-neutral-950 text-white";
  const idleClass = "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950";

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5">
      {current > 1 ? (
        <Link
          href={`${href}?page=${current - 1}`}
          aria-label="Previous page"
          className={`${linkClass} ${idleClass}`}
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={`${linkClass} text-neutral-300`}>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {items.map((item, index) =>
        item === "..." ? (
          <span
            key={`gap-${index}`}
            className="px-1 text-sm text-neutral-400"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={`${href}?page=${item}`}
            aria-current={item === current ? "page" : undefined}
            className={`${linkClass} ${
              item === current ? activeClass : idleClass
            }`}
          >
            {item}
          </Link>
        ),
      )}

      {current < last ? (
        <Link
          href={`${href}?page=${current + 1}`}
          aria-label="Next page"
          className={`${linkClass} ${idleClass}`}
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={`${linkClass} text-neutral-300`}>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}