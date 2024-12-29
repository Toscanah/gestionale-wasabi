"use client";

import { useEffect, useState } from "react";
import fetchRequest from "../../functions/api/fetchRequest";
import columns from "./columns";
import Manager from "../Manager";
import GoBack from "../../components/GoBack";
import FormFields from "../FormFields";
import { formSchema, getCategoryFields } from "./form";
import logo from "../../../../public/logo.png";
import Image from "next/image";
import { CategoryWithOptions } from "../../models";
import { Option } from "@/prisma/generated/zod";
import { OptionOption } from "./CategoryOptions";

type FormValues = Partial<CategoryWithOptions>;

export default function CategoryDashboard() {
  const [categories, setCategories] = useState<CategoryWithOptions[]>([]);
  const [options, setOptions] = useState<OptionOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchRequest<CategoryWithOptions[]>("GET", "/api/categories/", "getCategories").then(
      (categories) => {
        setCategories(categories);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    fetchRequest<OptionOption[]>("GET", "/api/options/", "getAllOptions").then((options) =>
      setOptions(options.filter((p) => p.option.active))
    );
  }, []);

  const Fields = ({
    handleSubmit,
    object,
    footerName,
  }: {
    handleSubmit: (values: FormValues) => void;
    object?: CategoryWithOptions;
    footerName: string;
  }) => (
    <FormFields<CategoryWithOptions>
      handleSubmit={handleSubmit}
      footerName={footerName}
      defaultValues={{ ...object }}
      layout={[{ fieldsPerRow: 1 }, { fieldsPerRow: 1 }]}
      formFields={getCategoryFields(options)}
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
          <Manager<CategoryWithOptions>
            type="category"
            receivedData={categories}
            columns={columns}
            FormFields={Fields}
            path="/api/categories/"
            fetchActions={{
              add: "createNewCategory",
              toggle: "toggleCategory",
              update: "updateCategory",
            }}
          />
        )}
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
