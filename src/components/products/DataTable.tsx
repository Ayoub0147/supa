'use client';

import { Product } from '@/lib/products';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';
import React from 'react';

type DataTableProps = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSortChange: (key: string, order: 'asc' | 'desc') => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  referenceSearch: string;
  onReferenceSearch: (v: string) => void;
  manufacturerOptions: { id: number; name: string }[];
  categoryOptions: { id: number; name: string }[];
  manufacturerFilter: number | undefined;
  onManufacturerFilter: (id: number | undefined) => void;
  categoryFilter: number | undefined;
  onCategoryFilter: (id: number | undefined) => void;
  loading?: boolean;
};

export function DataTable({
  products,
  total,
  page,
  pageSize,
  onPageChange,
  onSortChange,
  sortBy,
  sortOrder,
  referenceSearch,
  onReferenceSearch,
  manufacturerOptions,
  categoryOptions,
  manufacturerFilter,
  onManufacturerFilter,
  categoryFilter,
  onCategoryFilter,
  loading,
}: DataTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSort = (key: string) => {
    onSortChange(key, sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Card className="w-full shadow-lg border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 p-6 border-b bg-muted/50 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto md:justify-end">
          <Input
            placeholder="Search Reference"
            value={referenceSearch}
            onChange={(e) => onReferenceSearch(e.target.value)}
            className="md:w-48"
          />
          <Select
            value={manufacturerFilter?.toString() || '__all__'}
            onValueChange={(val) =>
              onManufacturerFilter(val === '__all__' ? undefined : Number(val))
            }
          >
            <SelectTrigger className="md:w-44">
              <SelectValue placeholder="All Manufacturers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Manufacturers</SelectItem>
              {manufacturerOptions.map((m) => (
                <SelectItem key={m.id} value={m.id.toString()}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter?.toString() || '__all__'}
            onValueChange={(val) =>
              onCategoryFilter(val === '__all__' ? undefined : Number(val))
            }
          >
            <SelectTrigger className="md:w-44">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Categories</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              {[
                { key: 'articles.name', label: 'Article Name' },
                { key: 'articles.category.name', label: 'Category' },
                { key: 'manufacturers.name', label: 'Manufacturer' },
                { key: 'reference', label: 'Reference' },
                { key: 'certified_by_onee', label: 'Certified by ONEE' },
              ].map(({ key, label }) => (
                <TableHead
                  key={key}
                  className="cursor-pointer select-none"
                  onClick={() => handleSort(key)}
                >
                  {label}
                  {sortBy === key &&
                    (sortOrder === 'asc' ? (
                      <ArrowUp className="inline w-4 h-4 ml-1" />
                    ) : (
                      <ArrowDown className="inline w-4 h-4 ml-1" />
                    ))}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  <Loader2 className="w-6 h-6 mx-auto animate-spin text-muted-foreground" />
                  <div className="mt-2 text-muted-foreground">
                    Loading products...
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p, idx) => (
                <TableRow
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/40'}
                >
                  <TableCell>{p.article.name}</TableCell>
                  <TableCell>{p.article.category.name}</TableCell>
                  <TableCell>{p.manufacturer.name}</TableCell>
                  <TableCell>{p.reference}</TableCell>
                  <TableCell>{p.certified_by_onee ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 px-6 py-4 border-t bg-muted/50">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{products.length}</span> of{' '}
          <span className="font-medium">{total}</span> products
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            Page <span className="font-semibold">{page}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
