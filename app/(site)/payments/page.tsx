import getAllPayments from "../sql/payments/getAllPayments";
import PaymentsTable from "./PaymentsTable";

export default async function PaymentDashboard() {
  return <PaymentsTable payments={await getAllPayments()} />;
}
