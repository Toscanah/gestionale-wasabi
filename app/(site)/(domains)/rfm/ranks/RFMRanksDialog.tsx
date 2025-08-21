import DialogWrapper from "@/app/(site)/components/ui/dialog/DialogWrapper";
import useRfmRanks from "@/app/(site)/hooks/rfm/useRfmRanks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import RFMRankForm from "./RFMRankForm";
import { RFMRankRule } from "@/app/(site)/lib/shared/types/RFM";
import { useState } from "react";
import { DEFAULT_RANK_RULE } from "@/app/(site)/hooks/rfm/config";
import { Trash } from "@phosphor-icons/react";
import { toastError, toastSuccess } from "@/app/(site)/lib/utils/global/toast";

export default function RFMRanksDialog() {
  const { ranks, updateRankRule, addRankRule, removeRankRule, resetRanks } = useRfmRanks();
  const [newRank, setNewRank] = useState<RFMRankRule>({ rank: "", ...DEFAULT_RANK_RULE });

  return (
    <DialogWrapper
      title="Rank RFM"
      putSeparator
      putUpperBorder
      trigger={<SidebarMenuSubButton className="hover:cursor-pointer">Rank</SidebarMenuSubButton>}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem key="create" value="create">
          <AccordionTrigger className="flex items-center">
            <span>Crea nuovo rank</span>
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-4 text-balance">
            <RFMRankForm
              rank={newRank}
              onChange={(updated) => setNewRank((prev) => ({ ...prev, ...updated }))}
            />
            <Button
              className="w-full"
              onClick={() => {
                if (ranks.find((r) => r.rank === newRank.rank) === undefined) {
                  addRankRule(newRank);
                  setNewRank({ rank: "", ...DEFAULT_RANK_RULE });
                  toastSuccess("Rank creato con successo");
                } else {
                  toastError("Rank già esistente. Utilizza un altro nome");
                }
              }}
            >
              Crea
            </Button>
          </AccordionContent>
        </AccordionItem>

        {ranks.map((rank, i) => (
          <div className="w-full flex gap-4 items-center">
            <AccordionItem key={rank.rank} value={rank.rank} className="w-full">
              <AccordionTrigger className="flex items-center">
                <span>
                  {i + 1} - {rank.rank}
                </span>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-4 text-balance">
                <RFMRankForm rank={rank} onChange={(updated) => updateRankRule(i, updated)} />
              </AccordionContent>
            </AccordionItem>

            <Button variant="destructive" size="icon">
              <Trash className="" onClick={() => removeRankRule(i)} size={24} />
            </Button>
          </div>
        ))}
      </Accordion>
    </DialogWrapper>
  );
}
