import { Br, Cut, Image, Line, Row, Text } from "react-thermal-printer";
import time from "./time";

export default function header() {
  return (
    <>
      <Text size={{ width: 2, height: 2 }} bold align="center">
        WASABI SUSHI
      </Text>
      <Br />
      <Text size={{ width: 1, height: 1 }} bold align="center">
        34135 TRIESTE
      </Text>
      <Text size={{ width: 1, height: 1 }} bold align="center">
        SCALA AL BELVEDERE 2/B
      </Text>
      <Text size={{ width: 1, height: 1 }} bold align="center">
        Tel: 040 4702081
      </Text>
      <Text size={{ width: 1, height: 1 }} bold align="center">
        Cell: 338 1278651
      </Text>
      <Text size={{ width: 1, height: 1 }} align="center">
        P.iva 01152790323
      </Text>
      <Br />

      {time()}
    </>
  );
}