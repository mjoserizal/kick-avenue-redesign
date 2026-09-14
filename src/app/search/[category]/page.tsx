import { redirect } from "next/navigation";

export default async function SearchCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const { category } = await params;
  const sp = await searchParams;

  const value = category.replace(/-/g, " ").trim().toLowerCase();
  if (!value) redirect("/search");

  const qs = new URLSearchParams();
  for (const [key, raw] of Object.entries(sp)) {
    if (key === "category") continue;
    if (Array.isArray(raw)) raw.forEach((item) => qs.append(key, item));
    else if (raw !== undefined) qs.append(key, raw);
  }
  qs.set("category", value);

  redirect(`/search?${qs.toString()}`);
}