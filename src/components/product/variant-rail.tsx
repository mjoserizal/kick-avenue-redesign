import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import type { VariantGroup } from "@/lib/api";

const MAX_VARIANTS = 12;

export function VariantRail({
  group,
  currentId,
}: {
  group: VariantGroup | null;
  currentId: number;
}) {
  if (!group?.variants?.length) return null;

  const variants = group.variants.slice(0, MAX_VARIANTS);
  const shown = variants.length;

  return (
    <section className="mt-8 lg:mt-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-dark">
            Varian lainnya
          </p>
          <h2 className="text-lg font-bold tracking-tight text-neutral-950 lg:text-xl">
            {group.group.name}
          </h2>
        </div>
        <p className="text-xs text-neutral-500">
          {group.group.total_variants} varian tersedia
        </p>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {variants.map((variant) => {
          const isCurrent = variant.id === currentId;
          return (
            <Link
              key={variant.id}
              href={`/product/${variant.slug}`}
              aria-current={isCurrent ? "true" : undefined}
              className={`group flex w-24 shrink-0 flex-col items-start gap-1.5 lg:w-28 ${
                isCurrent ? "opacity-100" : "opacity-80 hover:opacity-100"
              }`}
            >
              {isCurrent ? (
                <span className="flex w-full flex-col gap-1">
                  <span className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-neutral-950 bg-white p-2">
                    <Image
                      src={variant.thumbnail}
                      alt={variant.colour}
                      fill
                      sizes="112px"
                      className="object-contain"
                    />
                    <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-neutral-950 text-white">
                      <Check className="size-3" />
                    </span>
                  </span>
                  <span className="w-full text-xs font-semibold text-neutral-950">
                    {variant.colour}
                  </span>
                </span>
              ) : (
                <span className="flex w-full flex-col gap-1">
                  <span className="relative aspect-square w-full overflow-hidden rounded-xl border border-neutral-200/80 bg-white p-2 transition-colors group-hover:border-neutral-950">
                    <Image
                      src={variant.thumbnail}
                      alt={variant.colour}
                      fill
                      sizes="112px"
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </span>
                  <span className="w-full truncate text-xs text-neutral-600">
                    {variant.colour}
                  </span>
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {group.group.total_variants > shown && (
        <p className="mt-3 text-xs text-neutral-400">
          + {group.group.total_variants - shown} varian lainnya
        </p>
      )}
    </section>
  );
}