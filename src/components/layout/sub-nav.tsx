import Link from "next/link";
import { getWebSubnav } from "@/lib/api";
import type { SubNavItem } from "@/lib/api";

function getHref(item: SubNavItem): string {
  const raw = item.redirect_url ?? "";
  const index = raw.indexOf("/search");
  if (index >= 0) return raw.slice(index);
  if (raw.includes("kickavenue.com/")) {
    const parts = raw.split("kickavenue.com/");
    return "/" + (parts[1] ?? "");
  }
  return raw || "/search";
}

export async function SubNav() {
  const items = await getWebSubnav().catch(() => [] as SubNavItem[]);

  if (!items.length) return null;

  return (
    <div className="hidden lg:block border-b border-neutral-200 bg-white">
      <nav
        aria-label="Categories"
        className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-24 py-2.5"
      >
        {[...items]
          .sort((a, b) => a.sequence - b.sequence)
          .map((item) => (
            <Link
              key={`${item.title}-${item.sequence}`}
              href={getHref(item)}
              className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-100"
              style={{ color: item.text_color ?? undefined }}
            >
              {item.title}
            </Link>
          ))}
      </nav>
    </div>
  );
}