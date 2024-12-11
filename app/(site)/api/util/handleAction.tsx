import { NextResponse } from "next/server";
import contentValidator from "./contentValidator";

export default async function handleAction(
  actionMap: Record<string, (content: any) => Promise<any>>,
  action: string,
  content: any
) {
  if (!(action in actionMap)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const actionHandler = actionMap[action];
  if (!actionHandler) {
    return NextResponse.json({ error: "Action not implemented" }, { status: 400 });
  }

  if (!contentValidator(actionHandler, content)) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  try {
    const result = await actionHandler(content);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
