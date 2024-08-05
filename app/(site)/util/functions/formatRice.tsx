export default function formatRice(rice: number) {
  const absoluteRice = Math.abs(rice);
  const sign = rice < 0 ? "-" : "";

  if (absoluteRice >= 1000) {
    const kg = absoluteRice / 1000;
    return `${sign}${parseFloat(kg.toFixed(3))}kg`;
  } else {
    return `${sign}${absoluteRice}g`;
  }
}
