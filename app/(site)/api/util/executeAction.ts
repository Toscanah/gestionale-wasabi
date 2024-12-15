import { NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { ActionEntry, ActionsMap } from "./handleRequest";

export default async function executeAction(
  actionEntry: ActionEntry | undefined,
  action: string,
  content: unknown
): Promise<NextResponse> {
  if (!actionEntry) {
    return NextResponse.json(
      {
        message: `Action "${action}" not found.`,
        error: "The requested action does not exist in the server.",
      },
      { status: 404 }
    );
  }

  const { func, schema } = actionEntry;

  try {
    const parsedContent = schema.safeParse(content);

    if (!parsedContent.success) {
      console.log(content)
      return NextResponse.json(
        {
          message: `Content validation failed in action "${action}"`,
          error: "Invalid input format.",
          details: parsedContent.error.toString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(await func(...(content ? Object.values(content as any) : [])), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Action execution failed.",
        error: error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
