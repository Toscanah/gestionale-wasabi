import { z } from "zod";
import { optionSchemas } from "../../api/options/route";
import { orderSchemas } from "../../api/orders/route";
import { paymentSchemas } from "../../api/payments/route";
import { productSchemas } from "../../api/products/route";
import { riceSchemas } from "../../api/rice/route";
import { marketingSchemas } from "../../api/marketing/route";
import { ADDRESS_SCHEMAS, CUSTOMER_SCHEMAS, CATEGORY_SCHEMAS, ENGAGEMENT_SCHEMAS } from "@shared";

export type HTTPMethod = "POST" | "GET" | "DELETE" | "PATCH";

export type APIEndpoint =
  | "addresses"
  | "categories"
  | "customers"
  | "options"
  | "orders"
  | "payments"
  | "products"
  | "rice"
  | "marketing"
  | "engagements";

const schemas = {
  ...ADDRESS_SCHEMAS,
  ...CATEGORY_SCHEMAS,
  ...CUSTOMER_SCHEMAS,
  ...optionSchemas,
  ...orderSchemas,
  ...paymentSchemas,
  ...productSchemas,
  ...riceSchemas,
  ...marketingSchemas,
  ...ENGAGEMENT_SCHEMAS,
};

export type ValidActionKeys = keyof typeof schemas;
export type PathType = `/api/${APIEndpoint}/` | `/api/${APIEndpoint}`;

type ContentType = z.infer<(typeof schemas)[ValidActionKeys]>;
type ExcludeEmptyObject<T> = T extends {} ? (keyof T extends never ? never : T) : T;
type NonEmptyContentType = ExcludeEmptyObject<ContentType>;

export default async function fetchRequest<ReturnType>(
  method: HTTPMethod,
  path: PathType,
  action: ValidActionKeys,
  content?: NonEmptyContentType
): Promise<ReturnType> {
  let url: URL;
  let requestOptions: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    switch (method) {
      case "GET":
        url = new URL(path, window.location.origin);
        url.searchParams.append("action", action);

        if (content) {
          Object.keys(content).forEach((key) => {
            url.searchParams.append(key, (content as any)[key]);
          });
        }
        break;

      case "PATCH":
      case "POST":
      case "DELETE":
        url = new URL(path, window.location.origin);
        requestOptions.body = JSON.stringify({
          action,
          content: content == undefined ? {} : content,
        });
        break;

      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    const response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      const errorBody = await response.json();

      const errorMessage = errorBody.message || "An error occurred";
      const errorDetails = errorBody.details || "No further details available";
      const errorError = errorBody.error || "Unknown error";

      throw new Error(
        `HTTP Error: Status ${response.status}\nMessage: ${errorMessage}\nError: ${errorError}\nDetails: ${errorDetails}`
      );
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(`Fetch request failed: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred during fetch.");
    }
  }
}
