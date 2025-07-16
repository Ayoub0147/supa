import { supabase } from "./supabaseClient";

export type Product = {
  id: number;
  article: {
    name: string;
    category: { name: string };
  };
  manufacturer: {
    name: string;
  };
  reference: string;
  certified_by_onee: boolean;
};

export type ProductFilters = {
  reference?: string;
  manufacturerName?: string;
  manufacturerId?: number;
  categoryId?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

async function getManufacturerIdsByName(name: string): Promise<number[]> {
  const { data, error } = await supabase
    .from("manufacturers")
    .select("id")
    .ilike("name", `%${name}%`);
  if (error) throw error;
  return data?.map((m: { id: number }) => m.id) || [];
}

export async function fetchProducts({
  reference,
  manufacturerName,
  manufacturerId,
  categoryId,
  sortBy = "id",
  sortOrder = "asc",
  page = 1,
  pageSize = 10,
}: ProductFilters) {
  console.log("fetchProducts filters:", { reference, manufacturerName, manufacturerId, categoryId, sortBy, sortOrder, page, pageSize });
  let manufacturerIds: number[] | undefined = undefined;
  if (manufacturerName) {
    manufacturerIds = await getManufacturerIdsByName(manufacturerName);
    console.log("manufacturerIds for search:", manufacturerIds);
    if (manufacturerIds.length === 0) {
      return { data: [], count: 0 };
    }
  }

  let query = supabase
    .from("article_manufacturer")
    .select(`
      id,
      reference,
      certified_by_onee,
      article:articles!inner(id, name, category:categories!inner(id, name)),
      manufacturer:manufacturers!inner(id, name)
    `, { count: "exact" });

  if (reference) {
    query = query.ilike("reference", `%${reference}%`);
  }
  if (manufacturerId) {
    query = query.eq("manufacturer_id", manufacturerId);
  }
  if (manufacturerIds) {
    query = query.in("manufacturer_id", manufacturerIds);
  }
  if (categoryId) {
    query = query.eq("articles.category_id", categoryId);
  }
  if (sortBy) {
    query = query.order(sortBy, { ascending: sortOrder === "asc" });
  }
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  console.log("Supabase data:", { data, error, count });
  if (error) throw error;
  return { data, count };
} 