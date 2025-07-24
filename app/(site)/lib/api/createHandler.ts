import { NextRequest } from "next/server";
import handleRequest, { ActionsMap } from "./handleRequest";
import { HTTPMethod } from "./fetchRequest";

export type ActionsMapRecord = Partial<Record<HTTPMethod, ActionsMap>>;

export function createHandler(actionsMap: ActionsMapRecord) {
  return async function handler(request: NextRequest) {
    const method = request.method as HTTPMethod;
    const actions = actionsMap[method];

    if (!actions) {
      return new Response(`Method ${method} not supported for this endpoint.`, { status: 405 });
    }

    return await handleRequest(request, method, actions);
  };
}
