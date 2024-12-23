import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PaymentType, OrderType } from "@prisma/client";
import { OrderWithPayments } from "@/app/(site)/models";
import print from "../../printing/print";
import PaymentSummaryReceipt from "../../printing/receipts/PaymentSummaryReceipt";

type PaymentTotals = {
  [key in PaymentType]: { label: string; total: number };
};

interface PrintSummaryProps {
  orders: OrderWithPayments[];
}

export interface SummaryData {
  totals: PaymentTotals;
  inPlaceAmount: number;
  takeawayAmount: number;
  tableOrdersAmount: number;
  homeOrdersAmount: number;
  pickupOrdersAmount: number;
  customersCount: number;
  totalAmount: number;
}

export default function PrintSummary({ orders }: PrintSummaryProps) {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totals: {
      [PaymentType.CASH]: { label: "Contanti", total: 0 },
      [PaymentType.CARD]: { label: "Carta", total: 0 },
      [PaymentType.VOUCH]: { label: "Buoni", total: 0 },
      [PaymentType.CREDIT]: { label: "Crediti", total: 0 },
    },
    inPlaceAmount: 0,
    takeawayAmount: 0,
    tableOrdersAmount: 0,
    homeOrdersAmount: 0,
    pickupOrdersAmount: 0,
    customersCount: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    calculateSummaryData(orders);
  }, [orders]);

  const calculateSummaryData = (orders: OrderWithPayments[]) => {
    // Reset totals before recalculating
    const newTotals: PaymentTotals = {
      [PaymentType.CASH]: { label: "Contanti", total: 0 },
      [PaymentType.CARD]: { label: "Carta", total: 0 },
      [PaymentType.VOUCH]: { label: "Buoni", total: 0 },
      [PaymentType.CREDIT]: { label: "Crediti", total: 0 },
    };

    let inPlaceAmount = 0;
    let takeawayAmount = 0;
    let homeOrdersAmount = 0;
    let pickupOrdersAmount = 0;
    let tableOrdersAmount = 0;
    let customersCount = 0;
    let totalAmount = 0;

    orders.forEach((order) => {
      order.payments.forEach((payment) => {
        newTotals[payment.type].total += payment.amount;
        totalAmount += payment.amount;
      });

      if (order.type === OrderType.TABLE) {
        inPlaceAmount += order.total;
        tableOrdersAmount += order.total;
        customersCount += order.table_order?.people || 1;
      } else if (order.type === OrderType.HOME) {
        takeawayAmount += order.total;
        homeOrdersAmount += order.total;
      } else if (order.type === OrderType.PICKUP) {
        takeawayAmount += order.total;
        pickupOrdersAmount += order.total;
      }
    });

    setSummaryData({
      totals: newTotals,
      inPlaceAmount,
      takeawayAmount,
      homeOrdersAmount,
      pickupOrdersAmount,
      tableOrdersAmount,
      customersCount,
      totalAmount,
    });
  };

  const isButtonDisabled = Object.values(summaryData.totals).every(({ total }) => total === 0);

  return (
    <Button
      className="mt-auto"
      onClick={async () => await print(() => PaymentSummaryReceipt({ summaryData }))}
      disabled={isButtonDisabled}
    >
      Stampa riassunto
    </Button>
  );
}
