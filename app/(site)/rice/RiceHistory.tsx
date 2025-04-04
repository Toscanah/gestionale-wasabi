import { Button } from "@/components/ui/button";
import DialogWrapper from "../components/dialog/DialogWrapper";
import { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import { RiceLog } from "../models/base/Rice";
import fetchRequest from "../functions/api/fetchRequest";
import formatRice from "../functions/formatting-parsing/formatRice";
import { RiceLogType } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

export default function RiceHistory() {
  const [logs, setLogs] = useState<RiceLog[]>([]);

  const fetchLogs = () =>
    fetchRequest<RiceLog[]>("GET", "/api/rice", "getRiceLogs").then((logs) =>
      setLogs(
        logs
          .filter((log) => isToday(new Date(log.created_at)))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      )
    );

  useEffect(() => {
    fetchLogs();
  }, []);

  const getAmount = (log: RiceLog) =>
    log.rice_batch_id ? log.rice_batch.amount : log.manual_value ?? 0;

  const positiveLogs = logs.filter((log) => getAmount(log) > 0 && log.type !== RiceLogType.RESET);
  const negativeLogs = logs.filter((log) => getAmount(log) < 0 && log.type !== RiceLogType.RESET);
  const resetLogs = logs.filter((log) => log.type === RiceLogType.RESET);

  const renderLog = (log: RiceLog) => (
    <li key={log.id}>
      {log.rice_batch_id ? (
        <span>
          <strong>{log.rice_batch.label}</strong>: {formatRice(log.rice_batch.amount)}
        </span>
      ) : (
        <span>
          <strong>Manuale</strong>: {formatRice(log.manual_value ?? 0)}
        </span>
      )}
      <span className="ml-2 text-gray-500">({format(new Date(log.created_at), "HH:mm:ss")})</span>
    </li>
  );

  return (
    <DialogWrapper
      trigger={<Button variant={"outline"}>Storico</Button>}
      title="Storico di oggi"
      size="medium"
      onOpenChange={fetchLogs}
    >
      {logs.length > 0 ? (
        <>
          <div className="flex gap-4 max-h-80 overflow-y-auto">
            <div className="flex-1">
              <ul className="space-y-2 text-xl">
                {positiveLogs.length > 0 ? (
                  positiveLogs.map(renderLog)
                ) : (
                  <li className="text-gray-500">Nessuna aggiunta</li>
                )}
              </ul>
            </div>

            <div className="flex-1">
              <ul className="space-y-2 text-xl">
                {negativeLogs.length > 0 ? (
                  negativeLogs.map(renderLog)
                ) : (
                  <li className="text-gray-500">Nessuna rimozione</li>
                )}
              </ul>
            </div>
          </div>

          {resetLogs.length > 0 && (
            <>
              <Separator />
              <ul className="space-y-2 text-xl">
                {resetLogs.map((log) => (
                  <li key={log.id}>
                    <span className="text-red-600 font-semibold">
                      Reset di sistema: {formatRice(getAmount(log))}
                    </span>
                    <span className="ml-2 text-gray-500">
                      ({format(new Date(log.created_at), "HH:mm:ss")})
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <div className="w-full text-center text-xl">Nessuno storico presente per oggi</div>
      )}
    </DialogWrapper>
  );
}
