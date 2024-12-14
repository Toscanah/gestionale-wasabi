import { NextRequest } from "next/server";
import executeAction from "./executeAction";
import { ZodSchema } from "zod";
import { HTTPMethod } from "../../util/functions/fetchRequest";

export type ActionEntry = {
  func: (...content: any[]) => Promise<any>;
  schema: ZodSchema<any>;
};

export type ActionsMap = Map<string, ActionEntry>;

export default async function handleRequest(
  request: NextRequest,
  method: HTTPMethod,
  actionsMap: ActionsMap
) {
  const { action, content } =
    method === "GET" ? await handleGetRequest(request) : await handleBodyRequest(request);

  return executeAction(actionsMap.get(action), action, content);
}

async function handleGetRequest(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const action = params.get("action") ?? "";
  const content = Object.fromEntries(
    Array.from(params.entries()).filter(([key]) => key !== "action")
  );
  return { action, content };
}

async function handleBodyRequest(request: NextRequest) {
  return await request.json();
}
