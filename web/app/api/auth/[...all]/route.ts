import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_LANDING_URL,
];

const { POST: _POST, GET: _GET } = toNextJsHandler(auth);

function withCors(handler: (req: Request) => Promise<Response>) {
  return async (request: Request) => {
    const origin = request.headers.get("origin") ?? "";
    const response = await handler(request);

    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    return response;
  };
}

export const POST = withCors(_POST);
export const GET = withCors(_GET);

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") ?? "";

  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });
}
