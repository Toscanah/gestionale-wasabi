"use client";

import { useEffect, useState } from "react";
import fetchRequest from "../../lib/api/fetchRequest";
import Manager from "../Manager";
import GoBack from "../../components/ui/misc/GoBack";
import { OptionWithCategories } from "@shared"
;
import columns from "./columns";
import FormFields from "../FormFields";
import { formSchema, getOptionFields } from "./form";
import RandomSpinner from "../../components/ui/misc/RandomSpinner";

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

  const Fields = ({
    handleSubmit,
    object,
    footerName,
  }: {
    handleSubmit: (values: FormValues) => void;
    object?: OptionWithCategories;
    footerName: string;
  }) => (
    <FormFields
      handleSubmit={handleSubmit}
      footerName={footerName}
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
