import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGallery, BuyPanel } from "@/components/product/product-detail";
import { getProductDetail, getSearchResults } from "@/lib/api";
import { ProductSection } from "@/components/product/product-section";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getProductDetail(slug).catch(() => null);
  if (!detail) return { title: "Product Not Found" };
  return {
    title: `${detail.display_name} - Kick Avenue Redesign`,
    description: `${detail.display_name} at Kick Avenue Redesign. 100% Authentic. Guaranteed.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getProductDetail(slug).catch(() => null);

  if (!detail) notFound();

  const images = (detail.product_variant_images ?? [])
    .sort((a, b) => a.position - b.position)
    .map((img) => img.URL || img.signed_url || "");

  let related: Awaited<ReturnType<typeof getSearchResults>> | null = null;
  try {
    related = await getSearchResults({
      category: detail.product.category.id,
      sort_by: "most_popular",
      per_page: 10,
    });
  } catch {
    related = null;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-24 py-6 lg:py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/search" className="hover:text-neutral-900">
          Market
        </Link>
        <span>/</span>
        <Link
          href={`/search?category=${detail.product.category.name.toLowerCase()}`}
          className="hover:text-neutral-900"
        >
          {detail.product.category.name}
        </Link>
        <span>/</span>
        <span className="truncate text-neutral-900">{detail.display_name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={images} name={detail.display_name} />
        <BuyPanel detail={detail} />
      </div>

      {detail.details ? (
        <div className="mt-16 max-w-3xl">
          <h2 className="mb-3 text-lg font-bold">Product Details</h2>
          <div
            className="text-sm leading-relaxed text-neutral-700"
            dangerouslySetInnerHTML={{ __html: detail.details }}
          />
        </div>
      ) : null}

      {related && related.data.length > 0 && (
        <div className="mt-16">
          <ProductSection
            title="You May Also Like"
            subtitle={`More from ${detail.product.category.name}`}
            products={related.data.slice(0, 10)}
            linkHref={`/search?category=${detail.product.category.name.toLowerCase()}`}
          />
        </div>
      )}
    </div>
  );
}