import { Br, Text } from "react-thermal-printer";
import TimeSection from "./TimeSection";
import getReceiptSize from "../../util/functions/getReceiptSize";

export default function HeaderSection() {
  const bigSize = getReceiptSize(2, 2);
  const smallSize = getReceiptSize(1, 1);

  return (
    <>
      <Text size={bigSize} bold align="center">
        WASABI SUSHI
      </Text>
      <Br />
      <Text size={smallSize} bold align="center">
        34135 TRIESTE
      </Text>
      <Text size={smallSize} bold align="center">
        SCALA AL BELVEDERE 2/B
      </Text>
      <Text size={smallSize} bold align="center">
        Tel: 040 4702081
      </Text>
      <Text size={smallSize} bold align="center">
        Cell: 338 1278651
      </Text>
      <Text size={smallSize} align="center">
        P.iva 01152790323
      </Text>
      <Br />

      {TimeSection()}
    </>
  );
}
