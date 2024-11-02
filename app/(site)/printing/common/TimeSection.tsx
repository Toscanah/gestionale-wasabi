import { Row, Text } from "react-thermal-printer";

export default function TimeSection() {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("it-IT", options);

  return (
    <Row
      left={<Text>{formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}</Text>}
      right={<Text>{currentDate.toLocaleTimeString("it-IT")}</Text>}
    />
  );
}
