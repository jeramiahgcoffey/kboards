import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";

export interface AuthedUser {
  id: string;
  email: string;
  name?: string;
}

// Verifies an email/password pair against the database and returns the safe
// user shape, or null on any failure. Callers must not reveal which check
// failed (unknown user vs wrong password) to avoid user enumeration.
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<AuthedUser | null> {
  await dbConnect();

  // Emails are stored lowercase/trimmed, so normalize the lookup to match.
  const normalizedEmail = email.trim().toLowerCase();

  // Password is select:false on the schema, so request it explicitly here.
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );
  if (!user) return null;

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return null;

  return { id: String(user._id), email: user.email, name: user.name };
}
