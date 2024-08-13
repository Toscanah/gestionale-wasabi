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
import { getProductFields } from "./form";
import { Textarea } from "@/components/ui/textarea";
import { BallTriangle, Grid, LineWave, Triangle } from "react-loader-spinner";

type ProductAndCategory = Omit<ProductWithInfo, "category"> & {
  category: string;
};

type FormValues = Partial<ProductAndCategory>;

export default function ProductDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
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
      setLoading(false)
    });
  }, []);

  // TODO:
  const onProductDelete = (productToDelete: ProductAndCategory) => {};

  const onProductUpdate = async (newValues: FormValues, productToUpdate: ProductAndCategory) => {
    return await fetchRequest<ProductAndCategory>("POST", "/api/products/", "editProduct", {
      ...newValues,
      id: productToUpdate.id,
    });
  };

  const onProductAdd = async (values: FormValues) => {
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
    handleSubmit: (values: FormValues) => void;
    object?: ProductAndCategory;
    footerName: string;
  }) => (
    <FormFields
      handleSubmit={handleSubmit}
      footerName={footerName}
      defaultValues={{
        ...object,
        category: String(object?.category_id),
      }}
      layout={[{ fieldsPerRow: 2 }, { fieldsPerRow: 1 }, { fieldsPerRow: 3 }]}
      formFields={getProductFields(categories)}
      formSchema={formSchema}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] gap-4">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Triangle
              height="360"
              width="360"
              color="red"
              //wrapperClass="w-full h-full flex items-center justify-center"
            />
          </div>
        ) : (
          products.length > 0 && (
            <Manager<ProductAndCategory>
              receivedData={products}
              columns={columns}
              FormFields={Fields}
              onObjectDelete={onProductDelete}
              onObjectAdd={onProductAdd}
              onObjectUpdate={onProductUpdate}
            />
          )
        )}
      </div>

      <GoBack path="/backend" />
    </div>
  );
}
