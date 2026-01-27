"use client";

import columns from "./columns";
import Manager, { FormFieldsProps } from "../manager/Manager";
import { CategoryWithOptions } from "@/lib/shared";
import { FormFields } from "../manager/FormFields";
import { CategoryFormData, categoryFormSchema, getCategoryFields } from "./form";
import useCategoriesManager from "@/hooks/backend/base/useCategoriesManager";
import { optionsAPI } from "@/lib/trpc/api";

const toFormData = (p: CategoryWithOptions): CategoryFormData => ({
  ...p,
  options: p.options.map((o) => o.option),
});

const fromFormData = (f: CategoryFormData): Partial<CategoryWithOptions> => ({
  ...f,
  options: f.options.map((o) => ({ option: o })),
});

export default function CategoryDashboard() {
  const { data: options = [] } = optionsAPI.getAll.useQuery();

  const Fields = ({ handleSubmit, object, submitLabel }: FormFieldsProps<CategoryFormData>) => (
    <FormFields
      handleSubmit={handleSubmit}
      submitLabel={submitLabel}
      defaultValues={categoryFormSchema.parse(object || {})}
      layout={[{ fields: ["category"] }, { fields: ["options"] }]}
      formFields={getCategoryFields(options.filter((o) => o.active))}
      formSchema={categoryFormSchema}
    />
  );

  return (
    <Manager<CategoryWithOptions, CategoryFormData>
      columns={columns}
      pagination={{
        mode: "client",
      }}
      useDomainManager={useCategoriesManager}
      FormFields={Fields}
      mapToForm={toFormData}
      mapFromForm={fromFormData}
      labels={{ singular: "categoria", plural: "categorie" }}
    />
  );
}
