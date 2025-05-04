import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { EngagementTemplate, EngagementType } from "@prisma/client";
import { useEffect, useState } from "react";

export default function useMarketingTemplates() {
  const [templates, setTemplates] = useState<EngagementTemplate[]>([]);
  const [choice, setChoice] = useState<EngagementType>(EngagementType.QR_CODE);

  const fetchTemplates = () =>
    fetchRequest<EngagementTemplate[]>("GET", "/api/engagements", "getEngagementTemplates").then(
      setTemplates
    );

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates };
}
