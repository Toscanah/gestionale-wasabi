import { EngagementWithDetails } from "@/app/(site)/lib/shared";
import { Fragment } from "react";
import SingleEngagement from "../common/SingleEngagement";

export interface EngagementReceiptProps {
  engagements: EngagementWithDetails[];
}

export default function EngagementReceipt({ engagements }: EngagementReceiptProps) {
  const activeEngagements = engagements.filter((e) => e.enabled);

  return (
    <>
      {activeEngagements.map((engagement, index) => (
        <Fragment key={index}>
          <SingleEngagement engagement={engagement} />
        </Fragment>
      ))}
    </>
  );
}
