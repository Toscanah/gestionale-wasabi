export default function toEuro(amount: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false, // 🚫 no thousands separators
  })
    .format(amount)
    .replace(",", "."); // ✅ convert decimal comma to dot
}
