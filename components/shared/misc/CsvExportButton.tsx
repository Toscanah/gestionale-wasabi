import { Button } from "@/components/ui/button";
import { DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr";

interface CsvExportButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export default function CsvExportButton({ onClick, className, disabled }: CsvExportButtonProps) {
  return (
    <Button onClick={onClick} variant={"outline"} className={className} disabled={disabled}>
      <DownloadSimpleIcon /> Esporta
    </Button>
  );
}
