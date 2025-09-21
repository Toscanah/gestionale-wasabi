"use client";

import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { AppRouter } from "./core";
import { QueryClient } from "@tanstack/react-query";
import SuperJSON from "superjson";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

// singleton trpc client
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: SuperJSON,
    }),
  ],
});
