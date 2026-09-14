import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ProductGallery,
  BuyPanel,
  ProductBenefits,
} from "@/components/product/product-detail";
import { ProductReviews } from "@/components/product/product-reviews";
import { VariantRail } from "@/components/product/variant-rail";
import {
  getProductDetail,
  getSearchResults,
  getProductReviews,
  getRecommendations,
  getVariantGroup,
  recommendationToSearchResult,
} from "@/lib/api";
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

  const [related, reviews, variantGroup] = await Promise.all([
    getSearchResults({
      category: detail.product.category.id,
      sort_by: "most_popular",
      per_page: 16,
    }).catch(() => null),
    getProductReviews(detail.id).catch(() => null),
    getVariantGroup(detail.id).catch(() => null),
  ]);

  const recommendedRaw = await getRecommendations(detail.id, {
    page: 1,
    limit: 16,
    availables: true,
  }).catch(() => null);
  const recommended = recommendedRaw?.data
    ? recommendedRaw.data.map(recommendationToSearchResult)
    : [];
  const alsoLike = recommended.length
    ? recommended
    : related?.data ?? [];
  const alsoLikeHref = `/search?category=${detail.product.category.name.toLowerCase()}`;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 lg:px-24 lg:py-10">
      <nav className="no-scrollbar mb-6 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-sm text-neutral-500">
        <Link href="/" className="transition-colors hover:text-neutral-950">
          Home
        </Link>
        <span className="text-neutral-300">/</span>
        <Link
          href="/search"
          className="transition-colors hover:text-neutral-950"
        >
          Market
        </Link>
        <span className="text-neutral-300">/</span>
        <Link
          href={`/search?category=${detail.product.category.name.toLowerCase()}`}
          className="transition-colors hover:text-neutral-950"
        >
          {detail.product.category.name}
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="truncate font-medium text-neutral-950">
          {detail.display_name}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={images} name={detail.display_name} />
        <BuyPanel detail={detail} />
      </div>

      <VariantRail group={variantGroup} currentId={detail.id} />

      <ProductBenefits />

      {detail.details ? (
        <div className="mt-16 max-w-3xl border-t border-neutral-200 pt-10">
          <h2 className="mb-4 text-xl font-bold tracking-tight">
            Product Details
          </h2>
          <div
            className="prose-sm prose-neutral max-w-none leading-relaxed text-neutral-600"
            dangerouslySetInnerHTML={{ __html: detail.details }}
          />
        </div>
      ) : null}

      <ProductReviews
        reviews={reviews?.reviews ?? []}
        total={reviews?.total_reviews ?? 0}
      />

      {alsoLike.length > 0 && (
        <div className="mt-16">
          <ProductSection
            eyebrow="More like this"
            title="Rekomendasi untuk Kamu"
            subtitle={`Picks yang cocok dengan ${detail.product.category.name}`}
            products={alsoLike.slice(0, 12)}
            linkHref={alsoLikeHref}
          />
        </div>
      )}
    </div>
  );
}