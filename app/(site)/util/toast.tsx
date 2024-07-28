import { toast } from "sonner";

export function toastError(
  message: string,
  title: string = "Errore"
) {
  toast.error(title, { description: message });
}

export function toastSuccess(message: string, title: string = "Successo") {
  toast.success(title, { description: message });
}
