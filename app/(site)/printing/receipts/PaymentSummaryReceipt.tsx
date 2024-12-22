import { useState, useEffect } from "react";
import { Br, Cut, Line, Row, Text } from "react-thermal-printer";
import { SummaryData } from "../../payments/table/PrintSummary";
import formatAmount from "../../util/functions/formatAmount";
import getReceiptSize from "../../util/functions/getReceiptSize";

interface PaymentSummaryReceiptProps {
  summaryData: SummaryData;
}

export default function PaymentSummaryReceipt({ summaryData }: PaymentSummaryReceiptProps) {
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);

  const smallSize = getReceiptSize(1, 1);
  const bigSize = getReceiptSize(2, 2);

  return (
    <>
      <Text inline>Recapito del giorno</Text>
      <Text bold> {formattedDate}</Text>

      <Br />
      <Line />
      <Br />
      {Object.entries(summaryData.totals).map(([label, data]) => (
        <Row
          key={label}
          left={
            <Text bold size={bigSize}>
              {data.label}
            </Text>
          }
          right={
            <Text bold size={bigSize}>
              {formatAmount(data.total)} €
            </Text>
          }
        />
      ))}
      <Br />
      <Line />
      <Br />
      <Row
        left={
          <Text bold size={smallSize}>
            Totale in loco
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {formatAmount(summaryData.inPlaceAmount)} €
          </Text>
        }
      />
      <Row
        left={
          <Text bold size={smallSize}>
            Totale domicilio + asporto
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {formatAmount(summaryData.takeawayAmount)} €
          </Text>
        }
      />
      <Row
        left={
          <Text bold size={smallSize}>
            Totale domicilio
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {summaryData.homeOrdersAmount.toString()} €
          </Text>
        }
      />
      <Row
        left={
          <Text bold size={smallSize}>
            Totale asporto
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {summaryData.pickupOrdersAmount.toString()} €
          </Text>
        }
      />
      <Row
        left={
          <Text bold size={smallSize}>
            Totale tavoli
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {summaryData.tableOrdersAmount.toString()} €
          </Text>
        }
      />
      <Row
        left={
          <Text bold size={smallSize}>
            Clienti totali
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {summaryData.customersCount.toString()}
          </Text>
        }
      />
      <Br />
      <Line />
      <Br />
      <Row
        left={
          <Text bold size={bigSize}>
            Totale
          </Text>
        }
        right={
          <Text bold size={bigSize}>
            {formatAmount(summaryData.totalAmount)} €
          </Text>
        }
      />

      <Cut />
    </>
  );
}
