import { NextRequest } from "next/server";

type BodyPost = {
  requestType: string;
  content: object;
};

export default async function getPostBody(request: NextRequest) {
  return (await request.json()) as BodyPost;
}
