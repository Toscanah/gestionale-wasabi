import { Row, Text } from "react-thermal-printer";

export default function time() {
  return (
    <Row
      left={<Text>{new Date().toLocaleDateString("it-IT")}</Text>}
      right={<Text>{new Date().toLocaleTimeString("it-IT")}</Text>}
    />
  );
}
