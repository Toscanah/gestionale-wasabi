export default function toEuro(amount: number): string {
  return amount.toLocaleString("it-IT", { style: "currency", currency: "EUR" }).replace(",", "."); // replaces decimal comma with dot
}
