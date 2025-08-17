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


export default function RFMRanksDialog() {
  const { ranks, updateRankRule, addRankRule, removeRankRule, resetRanks } = useRfmRanks();

  return (
    <DialogWrapper
      title="Rank"
      trigger={<SidebarMenuSubButton className="hover:cursor-pointer">Rank</SidebarMenuSubButton>}
    >
      <Accordion type="single" collapsible className="w-full">
        {ranks.map((rank) => (
          <AccordionItem key={rank.rank} value={rank.rank}>
            <AccordionTrigger className="flex items-center">
              <span>{rank.rank}</span>
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-4 text-balance"></AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </DialogWrapper>
  );
}
