"use client";

import { useEffect, useState } from "react";
import fetchRequest from "../../../lib/api/fetchRequest";
import columns from "./columns";
import Manager, { FormFieldsProps } from "../Manager";
import GoBack from "../../../components/ui/misc/GoBack";
import FormFields from "../FormFields";
import { formSchema, getCategoryFields } from "./form";
import { CategoryWithOptions } from "@/app/(site)/lib/shared";
import { Option } from "@/prisma/generated/schemas";
import dynamic from "next/dynamic";

const RandomSpinner = dynamic(() => import("../../../components/ui/misc/loader/RandomSpinner"), {
  ssr: false,
});

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

  const Fields = ({ handleSubmit, object, submitLabel }: FormFieldsProps<CategoryWithOptions>) => (
    <FormFields<CategoryWithOptions>
      handleSubmit={handleSubmit}
      submitLabel={submitLabel}
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
