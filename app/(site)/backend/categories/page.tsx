"use client";

import { useEffect, useState } from "react";
import fetchRequest from "../../lib/api/fetchRequest";
import columns from "./columns";
import Manager from "../Manager";
import GoBack from "../../components/ui/misc/GoBack";
import FormFields from "../FormFields";
import { formSchema, getCategoryFields } from "./form";
import { CategoryWithOptions } from "@shared"
;
import { Option } from "@/prisma/generated/zod";
import RandomSpinner from "../../components/ui/misc/RandomSpinner";

type FormValues = Partial<CategoryWithOptions>;

export default function CategoryDashboard() {
  const [categories, setCategories] = useState<CategoryWithOptions[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
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
    fetchRequest<Option[]>("GET", "/api/options/", "getAllOptions").then((options) =>
      setOptions(options.filter((o) => o.active))
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
          <RandomSpinner isLoading={loading} />
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
