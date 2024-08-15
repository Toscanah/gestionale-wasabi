"use client";

import { useEffect, useState } from "react";
import fetchRequest from "../../util/functions/fetchRequest";
import { Triangle } from "react-loader-spinner";
import Manager from "../Manager";
import GoBack from "../../components/GoBack";
import { OptionWithCategories } from "../../types/OptionWithCategories";
import columns from "./columns";
import FormFields from "../FormFields";
import { formSchema, getOptionFields } from "./form";
import Image from "next/image";
import logo from "../../../../public/logo.png";

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
          <div className="w-full h-full flex items-center justify-center ">
            <Image src={logo} alt="logo" width={600} height={600} className="animate-spin" />
          </div>
        ) : (
          <Manager<OptionWithCategories>
            receivedData={options}
            columns={columns}
            FormFields={Fields}
            path="/api/options/"
            fetchActions={{
              add: "createNewOption",
              delete: "deleteOption",
              update: "updateOption",
            }}
          />
        )}
      </div>

      <GoBack path="/backend" />
    </div>
  );
}
