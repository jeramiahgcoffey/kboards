import crypto from "crypto";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { Token } from "@/lib/db/models/Token";
import { sendResetEmail } from "@/lib/email";

// SHA-256 hash used to store reset tokens at rest. The raw token is only ever
// emailed to the user, so a database leak exposes no usable tokens.
function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

// Issues a password reset for the given email. Resolves identically whether or
// not the email maps to an account, so the caller can return a generic response
// and avoid revealing which addresses are registered.
export async function requestPasswordReset(email: string): Promise<void> {
  await dbConnect();

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return;

  const rawToken = crypto.randomBytes(32).toString("hex");

  // One active token per user: replace any existing one and reset its TTL clock
  // (the Token model expires documents an hour after createdAt).
  await Token.findOneAndUpdate(
    { userId: user._id },
    { userId: user._id, tokenHash: hashToken(rawToken), createdAt: new Date() },
    { upsert: true },
  );

  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  const link = `${baseUrl}/password-reset/${String(user._id)}/${rawToken}`;
  await sendResetEmail(user.email, link);
}

export type ConfirmResult = { ok: true } | { ok: false; reason: string };

const INVALID = "Invalid or expired reset link";

// Completes a password reset: validates the token by its hash (a TTL index has
// already removed expired ones), updates the password, and burns the token so
// the link cannot be replayed.
export async function confirmPasswordReset(
  userId: string,
  rawToken: string,
  newPassword: string,
): Promise<ConfirmResult> {
  await dbConnect();

  // Guard before casting so a malformed id is a clean rejection, not a 500.
  if (!mongoose.isValidObjectId(userId)) return { ok: false, reason: INVALID };

  const token = await Token.findOne({ userId, tokenHash: hashToken(rawToken) });
  if (!token) return { ok: false, reason: INVALID };

  const user = await User.findById(userId).select("+password");
  if (!user) return { ok: false, reason: INVALID };

  // Assigning triggers the User pre-save hook, which hashes the new password.
  user.password = newPassword;
  await user.save();

  await Token.deleteOne({ _id: token._id });

  return { ok: true };
}
