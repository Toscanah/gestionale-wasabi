"use client";

import { useEffect, useState } from "react";
import fetchRequest from "../../../lib/api/fetchRequest";
import Manager, { FormFieldsProps } from "../Manager";
import GoBack from "../../../components/ui/misc/GoBack";
import { OptionWithCategories } from "@/app/(site)/lib/shared";
import columns from "./columns";
import FormFields from "../FormFields";
import { formSchema, getOptionFields } from "./form";
import dynamic from "next/dynamic";

const RandomSpinner = dynamic(() => import("../../../components/ui/misc/RandomSpinner"), {
  ssr: false,
});

type FormValues = Partial<OptionWithCategories>;

export default function OptionsDashboard() {
  const [options, setOptions] = useState<OptionWithCategories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchRequest<OptionWithCategories[]>(
      "GET",
      "/api/options/",
      "getAllOptionsWithCategories"
    ).then((options) => {
      setOptions(options);
      setLoading(false);
    });
  }, []);

  const Fields = ({ handleSubmit, object, submitLabel }: FormFieldsProps<OptionWithCategories>) => (
    <FormFields
      handleSubmit={handleSubmit}
      submitLabel={submitLabel}
      defaultValues={{ ...object }}
      layout={[{ fieldsPerRow: 1 }]}
      formFields={getOptionFields()}
      formSchema={formSchema}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] gap-4">
        {loading ? (
          <RandomSpinner isLoading={loading} />
        ) : (
          <Manager<OptionWithCategories>
            receivedData={options}
            columns={columns}
            FormFields={Fields}
            path="/api/options/"
            type="option"
            fetchActions={{
              add: "createNewOption",
              toggle: "toggleOption",
              update: "updateOption",
            }}
          />
        )}
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
