"use client";

import Manager, { FormFieldsProps } from "../manager/Manager";
import { OptionWithCategories } from "@/lib/shared";
import columns from "./columns";
import { getOptionFields, OptionFormData, optionFormSchema } from "./form";
import useOptionsManager from "@/hooks/backend/base/useOptionsManager";
import { FormFields } from "../manager/FormFields";

export default function OptionsDashboard() {
  const Fields = ({ handleSubmit, object, submitLabel }: FormFieldsProps<OptionFormData>) => (
    <FormFields
      handleSubmit={handleSubmit}
      submitLabel={submitLabel}
      defaultValues={optionFormSchema.parse(object || {})}
      layout={[{ fields: ["option_name"] }]}
      formFields={getOptionFields()}
      formSchema={optionFormSchema}
    />
  );

  return (
    <Manager<OptionWithCategories, OptionFormData>
      useDomainManager={useOptionsManager}
      pagination={{
        mode: "client",
      }}
      columns={columns}
      FormFields={Fields}
      labels={{ singular: "opzione", plural: "opzioni" }}
    />
  );
}
