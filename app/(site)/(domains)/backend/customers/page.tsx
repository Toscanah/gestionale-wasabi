"use client";

import { useEffect, useState } from "react";
import FormFields from "../FormFields";
import { formSchema, getCustomerFields } from "./form";
import Manager, { FormFieldsProps } from "../Manager";
import columns from "./columns";
import GoBack from "../../../components/ui/misc/GoBack";
import { ComprehensiveCustomer } from "@/app/(site)/lib/shared";
import dynamic from "next/dynamic";
import { trpc } from "@/lib/server/client";
import Loader from "@/app/(site)/components/ui/misc/loader/Loader";

const RandomSpinner = dynamic(() => import("../../../components/ui/misc/loader/RandomSpinner"), {
  ssr: false,
});

export default function CustomersDashboard() {
  const { data: customers = [], isFetching } = trpc.customers.getAllComprehensive.useQuery();

  const Fields = ({ handleSubmit, object, submitLabel }: FormFieldsProps<ComprehensiveCustomer>) => (
    <FormFields
      handleSubmit={handleSubmit}
      submitLabel={submitLabel}
      defaultValues={{
        ...object,
        phone: (object?.phone?.phone ?? "") as any,
        email: object?.email ?? "",
        preferences: object?.preferences ?? "",
      }}
      layout={[
        { fieldsPerRow: 1 },
        { fieldsPerRow: 2 },
        { fieldsPerRow: 1 },
        { fieldsPerRow: 2 },
        { fieldsPerRow: 1 },
      ]}
      formFields={getCustomerFields()}
      formSchema={formSchema}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] gap-4">
        <Loader isLoading={isFetching}>
          <Manager<ComprehensiveCustomer>
            type="customer"
            receivedData={customers}
            columns={columns(customers)}
            FormFields={Fields}
            path="/api/customers/"
            pagination
            deleteAction
            fetchActions={{
              add: "createCustomer",
              toggle: "toggleCustomer",
              update: "updateCustomerFromAdmin",
              delete: "deleteCustomerById",
            }}
          />
        </Loader>
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
