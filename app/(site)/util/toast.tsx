import { ReactNode } from "react";
import { toast } from "sonner";

export function toastError(message: ReactNode | string, title: ReactNode | string = "Errore") {
  toast.error(title, { description: message });
}

export function toastSuccess(message: ReactNode | string, title: ReactNode | string = "Successo") {
  toast.success(title, { description: message });
}
