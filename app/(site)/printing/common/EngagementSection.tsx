import { Engagement, EngagementType } from "@prisma/client";
import getReceiptSize from "../../lib/formatting-parsing/printing/getReceiptSize";
import {
  CommonPayload,
  EngagementWithDetails,
  ImagePayload,
  MessagePayload,
  QrPayload,
} from "../../shared";
import { Br, Image, Line, QRCode, Text } from "react-thermal-printer";
import { Fragment } from "react";

interface EngagementSectionProps {
  activeEngagements: EngagementWithDetails[];
}

export default function EngagementSection({ activeEngagements }: EngagementSectionProps) {
  const smallSize = getReceiptSize(1, 1);
  const bigSize = getReceiptSize(2, 2);

  return (
    <>
      {/* <Line /> */}
      {activeEngagements.map((engagement, index) => (
        <Fragment key={index}>
          {(engagement.template.payload as CommonPayload).textAbove && (
            <>
              <Text align="center" size={smallSize} bold>
                {(engagement.template.payload as CommonPayload).textAbove}
              </Text>
              <Br />
            </>
          )}

          {engagement.template.type === EngagementType.MESSAGE ? (
            <Text align="center" size={bigSize} bold>
              {(engagement.template.payload as MessagePayload).message}
            </Text>
          ) : engagement.template.type === EngagementType.QR_CODE ? (
            <QRCode
              align="center"
              content={(engagement.template.payload as QrPayload).url}
              cellSize={6}
            />
          ) : (
            <Image
              align="center"
              src={(engagement.template.payload as ImagePayload).imageUrl}
            />
          )}

          <Br />

          {(engagement.template.payload as CommonPayload).textBelow && (
            <>
              <Text align="center" size={smallSize} bold>
                {(engagement.template.payload as CommonPayload).textBelow}
              </Text>
              <Br />
            </>
          )}
        </Fragment>
      ))}
    </>
  );
}
