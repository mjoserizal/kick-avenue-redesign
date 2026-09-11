const API_BASE = "https://api.kickavenue.com";

export const CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export async function fetchFromApi<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number } },
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    next:
      options?.next ??
      (options?.cache === "no-store" ? undefined : { revalidate: 600 }),
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export interface Slider {
  id: number;
  name: string;
  category_id: number;
  type: string;
  img_url: string;
  redirect_url: string;
  active: boolean;
  order: number;
  data?: {
    type: string;
    payload: number | string;
    body?: { id: number; display_name?: string; slug?: string };
  };
  signed_url?: string;
  images?: {
    id: number;
    slider_id: number;
    orientation: string;
    URL: string;
    signed_url?: string;
  }[];
}

export interface SearchResult {
  id: number;
  product_id: number;
  product_name: string;
  category_id: number;
  category: string;
  subcategory: string | null;
  brand_ids: number[];
  brands: string[];
  display_name: string;
  slug: string;
  nickname: string;
  SKU: string;
  sex: string;
  colour: string;
  weight: number;
  active: boolean;
  editors_choice: boolean;
  biddable: boolean;
  details: string;
  image_url?: string;
  signed_url?: string;
  latest_price?: number;
  latest_price_slashed?: number;
  total_available_sizes?: { brand_new?: number };
  total_sales?: number;
  total_views?: number;
  average_rating?: number;
  has_express_listing?: boolean;
  available_sizes: AvailableSize[];
}

export interface AvailableSize {
  id: number;
  user_id: number;
  size_id: number;
  size: string;
  size_type: string;
  asking_price: number;
  condition: string;
  box_condition: string;
  pre_order: boolean;
  pre_verified: boolean;
  latest_price_slashed: number;
  franchise: string;
}

export interface SearchResponse {
  data: {
    current_page: number;
    last_page: number;
    next_page: number | null;
    per_page: number;
    total_hits: number;
    total: number;
    data: SearchResult[];
  };
}

export interface Brand {
  id: number;
  name: string;
  title: string | null;
  description: string;
  category_id: number;
  popular_brand: string | null;
  img_url: string;
  active: number;
  slug: string;
  signed_url?: string;
}

export interface Facet {
  value: string;
  label: string;
  count: number;
  filter_param?: string;
  filter_value?: string | number | boolean;
}

export interface SizeFacet extends Facet {
  id: number;
}

export interface Aggregates {
  facets: {
    categories: Facet[];
    brands: Facet[];
    genders: Facet[];
    conditions: Facet[];
    sizes: SizeFacet[];
    size_types: Facet[];
    highlights: Facet[];
    price: { min: number; max: number };
  };
}

export interface SubNavItem {
  title: string;
  redirect_url: string;
  text_color?: string;
  sequence: number;
}

export async function getSliders(): Promise<Slider[]> {
  const res = await fetchFromApi<{ data: Slider[] }>("/sliders?type=MAIN");
  return res.data;
}

export async function getBrands(): Promise<Brand[]> {
  const res = await fetchFromApi<{ data: Brand[] }>("/brands", {
    cache: "no-store",
  });
  return res.data;
}

export async function getAggregates(
  params: Record<string, string | number> = {},
): Promise<Aggregates["facets"]> {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== "" && v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  const res = await fetchFromApi<{ data: Aggregates }>(
    `/search/aggregates?availables=true&${query}`,
  );
  return res.data.facets;
}

export async function getWebSubnav(): Promise<SubNavItem[]> {
  const res = await fetchFromApi<{
    data: { data: { value: SubNavItem[] }[] };
  }>("/settings?name=web_subnav&page=1&per_page=15");
  return res.data.data[0]?.value ?? [];
}

export async function getSearchResults(
  params: Record<string, string | number | boolean> = {},
) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== "" && v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  const res = await fetchFromApi<SearchResponse>(`/search?${query}`);
  return res.data;
}

export async function getFeaturedProducts() {
  return getSearchResults({
    page: 1,
    per_page: 10,
    sort_by: "most_popular",
    availables: true,
  });
}

export async function getNewArrivals() {
  return getSearchResults({
    page: 1,
    per_page: 10,
    sort_by: "latest",
    availables: true,
  });
}

export function formatPrice(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "-";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "-";
  return CURRENCY_FORMATTER.format(num);
}

export function getLowestPrice(result: SearchResult): number | null {
  if (result.latest_price != null) return result.latest_price;
  if (!result.available_sizes?.length) return null;
  const available = result.available_sizes.filter((s) => !s.pre_order);
  const source = available.length ? available : result.available_sizes;
  return Math.min(...source.map((s) => s.asking_price));
}

export function getSlashedPrice(result: SearchResult): number | null {
  if (result.latest_price_slashed != null && result.latest_price_slashed > 0)
    return result.latest_price_slashed;
  if (!result.available_sizes?.length) return null;
  const slashed = result.available_sizes
    .filter((s) => s.latest_price_slashed)
    .map((s) => s.latest_price_slashed);
  return slashed.length ? Math.min(...slashed) : null;
}

export function getProductImage(result: SearchResult): string {
  return result.image_url || result.signed_url || "";
}

export interface ProductDetail {
  id: number;
  product_id: number;
  subcategory_id: number;
  display_name: string;
  editors_choice: boolean;
  receive_sell: boolean;
  biddable: boolean;
  voucher_applicable: boolean;
  release_date: string | null;
  SKU: string;
  colour: string;
  dimension: string | null;
  details: string | null;
  retail_price: string | null;
  wants_count: number;
  vintage_label?: { label: string; tooltip?: string };
  eta_text_size?: { pre_verified?: string; pre_order?: string };
  start_from_price_slashed?: string | null;
  product: {
    id: number;
    name: string;
    active?: number;
    brand: { id: number; name: string; slug: string };
    category: { id: number; name: string };
  };
  subcategory?: { id: number; name: string };
  product_variant_images: {
    id: number;
    URL: string;
    position: number;
    signed_url?: string;
  }[];
  availables: ProductAvailable[];
  pre_orders: ProductAvailable[];
  useds: ProductAvailable[];
}

export interface ProductAvailable {
  id: number;
  product_variant_id: number;
  size_id: number;
  asking_price: string;
  sneakers_condition: string;
  box_condition: string;
  pre_order: boolean;
  pre_verified: boolean;
  status: string;
  is_expired: boolean;
  size?: {
    id: number;
    US?: string;
    EUR?: string;
    UK?: string;
    cm?: string;
    sex?: string;
  };
}

export async function getProductDetail(slug: string): Promise<ProductDetail> {
  const res = await fetchFromApi<{ data: ProductDetail }>(
    `/products/${encodeURIComponent(slug)}`,
  );
  return res.data;
}

export function getDetailLowestPrice(detail: ProductDetail): number | null {
  const sources = [
    ...(detail.availables ?? []),
    ...(detail.pre_orders ?? []),
    ...(detail.useds ?? []),
  ];
  if (!sources.length) return null;
  return Math.min(...sources.map((s) => parseFloat(s.asking_price)));
}
