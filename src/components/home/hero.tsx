import { HeroCarousel } from "@/components/home/hero-carousel";
import { getSliders } from "@/lib/api";
import type { Slider } from "@/lib/api";

function getSliderHref(slider: Slider): string {
  const type = slider.data?.type;
  const payload = slider.data?.payload;
  if (type === "PRODUCT_DETAIL_SCREEN" && payload) {
    return `/product/${payload}`;
  }
  if (type === "PRODUCT_SEARCH_SCREEN") {
    return `/search?q=${encodeURIComponent(slider.name)}`;
  }
  if (type === "COLLECTION_SCREEN" && payload) {
    return `/collection/${payload}`;
  }
  if (slider.redirect_url) {
    return slider.redirect_url;
  }
  return `/search?q=${encodeURIComponent(slider.name)}`;
}

function getSliderImage(slider: Slider): string {
  const landscape = slider.images?.find(
    (img) => img.orientation === "landscape",
  );
  return slider.img_url || landscape?.URL || slider.signed_url || "";
}

function hasLegacyBannerAsset(slider: Slider): boolean {
  return /\/slider-images\/[a-f0-9]{32}\.jpg$/i.test(slider.img_url);
}

function HeroSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-4 lg:px-24 lg:py-8">
      <div className="aspect-[16/7] animate-pulse rounded-xl bg-neutral-200 md:aspect-[16/6] lg:aspect-[16/5]" />
    </div>
  );
}

export async function Hero() {
  const sliders = await getSliders().catch(() => [] as Slider[]);

  if (!sliders.length) return <HeroSkeleton />;

  const sharpItems = sliders.filter((slider) => !hasLegacyBannerAsset(slider));
  const items = (sharpItems.length ? sharpItems : sliders)
    .slice(0, 5)
    .map((slider) => ({
      id: slider.id,
      name: slider.name,
      href: getSliderHref(slider),
      image: getSliderImage(slider),
      order: slider.order,
    }));

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-4 lg:px-24 lg:py-8">
      <HeroCarousel items={items} />
    </section>
  );
}