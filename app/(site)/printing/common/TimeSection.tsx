import { Row, Text } from "react-thermal-printer";
import capitalizeFirstLetter from "../../functions/formatting-parsing/capitalizeFirstLetter";

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
      left={<Text>{capitalizeFirstLetter(formattedDate)}</Text>}
      right={<Text>{currentDate.toLocaleTimeString("it-IT")}</Text>}
    />
  );
}
