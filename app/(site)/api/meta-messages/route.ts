import { NextRequest } from "next/server";
import handleRequest, { ActionsMap } from "../../lib/api/handleRequest";

const POST_ACTIONS: ActionsMap = new Map([]);

const PATCH_ACTIONS: ActionsMap = new Map([]);

const GET_ACTIONS: ActionsMap = new Map([]);

const DELETE_ACTIONS: ActionsMap = new Map([]);

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function PATCH(request: NextRequest) {
  return await handleRequest(request, "PATCH", PATCH_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}

export async function DELETE(request: NextRequest) {
  return await handleRequest(request, "DELETE", DELETE_ACTIONS);
}
