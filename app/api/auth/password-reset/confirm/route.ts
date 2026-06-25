import { NextResponse } from "next/server";
import { z } from "zod";
import { passwordResetSchema } from "@/lib/validation";
import { confirmPasswordReset } from "@/lib/auth/passwordReset";

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

  const parsed = passwordResetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { userId, token, password } = parsed.data;
  const result = await confirmPasswordReset(userId, token, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  return NextResponse.json({ message: "Password updated successfully" });
}
