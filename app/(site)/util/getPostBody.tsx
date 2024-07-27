import { NextRequest } from "next/server";

type BodyPost = {
  action: string;
  content: object | any;
};

export default async function getPostBody(request: NextRequest) {
  return (await request.json()) as BodyPost;
}
