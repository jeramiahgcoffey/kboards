import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "kboards <no-reply@kboards.local>";

function resendApiKey(): string | undefined {
  if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY;

  // Preserve the current production deployment during the SMTP-to-API
  // migration: Resend's SMTP password is the same API key. This compatibility
  // path can be removed after RESEND_API_KEY is set in Vercel.
  if (process.env.SMTP_HOST === "smtp.resend.com") {
    return process.env.SMTP_PASS;
  }
}

// Sends the password reset link through Resend's HTTPS API. When no provider is
// configured (local development and CI), log the link so the flow remains
// testable without external credentials.
export async function sendResetEmail(to: string, link: string): Promise<void> {
  const apiKey = resendApiKey();

  if (!apiKey) {
    if (process.env.SMTP_HOST) {
      throw new Error(
        "SMTP delivery is no longer supported; configure RESEND_API_KEY",
      );
    }
    console.info(`[email] password reset for ${to}: ${link}`);
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your kboards password",
    text:
      `Reset your kboards password using this link:\n\n${link}\n\n` +
      `This link expires in one hour. If you did not request it, you can ignore this email.`,
  });

  if (error) {
    throw new Error(`Could not send password reset email: ${error.message}`);
  }
}
