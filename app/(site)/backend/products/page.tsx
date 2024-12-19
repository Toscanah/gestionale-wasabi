"use client";

import GoBack from "../../components/GoBack";
import { Product } from "@/app/(site)/models";
import fetchRequest from "../../util/functions/fetchRequest";
import Manager from "../Manager";
import columns from "./columns";
import { useEffect, useState } from "react";
import FormFields from "../FormFields";
import { CategoryWithOptions } from "@/app/(site)/models";
import { formSchema } from "./form";
import { getProductFields } from "./form";
import logo from "../../../../public/logo.png";
import Image from "next/image";

type FormValues = Partial<Product>;

export default function ProductDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithOptions[]>([]);

  useEffect(() => {
    fetchRequest<CategoryWithOptions[]>("GET", "/api/categories/", "getCategories").then(
      (categories) => setCategories(categories.filter((c) => c.active))
    );
  }, []);

  useEffect(() => {
    fetchRequest<Product[]>("GET", "/api/products/", "getProducts").then((products) => {
      setProducts(products);
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
        // home_price: object?.home_price || undefined,
        // site_price: object?.site_price || undefined,
      }}
      layout={[{ fieldsPerRow: 2 }, { fieldsPerRow: 1 }, { fieldsPerRow: 3 }, { fieldsPerRow: 1 }]}
      formFields={getProductFields(categories)}
      formSchema={formSchema}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] gap-4">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Image src={logo} alt="logo" width={600} height={600} className="animate-spin" />
          </div>
        ) : (
          <Manager<Product>
            receivedData={products}
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
