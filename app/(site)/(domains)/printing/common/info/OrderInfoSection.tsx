import { OrderByType, HomeOrder, PickupOrder, OrderGuards } from "@/app/(site)/lib/shared";
import { OrderType, PlannedPayment } from "@prisma/client";
import CommonInfo from "./CommonInfo";
import HomeInfo from "./HomeInfo";
import { AddressType } from "@/prisma/generated/schemas";

interface OrderInfoSectionProps {
  order: OrderByType;
  plannedPayment: PlannedPayment;
  options: {
    putExtraItems?: boolean;
    putWhen?: boolean;
  };
}

export default function OrderInfoSection({
  order,
  plannedPayment,
  options: { putExtraItems = true, putWhen = true },
}: OrderInfoSectionProps) {
  const isHome = OrderGuards.isHome(order);

  // --- Common fields ---
  let prepaid = false;
  let whenValue: string | undefined;
  let preferences: string | undefined;
  let orderNotes: string | undefined;

  // --- Home-only fields ---
  let address: AddressType | undefined = undefined;
  let contactPhone: string | undefined;
  let phone: string | undefined;

  if (isHome) {
    const o = order as HomeOrder;
    const ho = o.home_order!;
    prepaid = ho.prepaid ?? false;
    whenValue = ho.when;
    preferences = ho.customer?.preferences ?? undefined;
    orderNotes = ho.customer?.order_notes ?? undefined;
    phone = ho.customer?.phone?.phone;
    address = ho.address;
    contactPhone = ho.contact_phone ?? undefined;
  } else {
    const o = order as PickupOrder;
    const po = o.pickup_order!;
    prepaid = po.prepaid ?? false;
    whenValue = po.when;
    preferences = po.customer?.preferences ?? undefined;
    orderNotes = po.customer?.order_notes ?? undefined;
  }

  return (
    <>
      {CommonInfo({
        order,
        plannedPayment,
        putExtraItems,
        preferences,
        orderNotes,
        prepaid,
      })}

      {isHome && address && HomeInfo({ address, phone, contactPhone, putWhen, whenValue })}
    </>
  );
}
