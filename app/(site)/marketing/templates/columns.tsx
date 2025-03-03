import { MarketingTemplate } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import UpdateMarketingTemplate from "./UpdateMarketingTemplate";

export default function columns(
  onUpdatedMarketing: (marketing: MarketingTemplate | null) => void
): ColumnDef<MarketingTemplate>[] {
  return [
    TableColumn({
      accessorKey: "index",
      header: "#",
      isRowIndex: true,
    }),

    TableColumn({
      accessorKey: "label",
      header: "Titolo",
    }),

    TableColumn({
      accessorKey: "subject",
      header: "Oggetto",
    }),

    TableColumn({
      accessorKey: "body",
      header: "Corpo",
    }),

    TableColumn({
      header: "Modifica",
      cellContent: (row) => (
        <UpdateMarketingTemplate
          marketingTemplate={row.original}
          onUpdatedMarketing={onUpdatedMarketing}
        />
      ),
    }),
  ];
}
