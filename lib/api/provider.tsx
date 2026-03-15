"use client";

import { queryClient, trpc, trpcClient } from "./client";
import { ReactNode } from "react";

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}
