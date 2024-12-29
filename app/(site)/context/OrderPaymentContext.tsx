import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { PaymentType } from "@prisma/client";
import { AnyOrder } from "@/app/(site)/models";
import useOrderPayment from "../components/hooks/useOrderPayment";
import formatAmount from "../functions/formatting-parsing/formatAmount";
import applyDiscount from "../functions/order-management/applyDiscount";
import { useOrderContext } from "./OrderContext";

interface OrderPaymentContextProps {
  payment: Payment;
  typedAmount: string;
  setTypedAmount: React.Dispatch<React.SetStateAction<string>>;
  setActiveTool: React.Dispatch<React.SetStateAction<"manual" | "table">>;
  handlePaymentChange: (type: PaymentType, amount: number | undefined) => void;
  payOrder: () => void;
  paymentCalculations: PaymentCalculation[];
  activeTool: "manual" | "table";
  setPaymentCalculations: React.Dispatch<React.SetStateAction<PaymentCalculation[]>>;
  resetPayment: () => void;
  order: AnyOrder;
}

interface OrderPaymentProvider {
  type: "full" | "partial";
  onOrderPaid: () => void;
  children: ReactNode;
  partialOrder?: AnyOrder;
}

const OrderPaymentContext = createContext<OrderPaymentContextProps | undefined>(undefined);

export type Payment = {
  paymentAmounts: {
    [PaymentType.CASH]?: number;
    [PaymentType.CARD]?: number;
    [PaymentType.VOUCH]?: number;
    [PaymentType.CREDIT]?: number;
  };
  paidAmount: number;
  remainingAmount: number;
};

export type PaymentCalculation = { amount: number; quantity: number; total: number };

export const OrderPaymentProvider = ({
  partialOrder,
  type,
  onOrderPaid,
  children,
}: OrderPaymentProvider) => {
  const { order: contextOrder } = useOrderContext();
  const order = partialOrder || contextOrder;

  const [activeTool, setActiveTool] = useState<"manual" | "table">("manual");
  const [paymentCalculations, setPaymentCalculations] = useState<PaymentCalculation[]>([
    { amount: 0, quantity: 0, total: 0 },
  ]);

  const [payment, setPayment] = useState<Payment>({
    paymentAmounts: {
      [PaymentType.CASH]: undefined,
      [PaymentType.CARD]: undefined,
      [PaymentType.VOUCH]: undefined,
      [PaymentType.CREDIT]: undefined,
    },
    paidAmount: 0,
    remainingAmount: applyDiscount(order.total, order.discount) ?? 0,
  });

  const [typedAmount, setTypedAmount] = useState<string>(formatAmount(payment.remainingAmount));
  const { handlePaymentChange, payOrder } = useOrderPayment(
    type,
    onOrderPaid,
    payment,
    setPayment,
    order
  );

  const resetPayment = () => {
    Object.values(PaymentType).map((type) => handlePaymentChange(type, undefined));
    setTypedAmount((applyDiscount(order.total, order.discount) ?? 0).toString());
  };

  return (
    <OrderPaymentContext.Provider
      value={{
        handlePaymentChange,
        payment,
        payOrder,
        setTypedAmount,
        typedAmount,
        activeTool,
        setActiveTool,
        paymentCalculations,
        setPaymentCalculations,
        resetPayment,
        order,
      }}
    >
      {children}
    </OrderPaymentContext.Provider>
  );
};

export function useOrderPaymentContext() {
  const context = useContext(OrderPaymentContext);
  if (context === undefined) {
    throw new Error("useOrderPaymentContext must be used within an OrderPaymentProvider");
  }
  return context;
}
