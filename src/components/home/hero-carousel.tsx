"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "cn";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

type HeroItem = {
  id: number;
  name: string;
  href: string;
  image: string;
  order: number;
};

const AUTOPLAY_INTERVAL = 5000;

export function HeroCarousel({ items }: { items: HeroItem[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused || items.length <= 1) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(id);
  }, [api, paused, items.length]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Carousel
        className="w-full rounded-xl"
        opts={{ loop: true }}
        setApi={setApi}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <Link
                href={item.href}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm transition-shadow duration-300 group-hover:shadow-md md:aspect-[16/6] lg:aspect-[16/5]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 1440px) 100vw, 1440px"
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    priority={item.order === 1}
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      {items.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === current
                  ? "w-5 bg-neutral-950"
                  : "w-1.5 bg-neutral-300 hover:bg-neutral-400",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}