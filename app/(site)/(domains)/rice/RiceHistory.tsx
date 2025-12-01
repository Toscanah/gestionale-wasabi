import { Button } from "@/components/ui/button";
import WasabiDialog from "../../components/ui/wasabi/WasabiDialog";
import { format, isToday } from "date-fns";
import formatRice from "../../lib/utils/domains/rice/formatRice";
import { RiceLogType } from "@/prisma/generated/client/enums";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/server/client";
import { RiceLog } from "../../lib/shared";

export default function RiceHistory() {
  const { data: logs = [], refetch } = trpc.rice.getLogs.useQuery();

  const todayLogs = logs.filter((log) => isToday(new Date(log.created_at)));

  const getAmount = (log: RiceLog) =>
    log.rice_batch_id ? (log.rice_batch ? log.rice_batch.amount : 0) : (log.manual_value ?? 0);

  const positiveLogs = todayLogs.filter((log) => getAmount(log) > 0 && log.type !== RiceLogType.RESET);
  const negativeLogs = todayLogs.filter((log) => getAmount(log) < 0 && log.type !== RiceLogType.RESET);
  const resetLogs = todayLogs.filter((log) => log.type === RiceLogType.RESET);

  const renderLog = (log: RiceLog) => (
    <li key={log.id}>
      {log.rice_batch_id ? (
        <span>
          <strong>{log.rice_batch?.label ?? ""}</strong>: {formatRice(log.rice_batch?.amount ?? 0)}
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
    <WasabiDialog
      putUpperBorder
      putSeparator
      trigger={<Button variant={"outline"}>Storico</Button>}
      title="Storico di oggi"
      size="medium"
      onOpenChange={(open) => {
        if (open) refetch();
      }}
    >
      {todayLogs.length > 0 ? (
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
    </WasabiDialog>
  );
}
