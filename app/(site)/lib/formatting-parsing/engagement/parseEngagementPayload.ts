import { Engagement, EngagementType } from "@prisma/client";

export default function parseEngagementPayload(engagement: Engagement) {
  const { type, payload } = engagement;
return {}

  switch (type) {
    case EngagementType.QR_CODE:
  }
 
}