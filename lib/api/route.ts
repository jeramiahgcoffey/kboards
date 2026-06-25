import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { getCurrentUserId } from "@/lib/auth/dal";
import { ServiceError } from "@/lib/services/errors";

interface AuthedArgs<P> {
  request: Request;
  userId: string;
  params: P;
}

// Wraps a Route Handler so every authenticated route shares one auth gate and
// one error-mapping policy. The handler receives the verified user id and the
// resolved route params, and may throw ServiceError or ZodError to produce
// non-200 responses.
export function authed<P = Record<string, never>>(
  handler: (args: AuthedArgs<P>) => Promise<Response>,
) {
  return async (
    request: Request,
    context: { params: Promise<P> },
  ): Promise<Response> => {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const params = await context.params;
      return await handler({ request, userId, params });
    } catch (error) {
      return toErrorResponse(error);
    }
  };
}

// Parses a JSON request body, throwing a 400 on malformed input.
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ServiceError(400, "Request body must be valid JSON");
  }
}

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof ServiceError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: z.flattenError(error).fieldErrors,
      },
      { status: 400 },
    );
  }
  // Mongoose schema validation (e.g. a field below its minlength) is a 400.
  if (
    error &&
    typeof error === "object" &&
    (error as { name?: string }).name === "ValidationError"
  ) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  console.error("Unhandled route error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
