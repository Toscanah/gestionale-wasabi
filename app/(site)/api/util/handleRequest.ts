import { NextRequest } from "next/server";
import executeAction from "./executeAction";
import { ZodSchema } from "zod";
import { HTTPMethod } from "../../functions/api/fetchRequest";

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
  const fieldsThatShouldRemainString = ["phone", "tableToJoin"];

  const params = request.nextUrl.searchParams;
  const action = params.get("action") ?? "";

  const content = Object.fromEntries(
    Array.from(params.entries())
      .map(([key, value]) => {
        if (fieldsThatShouldRemainString.includes(key)) {
          return [key, value];
        }

        const parsedValue = parseInt(value, 10);

        if (!isNaN(parsedValue)) {
          return [key, parsedValue];
        }

        return [key, value];
      })
      .filter(([key]) => key !== "action")
  );

  return { action, content };
}

async function handleBodyRequest(request: NextRequest) {
  return await request.json();
}
