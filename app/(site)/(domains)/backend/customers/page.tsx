"use client";

import { useEffect, useState } from "react";
import fetchRequest from "../../../lib/api/fetchRequest";
import FormFields from "../FormFields";
import { formSchema, getCustomerFields } from "./form";
import Manager, { FormFieldsProps } from "../Manager";
import columns from "./columns";
import GoBack from "../../../components/ui/misc/GoBack";
import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import dynamic from "next/dynamic";

const RandomSpinner = dynamic(() => import("../../../components/ui/misc/loader/RandomSpinner"), {
  ssr: false,
});

type FormValues = Partial<CustomerWithDetails>;

export default function CustomersDashboard() {
  const [customers, setCustomers] = useState<CustomerWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchRequest<CustomerWithDetails[]>("GET", "/api/customers/", "getCustomersWithDetails").then(
      (customers) => {
        setCustomers(customers);
        setLoading(false);
      }
    );
  }, []);

  const Fields = ({ handleSubmit, object, submitLabel }: FormFieldsProps<CustomerWithDetails>) => (
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
        {loading ? (
          <RandomSpinner isLoading={loading} />
        ) : (
          <Manager<CustomerWithDetails>
            type="customer"
            receivedData={customers}
            columns={columns(customers, setCustomers)}
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
        )}
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
