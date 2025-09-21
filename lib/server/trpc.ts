import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { performance } from "perf_hooks";

export const createContext = async () => {
  return {};
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: SuperJSON,
});

const loggerMiddleware = t.middleware(async ({ path, type, getRawInput, next }) => {
  const input = await getRawInput();
  const start = performance.now();

  const result = await next();
  const ms = Math.round(performance.now() - start);

  let inputStr = "";
  if (input && Object.keys(input).length > 0) {
    let str = JSON.stringify(input);
    if (str.length > 250) str = str.slice(0, 250) + "...";
    // Yellow for input
    inputStr = ` \x1b[33minput:\x1b[0m ${str}`;
  }

  // Green for success, red for error, cyan for timing
  const timeStr = `(${ms}ms, ${(ms / 1000).toFixed(2)}s)`;

  if (result.ok) {
    console.log(
      `[tRPC] \x1b[42;30m SUC \x1b[0m \x1b[36m${type.toUpperCase()}\x1b[0m \x1b[1m${path}\x1b[0m \x1b[36m${timeStr}\x1b[0m${inputStr}`
    );
    return result;
  }

  // result.error is a TRPCError
  const err = result.error;
  console.error(
    `[tRPC] \x1b[41;37m ERR \x1b[0m \x1b[36m${type.toUpperCase()}\x1b[0m \x1b[1m${path}\x1b[0m \x1b[36m${timeStr}\x1b[0m${inputStr}`,
    {
      code: err.code,
      cause: err.cause,
    }
  );

  return result;
});

// export these as your building blocks
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure.use(loggerMiddleware);
