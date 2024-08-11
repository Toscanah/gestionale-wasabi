"use client";

import GoBack from "../../components/GoBack";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import fetchRequest from "../../util/functions/fetchRequest";
import Manager from "../Manager";
import columns from "./columns";
import { useEffect, useState } from "react";
import FormFields from "../FormFields";
import { CategoryWithOptions } from "../../types/CategoryWithOptions";
import { formSchema } from "./form";
import { getFormFields } from "./form";
import { Textarea } from "@/components/ui/textarea";

type ProductAndCategory = Omit<ProductWithInfo, "category"> & {
  category: string;
};

export default function ProductDashboard() {
  const [products, setProducts] = useState<ProductAndCategory[]>([]);
  const [categories, setCategories] = useState<CategoryWithOptions[]>([]);

  useEffect(() => {
    fetchRequest<CategoryWithOptions[]>("GET", "/api/categories/", "getCategories").then(
      (categories) => setCategories(categories)
    );
  }, []);

  useEffect(() => {
    fetchRequest<ProductAndCategory[]>("GET", "/api/products/", "getProducts").then((products) => {
      setProducts(products);
    });
  }, []);

  // TODO:
  const onProductDelete = (productToDelete: ProductAndCategory) => {};

  const onProductUpdate = async (
    newValues: Partial<ProductAndCategory>,
    productToUpdate: ProductAndCategory
  ) => {
    return await fetchRequest<ProductAndCategory>("POST", "/api/products/", "editProduct", {
      ...newValues,
      id: productToUpdate.id,
    });
  };

  const onProductAdd = async (values: Partial<ProductAndCategory>) => {
    return await fetchRequest<ProductAndCategory>(
      "POST",
      "/api/products/",
      "createNewProduct",
      values
    );
  };

  const Fields = ({
    handleSubmit,
    object,
    footerName,
  }: {
    handleSubmit: (values: Partial<ProductAndCategory>) => void;
    object?: ProductAndCategory;
    footerName: string;
  }) => (
    <FormFields<ProductAndCategory>
      handleSubmit={handleSubmit}
      footerName={footerName}
      defaultValues={{
        ...object,
        category: String(object?.category_id),
      }}
      layout={[{ fieldsPerRow: 2 }, { fieldsPerRow: 1 }, { fieldsPerRow: 3 }]}
      formFields={getFormFields(categories, object?.category_id ?? -1)}
      formSchema={formSchema}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] gap-4">
        {products.length > 0 && (
          <Manager<ProductAndCategory>
            receivedData={products}
            columns={columns}
            FormFields={Fields}
            onObjectDelete={onProductDelete}
            onObjectAdd={onProductAdd}
            onObjectUpdate={onProductUpdate}
          />
        )}
      </div>

      <GoBack path="/backend" />
    </div>
  );
}
