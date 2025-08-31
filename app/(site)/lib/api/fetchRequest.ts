import { z } from "zod";
import {
  ADDRESS_REQUESTS,
  CUSTOMER_REQUESTS,
  CATEGORY_REQUESTS,
  ENGAGEMENT_REQUESTS,
  RICE_REQUESTS,
  PRODUCT_REQUESTS,
  PAYMENT_REQUESTS,
  ORDER_REQUESTS,
  OPTION_REQUESTS,
  META_REQUESTS,
} from "@/app/(site)/lib/shared";

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
  | "engagements"
  | "meta";

const schemas = {
  ...ORDER_REQUESTS,
  ...PRODUCT_REQUESTS,
  ...CUSTOMER_REQUESTS,
  ...ADDRESS_REQUESTS,
  ...CATEGORY_REQUESTS,
  ...RICE_REQUESTS,
  ...PAYMENT_REQUESTS,
  ...OPTION_REQUESTS,
  ...ENGAGEMENT_REQUESTS,
  ...META_REQUESTS,
};

export type ValidActionKeys = keyof typeof schemas;
export type PathType = `/api/${APIEndpoint}/` | `/api/${APIEndpoint}`;

type ContentType = z.infer<(typeof schemas)[ValidActionKeys]>;
type ExcludeEmptyObject<T> = T extends {} ? (keyof T extends never ? never : T) : T;
type NonEmptyContentType = ExcludeEmptyObject<ContentType>;

export default async function fetchRequest<R>(
  method: HTTPMethod,
  path: PathType,
  action: ValidActionKeys,
  content?: NonEmptyContentType
): Promise<R> {
  const url = new URL(path, window.location.origin);
  let requestOptions: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    switch (method) {
      case "GET":
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
      const {
        message = "An error occurred",
        details = "No further details",
        error = "Unknown error",
      } = (await response.json()) || {};
      throw new Error(
        `HTTP ${response.status}\nMessage: ${message}\nError: ${error}\nDetails: ${details}`
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
