import { EngagementType } from "@prisma/client";
import { useState } from "react";
import fetchRequest from "../lib/api/fetchRequest";

export default function useEngagement(customerId: number) {
  const [choice, setChoice] = useState<EngagementType>(EngagementType.QR_CODE);
  const [textAbove, setTextAbove] = useState<string>("");
  const [textBelow, setTextBelow] = useState<string>("");

  const fetchEngagementsByCustomer = () => fetchRequest("GET", "/api/engagements/", "fetchEngagementsByCustomer", { customerId });

  const createEngagement = () => {
    
  }

  return {
    choice,
    setChoice,
    textAbove,
    setTextAbove,
    textBelow,
    setTextBelow,
  };
}
