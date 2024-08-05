type HttpMethod = "POST" | "GET" | "DELETE";

export default async function fetchRequest<T>(
  method: HttpMethod,
  path: string,
  action: string,
  content?: object
): Promise<T> {
  let url: URL;
  let requestOptions: RequestInit = {
    method: method,
  };

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

    case "POST":
    case "DELETE":
      url = new URL(path, window.location.origin);
      requestOptions.body = content && action ? JSON.stringify({ action, content }) : undefined;

      break;

    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }

  return await (await fetch(url.toString(), requestOptions)).json();
}
