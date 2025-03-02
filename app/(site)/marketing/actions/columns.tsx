import { MarketingTemplate } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const columns: ColumnDef<MarketingTemplate>[] = [
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

  // TableColumn({
  //   accessorKey: "update",
  //   header: "Modifica",
  //   cellContent: (row) => (
  //     <DialogWrapper
  //       trigger={<Button>Modifica</Button>}
  //       title="Modifica azione marketing"
  //       putSeparator
  //     >
  //       <div className="w-full space-y-2">
  //         <Label>Titolo</Label>
  //         <Input value={row.original.label} />
  //       </div>

  //       <div className="w-full space-y-2">
  //         <Label>Oggetto</Label>
  //         <Input value={row.original.subject} />
  //       </div>

  //       <div className="w-full space-y-2">
  //         <Label>Corpo</Label>
  //         <Textarea value={row.original.body || ""} />
  //       </div>
  //     </DialogWrapper>
  //   ),
  // }),
];

export default columns;
