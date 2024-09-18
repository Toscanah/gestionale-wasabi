import getOrderWithPayments from "../../sql/payments/getOrderWithPayments";
import PaymentsTable from "./PaymentsTable";

export default async function PaymentDashboard() {
  return <PaymentsTable fetchedOrders={await getOrderWithPayments()} />;
}
