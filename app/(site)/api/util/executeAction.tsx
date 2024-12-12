import { NextResponse } from "next/server";
import { ZodSchema } from "zod";

type ActionEntry = {
  func: (...content: any[]) => Promise<any>;
  schema: ZodSchema<any>;
};

type ActionsMap = Map<string, ActionEntry>;

export default async function executeAction(
  actionsMap: ActionsMap,
  action: string,
  content: unknown
): Promise<NextResponse> {
  const actionEntry = actionsMap.get(action);

  if (!actionEntry) {
    return new NextResponse(`Action "${action}" not found`, { status: 403 });
  }

  const { func, schema } = actionEntry;

  try {
    const parsedContent = schema.safeParse(content);

    console.log(content);

    if (!parsedContent.success) {
      return NextResponse.json(parsedContent.error);

      return NextResponse.json(`Content "${content}" did not pass the type guard`, {
        status: 401,
      });
    }

    return NextResponse.json(await func(...Object.values(content as any)));
  } catch (error) {
    console.log("Qua?");
    return new NextResponse(
      `Invalid content: ${error instanceof Error ? error.message : String(error)}`,
      { status: 402 }
    );
  }
}
