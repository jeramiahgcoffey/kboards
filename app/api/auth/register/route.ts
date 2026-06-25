import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { registerSchema } from "@/lib/validation";

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

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const { password, name } = parsed.data;
  await dbConnect();

  // Pre-check for a friendly 409 rather than surfacing a raw duplicate-key
  // error. The unique index on email remains the source of truth against races.
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists" },
      { status: 409 },
    );
  }

  try {
    const user = await User.create({ email, password, name });
    return NextResponse.json(
      { user: { id: String(user._id), email: user.email, name: user.name } },
      { status: 201 },
    );
  } catch (err) {
    // A concurrent request can still win the race; the unique index catches it.
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === 11000
    ) {
      return NextResponse.json(
        { error: "An account with that email already exists" },
        { status: 409 },
      );
    }
    throw err;
  }
}
