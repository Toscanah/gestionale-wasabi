import { NextResponse } from "next/server";
import { ActionEntry } from "./handleRequest";

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
      console.log(
        "Action:", action,
        "\nContent:", JSON.stringify(content, null, 2),
        "\nValidation Error:", JSON.stringify(parsedContent.error, null, 2)
      );
      return NextResponse.json(
        {
          message: `Content validation failed in action "${action}"`,
          error: "Invalid input format.",
          details: parsedContent.error.toString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(await func(parsedContent.data), { status: 200 });
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
