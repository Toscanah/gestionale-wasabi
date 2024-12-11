import { ReactNode } from "react";
import { toast } from "sonner";

export function toastError(message: ReactNode, title: ReactNode = "Errore") {
  toast.error(title, { description: message });
}

export function toastSuccess(message: ReactNode, title: ReactNode = "Successo") {
  toast.success(title, { description: message });
}
