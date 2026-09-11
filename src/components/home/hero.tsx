import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
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
  const landscape = slider.images?.find((img) => img.orientation === "landscape");
  return slider.img_url || landscape?.URL || slider.signed_url || "";
}

function hasLegacyBannerAsset(slider: Slider): boolean {
  return /\/slider-images\/[a-f0-9]{32}\.jpg$/i.test(slider.img_url);
}

function HeroSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-24 py-4 lg:py-8">
      <div className="aspect-[16/5] rounded-xl bg-neutral-200 animate-pulse" />
    </div>
  );
}

export async function Hero() {
  const sliders = await getSliders().catch(() => [] as Slider[]);

  if (!sliders.length) return <HeroSkeleton />;

  const sharpItems = sliders.filter((slider) => !hasLegacyBannerAsset(slider));
  const items = (sharpItems.length ? sharpItems : sliders).slice(0, 5);

  return (
    <section className="mx-auto max-w-[1440px] px-4 lg:px-24 py-4 lg:py-8" aria-hidden="false">
      <Carousel className="w-full rounded-xl" opts={{ loop: true }}>
        <CarouselContent>
          {items.map((slider) => (
            <CarouselItem key={slider.id}>
              <Link
                href={getSliderHref(slider)}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                <div className="relative w-full aspect-[16/5] overflow-hidden rounded-xl bg-neutral-100 transition-shadow duration-300 group-hover:shadow-md">
                  <Image
                    src={getSliderImage(slider)}
                    alt={slider.name}
                    fill
                    sizes="(max-width: 1440px) 100vw, 1440px"
                    className="object-contain transition-opacity duration-300 group-hover:opacity-95"
                    priority={slider.order === 1}
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}