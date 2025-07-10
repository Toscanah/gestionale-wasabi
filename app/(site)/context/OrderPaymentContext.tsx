import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { PaymentType } from "@prisma/client";
import { AnyOrder } from "@/app/(site)/lib/shared";
import useOrderPayment from "../hooks/useOrderPayment";
import roundToTwo from "../lib/formatting-parsing/roundToTwo";
import { useOrderContext } from "./OrderContext";
import { getOrderTotal } from "../lib/services/order-management/getOrderTotal";
import { OrderPaymentProps } from "../payments/order/OrderPayment";
import roundToCents from "../lib/utils/roundToCents";

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
  orderTotal: number;
}

interface OrderPaymentProviderProps extends Omit<OrderPaymentProps, "onBackButton"> {
  children: ReactNode;
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

export const DEFAULT_PAYMENT: Payment = {
  paymentAmounts: {
    [PaymentType.CASH]: undefined,
    [PaymentType.CARD]: undefined,
    [PaymentType.VOUCH]: undefined,
    [PaymentType.CREDIT]: undefined,
  },
  paidAmount: 0,
  remainingAmount: 0,
};

export type PaymentCalculation = { amount: number; quantity: number; total: number };

export const DEFAULT_CALCULATIONS: PaymentCalculation[] = [{ amount: 0, quantity: 0, total: 0 }];

export const OrderPaymentProvider = ({
  partialOrder,
  scope,
  stage,
  onOrderPaid,
  children,
  manualTotalAmount,
}: OrderPaymentProviderProps) => {
  const { order: contextOrder } = useOrderContext();
  const payingOrder = partialOrder || contextOrder;
  const orderTotal = roundToCents(
    manualTotalAmount ?? getOrderTotal({ order: payingOrder, applyDiscount: true })
  );

  const [activeTool, setActiveTool] = useState<"manual" | "table">("manual");
  const [payment, setPayment] = useState<Payment>({
    ...DEFAULT_PAYMENT,
    remainingAmount: roundToCents(orderTotal),
  });
  const [paymentCalculations, setPaymentCalculations] =
    useState<PaymentCalculation[]>(DEFAULT_CALCULATIONS);
  const [typedAmount, setTypedAmount] = useState<string>(
    roundToCents(payment.remainingAmount).toString()
  );

  const { handlePaymentChange, payOrder, resetPaymentValues } = useOrderPayment({
    scope,
    stage,
    onOrderPaid,
    payment,
    setPayment,
    payingOrder,
    manualTotalAmount,
  });

  useEffect(() => {
    setPayment({
      ...DEFAULT_PAYMENT,
      remainingAmount: roundToCents(orderTotal),
    });
    setTypedAmount(roundToCents(orderTotal).toString());
  }, [orderTotal]);

  const resetPayment = () => {
    resetPaymentValues();
    setTypedAmount(roundToCents(orderTotal).toString());
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
        order: payingOrder,
        orderTotal,
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
