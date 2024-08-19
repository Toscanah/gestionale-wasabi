import { NextRequest } from "next/server";

type BodyPost = {
  action: string;
  content: object | any;
};

export default async function getRequestBody(request: NextRequest): Promise<BodyPost> {
  return (await request.json());
}
