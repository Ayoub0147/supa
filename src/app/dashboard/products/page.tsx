"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { fetchProducts, Product } from "@/lib/products";
import { fetchManufacturers, fetchCategories } from "@/lib/filters";
import { DataTable } from "@/components/products/DataTable";

export default function ProductsDashboard() {
  const session = useSession();
  const router = useRouter();

  console.log("Session value:", session);
  // State declarations (must always be called)
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [referenceSearch, setReferenceSearch] = useState("");
  // Remove manufacturerSearch state
  // const [manufacturerSearch, setManufacturerSearch] = useState("");
  const [manufacturerOptions, setManufacturerOptions] = useState<{ id: number; name: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [manufacturerFilter, setManufacturerFilter] = useState<number | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  // Auth redirect
  useEffect(() => {
    if (session === null) {
      router.replace("/auth");
    }
  }, [session, router]);

  // Fetch filter options
  useEffect(() => {
    fetchManufacturers().then(setManufacturerOptions);
    fetchCategories().then(setCategoryOptions);
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    fetchProducts({
      reference: referenceSearch,
      manufacturerName: "", // manufacturerSearch is removed
      manufacturerId: manufacturerFilter,
      categoryId: categoryFilter,
      sortBy,
      sortOrder,
      page,
      pageSize,
    })
      .then(({ data, count }) => {
        const mapped = (data || []).map((item: any) => ({
          id: item.id,
          reference: item.reference,
          certified_by_onee: item.certified_by_onee,
          article: {
            name: Array.isArray(item.article) ? item.article[0]?.name : item.article?.name,
            category: {
              name: Array.isArray(item.article?.category) ? item.article.category[0]?.name : item.article?.category?.name,
            },
          },
          manufacturer: {
            name: Array.isArray(item.manufacturer) ? item.manufacturer[0]?.name : item.manufacturer?.name,
          },
        }));
        setProducts(mapped);
        setTotal(count || 0);
      })
      .finally(() => setLoading(false));
  }, [referenceSearch, manufacturerFilter, categoryFilter, sortBy, sortOrder, page, pageSize]);

  // Show loading spinner while session is being restored
  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-muted-foreground">Loading...</span>
      </div>
    );
  }
  if (session === null) {
    router.replace("/auth");
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Products Dashboard</h1>
      <DataTable
        products={products}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onSortChange={(s, o) => {
          setSortBy(s);
          setSortOrder(o);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        referenceSearch={referenceSearch}
        onReferenceSearch={setReferenceSearch}
        manufacturerOptions={manufacturerOptions}
        categoryOptions={categoryOptions}
        manufacturerFilter={manufacturerFilter}
        onManufacturerFilter={setManufacturerFilter}
        categoryFilter={categoryFilter}
        onCategoryFilter={setCategoryFilter}
        loading={loading}
      />
      {loading && <div className="mt-4">Loading...</div>}
    </div>
  );
}
