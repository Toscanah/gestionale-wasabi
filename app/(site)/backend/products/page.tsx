"use client";

import GoBack from "../../components/ui/misc/GoBack";
import { Product } from "@/app/(site)/models";
import fetchRequest from "../../functions/api/fetchRequest";
import Manager from "../Manager";
import columns from "./columns";
import { useEffect, useState } from "react";
import FormFields from "../FormFields";
import { CategoryWithOptions } from "@/app/(site)/models";
import { formSchema } from "./form";
import { getProductFields } from "./form";
import SelectWrapper from "../../components/ui/select/SelectWrapper";
import { Category } from "@prisma/client";
import { ALL_CATEGORIES } from "../../hooks/statistics/useProductsStats";
import RandomSpinner from "../../components/ui/misc/RandomSpinner";

type FormValues = Partial<Product>;

// const allCategories: Category = {
//   id: -1,
//   category: "all",
//   active: true,
// };

export default function ProductDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithOptions[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(ALL_CATEGORIES);

  useEffect(() => {
    setFilteredProducts(() =>
      selectedCategory.id === -1
        ? products
        : products.filter((product) => product.category_id === selectedCategory.id)
    );
  }, [selectedCategory]);

  useEffect(() => {
    fetchRequest<CategoryWithOptions[]>("GET", "/api/categories/", "getCategories").then(
      (categories) => setCategories(categories.filter((c) => c.active))
    );
  }, []);

  useEffect(() => {
    fetchRequest<Product[]>("GET", "/api/products/", "getProducts").then((products) => {
      setProducts(products);
      setFilteredProducts(products);
      setLoading(false);
    });
  }, []);

  const Fields = ({
    handleSubmit,
    object,
    footerName,
  }: {
    handleSubmit: (values: FormValues) => void;
    object?: Product;
    footerName: string;
  }) => (
    <FormFields
      handleSubmit={handleSubmit}
      footerName={footerName}
      defaultValues={{
        ...object,
        category_id: object?.category_id ? Number(object?.category_id) : undefined,
        rices: object?.rices ? Number(object?.rices) : 0,
        salads: object?.salads ? Number(object?.salads) : 0,
        soups: object?.soups ? Number(object?.soups) : 0,
        // home_price: object?.home_price || undefined,
        // site_price: object?.site_price || undefined,
      }}
      layout={[
        { fieldsPerRow: 2 },
        { fieldsPerRow: 3 },
        { fieldsPerRow: 1 },
        { fieldsPerRow: 3 },
        { fieldsPerRow: 1 },
      ]}
      formFields={getProductFields(categories)}
      formSchema={formSchema}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] gap-4">
        {loading ? (
          <RandomSpinner isLoading={loading} />
        ) : (
          <Manager<Product>
            addionalFilters={[
              <SelectWrapper
                defaultValue="all"
                value={selectedCategory.id.toString()}
                className="h-10 w-64"
                onValueChange={(value) =>
                  setSelectedCategory(
                    categories.find((c) => c.id.toString() === value) || ALL_CATEGORIES
                  )
                }
                groups={[
                  {
                    items: [
                      { name: "Tutte le categorie", value: "-1" },
                      ...categories.map((category) => ({
                        name: category.category,
                        value: category.id.toString(),
                      })),
                    ],
                  },
                ]}
              />,
            ]}
            receivedData={filteredProducts}
            columns={columns}
            FormFields={Fields}
            path="/api/products/"
            type="product"
            fetchActions={{
              add: "createNewProduct",
              toggle: "toggleProduct",
              update: "updateProduct",
            }}
          />
        )}
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
