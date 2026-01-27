"use client";

import Manager, { FormFieldsProps } from "../manager/Manager";
import columns from "./columns";
import { useEffect, useState } from "react";
import { getProductFields, ProductFormData, productFormSchema } from "./form";
import useProductsManager from "@/hooks/backend/base/useProductsManager";
import { Path } from "react-hook-form";
import { categoriesAPI } from "@/lib/trpc/api";
import { FormFields } from "../manager/FormFields";
import CategoryFilter from "@/components/shared/filters/select/CategoryFilter";
import { Product, ProductSortField } from "@/lib/shared";
import useTablePagination from "@/hooks/table/useTablePagination";
import { SortableField, SortField } from "@/components/shared/sorting/SortingMenu";

const toFormData = (p: Product): ProductFormData => {
  const { category, ...rest } = p;

  return {
    ...rest,
    category_id: p.category?.id ?? null,
  };
};

const fromFormData = (f: ProductFormData): Partial<Product> => ({
  ...f,
  category_id: f.category_id ?? null,
});

const PRODUCT_SORT_MAP: Record<string, { field: ProductSortField; type?: SortableField["type"] }> =
  {
    Categoria: { field: "category.category", type: "string" },
    Codice: { field: "code", type: "string" },
    Descrizione: { field: "desc", type: "string" },
    "Prezzo in loco": { field: "home_price", type: "number" },
    "Prezzo da asporto": { field: "site_price", type: "number" },
    Cucina: { field: "kitchen", type: "string" },
    Riso: { field: "rice", type: "number" },
  };

export default function ProductDashboard() {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [activeSorts, setActiveSorts] = useState<SortField[]>([]);
  const { page, pageSize, setPage, setPageSize } = useTablePagination();

  const { data: categoryCounts = [] } = categoriesAPI.countProductsByCategory.useQuery();
  const { data: categories = [] } = categoriesAPI.getAll.useQuery(undefined, {
    select: (cats) => cats.filter((c) => c.active),
  });

  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories([...categories.filter((c) => c.active).map((c) => c.id), -1]);
    }
  }, [categories, selectedCategories.length]);

  const layout: { fields: Path<ProductFormData>[] }[] = [
    { fields: ["code", "kitchen"] },
    { fields: ["category_id"] },
    { fields: ["desc"] },
    { fields: ["home_price", "site_price"] },
    { fields: ["rices", "salads", "soups", "rice"] },
  ];

  const Fields = ({ handleSubmit, object, submitLabel }: FormFieldsProps<ProductFormData>) => (
    <FormFields
      handleSubmit={handleSubmit}
      submitLabel={submitLabel}
      defaultValues={productFormSchema.parse(object || {})}
      layout={layout}
      formSchema={productFormSchema}
      formFields={getProductFields(categories)}
    />
  );

  return (
    <Manager<Product, ProductFormData>
      useDomainManager={() =>
        useProductsManager({
          categoryIds:
            selectedCategories.length === categories.length + 1 // +1 for "no category"
              ? undefined
              : selectedCategories.includes(-1)
                ? selectedCategories // 👈 still pass full array (including -1)
                : selectedCategories,
          pagination: { page, pageSize },
          sort: activeSorts.map((s) => ({
            field: PRODUCT_SORT_MAP[s.field].field,
            direction: s.direction,
          })),
        })
      }
      columns={columns}
      FormFields={Fields}
      mapToForm={toFormData}
      mapFromForm={fromFormData}
      pagination={{ page, pageSize, setPage, setPageSize, mode: "server" }}
      serverSorting={{
        availableFields: Object.entries(PRODUCT_SORT_MAP).map(([k, v]) => ({
          label: k,
          value: k,
          type: v.type,
        })),
        activeSorts,
        onChange: (sorts) => setActiveSorts(sorts),
      }}
      filters={{
        components: [
          <CategoryFilter
            categoryCounts={Object.fromEntries(
              categoryCounts.map((c) => [c.categoryId ?? -1, c.productCount])
            )}
            allCategories={categories}
            selectedCategoryIds={selectedCategories}
            onCategoryIdsChange={setSelectedCategories}
          />,
        ],
        onReset: () => setSelectedCategories([]),
        showReset: selectedCategories.length !== categories.length + 1, // +1 for "no category"
      }}
      labels={{ singular: "prodotto", plural: "prodotti" }}
    />
  );
}
