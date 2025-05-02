import { Engagement, EngagementType } from "@prisma/client";
import getReceiptSize from "../../lib/formatting-parsing/printing/getReceiptSize";
import { CommonPayload, FinalImagePayload, MessagePayload, QrPayload } from "../../shared";
import { Image, Line, QRCode, Text } from "react-thermal-printer";
import { Fragment } from "react";

interface EngagementSectionProps {
  activeEngagements: Engagement[];
}

export default function EngagementSection({ activeEngagements }: EngagementSectionProps) {
  const smallSize = getReceiptSize(1, 1);
  const bigSize = getReceiptSize(2, 2);

  return (
    <>
      <Line />
      {activeEngagements.map((engagement, index) => (
        <Fragment key={index}>
          <Text align="center" size={smallSize} bold>
            {(engagement.payload as CommonPayload).textAbove}
          </Text>

          {engagement.type === EngagementType.MESSAGE ? (
            <Text align="center" size={bigSize} bold>
              {(engagement.payload as MessagePayload).message}
            </Text>
          ) : engagement.type === EngagementType.QR_CODE ? (
            <QRCode align="center" content={(engagement.payload as QrPayload).url} />
          ) : (
            <Image align="center" src={(engagement.payload as FinalImagePayload).imageUrl} />
          )}

          <Text align="center" size={smallSize} bold>
            {(engagement.payload as CommonPayload).textBelow}
          </Text>
        </Fragment>
      ))}
    </>
  );
}
