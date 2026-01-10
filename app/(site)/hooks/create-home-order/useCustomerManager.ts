import parseAddress from "../../lib/utils/domains/address/parseAddress";
import { AddressFormValues } from "../../(domains)/orders/create-order/home/address/form";
import { ExtraInfo } from "../../context/CreateHomeOrderContext";
import { toastError, toastSuccess } from "../../lib/utils/global/toast";
import { Dispatch, SetStateAction } from "react";
import { AddressContracts, ComprehensiveCustomer, CustomerContracts } from "../../lib/shared";
import { trpc } from "@/lib/server/client";
import { AddressType, CustomerType } from "@/prisma/generated/schemas";
import { useCachedDataContext } from "@/app/(site)/context/CachedDataContext";
import { CustomerOrigin } from "@/prisma/generated/client/enums";

function getActionType(object: object | undefined): "create" | "update" {
  return object === undefined ? "create" : "update";
}

interface UseCustomerManageParams {
  phone: string;
  customer: CustomerType | undefined;
  selectedAddress: AddressType | undefined;
  setExtraInfo: Dispatch<SetStateAction<ExtraInfo>>;
  selectedOption: string;
  setSelectedAddress: Dispatch<SetStateAction<AddressType | undefined>>;
  setSelectedOption: (option: string) => void;
}

type CreateCustomerInput = CustomerContracts.Create.Input["customer"];
type CreateAddressInput = AddressContracts.Create.Input["address"];

export default function useCustomerManager({
  phone,
  customer,
  selectedAddress,
  setExtraInfo,
  selectedOption,
  setSelectedAddress,
  setSelectedOption,
}: UseCustomerManageParams) {
  const createCustomerMutation = trpc.customers.create.useMutation();
  const updateCustomerMutation = trpc.customers.updateFromOrder.useMutation();
  const createAddressMutation = trpc.addresses.create.useMutation();
  const updateAddressMutation = trpc.addresses.update.useMutation();

  const toggleCustomerAddress = async (addressId: number, active: boolean) => {
    await updateAddressMutation.mutateAsync({
      address: {
        id: addressId,
        active,
      },
    });
  };

  const { customers, setCustomers } = useCachedDataContext();

  const utils = trpc.useUtils();

  async function onSubmit(values: AddressFormValues) {
    try {
      const { street, civic } = parseAddress(values.street);

      const actionCustomer = getActionType(customer);
      const actionAddress = getActionType(selectedAddress);

      const customerContent: CreateCustomerInput = {
        order_notes: values.order_notes,
        origin: values.origin,
        name: values.name,
        surname: values.surname,
        preferences: values.preferences,
        email: values.email,
        phone,
      };

      const addressContent: Omit<CreateAddressInput, "customer_id"> = {
        street,
        civic,
        doorbell: values.doorbell,
        floor: values.floor,
        stair: values.stair,
        street_info: values.street_info,
        temporary: selectedOption === "temp",
      };

      setExtraInfo({ contactPhone: values.contact_phone ?? undefined });

      // --- Optimistic customer ---
      let optimisticCustomer: ComprehensiveCustomer;

      if (actionCustomer === "create") {
        optimisticCustomer = {
          id: Math.floor(Math.random() * -1000),
          phone_id: -1,
          active: true,
          origin: customerContent.origin ?? CustomerOrigin.UNKNOWN,
          name: customerContent.name ?? null,
          surname: customerContent.surname ?? null,
          email: customerContent.email ?? null,
          preferences: customerContent.preferences ?? null,
          order_notes: customerContent.order_notes ?? null,

          // 👇 required nested structures
          phone: { id: -1, phone },
          addresses: [],
          home_orders: [],
          pickup_orders: [],
          engagements: [],
        } as ComprehensiveCustomer;
      } else {
        const { phone: _phone, ...customerContentWithoutPhone } = customerContent;
        optimisticCustomer = {
          ...customer!,
          ...customerContentWithoutPhone,
        } as ComprehensiveCustomer;
      }

      // Update cached customers immediately
      setCustomers((prev) => {
        const exists = prev.some((c) => c.id === optimisticCustomer.id);
        return exists
          ? prev.map((c) => (c.id === optimisticCustomer.id ? optimisticCustomer : c))
          : [...prev, optimisticCustomer];
      });

      // --- Actual DB call ---
      let updatedCustomer: CustomerType;
      if (actionCustomer === "create") {
        updatedCustomer = await createCustomerMutation.mutateAsync({ customer: customerContent });
      } else {
        if (!customer) throw new Error("Missing customer for update");
        updatedCustomer = await updateCustomerMutation.mutateAsync({
          customer: { ...customer, ...customerContent },
        });
      }

      utils.customers.getByPhone.setData({ phone }, updatedCustomer);

      // Replace optimistic with real one
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === optimisticCustomer.id || c.id === updatedCustomer.id) {
            return {
              ...c, // keep nested relations like addresses, orders, etc.
              ...updatedCustomer, // overwrite scalar fields
            } as ComprehensiveCustomer;
          }
          return c;
        })
      );

      // --- Address creation/update ---
      let updatedAddress: AddressType;
      if (actionAddress === "create") {
        updatedAddress = await createAddressMutation.mutateAsync({
          address: { ...addressContent, customer_id: updatedCustomer.id },
        });
      } else {
        if (!selectedAddress) throw new Error("Missing address for update");
        updatedAddress = await updateAddressMutation.mutateAsync({
          address: { ...addressContent, customer_id: updatedCustomer.id, id: selectedAddress.id },
        });
      }

      utils.addresses.getByCustomer.setData({ customerId: updatedCustomer.id }, (prev) => {
        if (!prev) return [updatedAddress];
        const exists = prev.some((addr) => addr.id === updatedAddress.id);
        return exists
          ? prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
          : [...prev, updatedAddress];
      });

      // Merge new/updated address into cached customer
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id !== updatedCustomer.id) return c;
          const exists = c.addresses.some((a) => a.id === updatedAddress.id);
          const updatedAddresses = exists
            ? c.addresses.map((a) => (a.id === updatedAddress.id ? updatedAddress : a))
            : [...c.addresses, updatedAddress];
          return { ...c, addresses: updatedAddresses };
        })
      );

      setSelectedOption(updatedAddress.id.toString());

      // 👇 2. UPDATE THE OBJECT (The Data State)
      // Note: This is technically redundant if useAddressSelection is working perfectly,
      // but it makes the UI update feel instant without waiting for the effect cycle.
      setSelectedAddress(updatedAddress);

      toastSuccess("Il cliente e i suoi indirizzi sono stati correttamente aggiornati");
    } catch (err) {
      console.error(err);
      toastError("Errore durante l'aggiornamento del cliente o dell'indirizzo");
    }
  }

  return { onSubmit, toggleCustomerAddress };
}
