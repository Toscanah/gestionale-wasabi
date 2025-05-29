import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { PaymentType } from "@prisma/client";
import { AnyOrder } from "@shared";
import useOrderPayment from "../hooks/useOrderPayment";
import roundToTwo from "../lib/formatting-parsing/roundToTwo";
import getDiscountedTotal from "../lib/order-management/getDiscountedTotal";
import { useOrderContext } from "./OrderContext";
import { getOrderTotal } from "../lib/order-management/getOrderTotal";

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
  isPaying: boolean;
  setIsPaying: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isPaying, setIsPaying] = useState(false);
  const { order: contextOrder } = useOrderContext();
  const order = partialOrder || contextOrder;

  const [activeTool, setActiveTool] = useState<"manual" | "table">("manual");
  const [paymentCalculations, setPaymentCalculations] = useState<PaymentCalculation[]>([
    { amount: 0, quantity: 0, total: 0 },
  ]);

  const orderTotal = getOrderTotal({ order, applyDiscount: true });

  const defaultPayment: Payment = {
    paymentAmounts: {
      [PaymentType.CASH]: undefined,
      [PaymentType.CARD]: undefined,
      [PaymentType.VOUCH]: undefined,
      [PaymentType.CREDIT]: undefined,
    },
    paidAmount: 0,
    remainingAmount: orderTotal,
  };

  const [payment, setPayment] = useState<Payment>(defaultPayment);

  const [typedAmount, setTypedAmount] = useState<string>(
    roundToTwo(payment.remainingAmount).toString()
  );
  const { handlePaymentChange, payOrder, resetPaymentValues } = useOrderPayment(
    isPaying,
    setIsPaying,
    type,
    onOrderPaid,
    payment,
    setPayment,
    order
  );

  useEffect(() => {
    setPayment(defaultPayment);
    setTypedAmount(roundToTwo(defaultPayment.remainingAmount).toString());
  }, [orderTotal]);

  const resetPayment = () => {
    resetPaymentValues();
    setTypedAmount(orderTotal.toString());
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
        isPaying,
        setIsPaying,
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
