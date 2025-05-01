import { Engagement, EngagementType } from "@prisma/client";
import getReceiptSize from "../../lib/formatting-parsing/printing/getReceiptSize";
import { AnyOrder, CommonPayload, MessagePayload } from "../../shared";
import { Line, Text } from "react-thermal-printer";

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
        <>
          <Text align="center" size={smallSize} key={"above-" + index} bold>
            {(engagement.payload as CommonPayload).textAbove}
          </Text>

          {engagement.type == EngagementType.MESSAGE ? (
            <Text align="center" size={bigSize}>
              {(engagement.payload as MessagePayload).message}
            </Text>
          ) : (
            <></>
          )}

          <Text align="center" size={smallSize} key={"below-" + index} bold>
            {(engagement.payload as CommonPayload).textBelow}
          </Text>
        </>
      ))}
    </>
  );
}
