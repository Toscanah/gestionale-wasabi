import { Button } from "@/components/ui/button";
import DialogWrapper from "../components/dialog/DialogWrapper";
import { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import { RiceBatchLog } from "../models/base/Rice";
import fetchRequest from "../functions/api/fetchRequest";
import formatRice from "../functions/formatting-parsing/formatRice";

export default function RiceHistory() {
  const [logs, setLogs] = useState<RiceBatchLog[]>([]);

  const fetchLogs = () =>
    fetchRequest<RiceBatchLog[]>("GET", "/api/rice", "getRiceLogs").then((logs) =>
      setLogs(
        logs
          .filter((log) => isToday(new Date(log.created_at)))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      )
    );

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <DialogWrapper
      trigger={<Button variant={"outline"}>Storico</Button>}
      title="Storico di oggi"
      size="small"
      onOpenChange={() => fetchLogs()}
    >
      {logs.length > 0 ? (
        <ul className="text-xl space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <li key={log.id}>
              {log.rice_batch_id ? (
                <span>
                  <strong>{log.rice_batch.label}</strong>: {formatRice(log.rice_batch.amount)}
                </span>
              ) : (
                <span>
                  <strong>Manuale</strong>: {formatRice(log.value ?? 0)}
                </span>
              )}
              <span className="ml-2 text-gray-500">
                ({format(new Date(log.created_at), "HH:mm:ss")})
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="w-full text-center text-xl">Nessuno storico presente per oggi</div>
      )}
    </DialogWrapper>
  );
}
