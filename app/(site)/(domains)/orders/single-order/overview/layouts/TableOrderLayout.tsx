import { TableOrder } from "@/app/(site)/lib/shared";
import Discount from "../Discount";
import Engagement from "../Engagement";
import NormalActions from "../NormalActions";
import Rice from "../Rice";
import TableUpdate from "../TableUpdate";
import Total from "../Total";
import { PayingAction } from "../../OrderTable";
import { Dispatch, SetStateAction } from "react";
import { PlannedPayment } from "@prisma/client";

interface TableOrderLayoutProps {
  setAction: Dispatch<SetStateAction<PayingAction>>;
}

export default function TableOrderLayout({ setAction }: TableOrderLayoutProps) {
  return (
    <>
      <div className="w-full flex gap-6  items-center">
        <Engagement />
        <Discount />
      </div>

      <TableUpdate />
      <Rice />
      <Total />

      <div className="mt-auto flex flex-col gap-6">
        <NormalActions setAction={setAction} plannedPayment={PlannedPayment.UNKNOWN} />
      </div>
    </>
  );
}
