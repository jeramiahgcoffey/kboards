import { NextResponse } from "next/server";
import { z } from "zod";
import { passwordResetRequestSchema } from "@/lib/validation";
import { requestPasswordReset } from "@/lib/auth/passwordReset";

// Identical for known and unknown emails, so the response never reveals which
// addresses have accounts.
const GENERIC_MESSAGE =
  "If an account exists for that email, a password reset link has been sent.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const parsed = passwordResetRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  await requestPasswordReset(parsed.data.email);

  return NextResponse.json({ message: GENERIC_MESSAGE });
}
