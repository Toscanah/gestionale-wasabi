import EngagementReceipt, { EngagementReceiptProps } from "../../(domains)/printing/receipts/EngagementReceipt";
import KitchenReceipt, {
  KitchenReceiptProps,
} from "../../(domains)/printing/receipts/KitchenReceipt";
import OrderReceipt, { OrderReceiptProps } from "../../(domains)/printing/receipts/OrderReceipt";
import RiderReceipt, { RiderReceiptProps } from "../../(domains)/printing/receipts/RiderReceipt";
import print from "../../(domains)/printing/print";
import PaymentSummaryReceipt, { PaymentSummaryReceiptProps } from "../../(domains)/printing/receipts/PaymentSummaryReceipt";

export default function usePrinter() {
  async function printKitchen({ order }: KitchenReceiptProps) {
    await print(() => KitchenReceipt({ order }));
  }

  async function printOrder({ order, plannedPayment, putInfo, forceCut }: OrderReceiptProps) {
    await print(() => OrderReceipt({ order, plannedPayment, putInfo, forceCut }));
  }

  async function printRider({ order, plannedPayment }: RiderReceiptProps) {
    await print(() => RiderReceipt({ order, plannedPayment }));
  }

  async function printEngagements({ engagements }: EngagementReceiptProps) {
    await print(() => EngagementReceipt({ engagements }));
  }

  async function printPaymentSummary({ summaryData, period }: PaymentSummaryReceiptProps) {
    await print(() => PaymentSummaryReceipt({ summaryData, period }));
  }

  return {
    printKitchen,
    printOrder,
    printRider,
    printPaymentSummary,
    printEngagements,
  };
}
