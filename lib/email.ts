import nodemailer from "nodemailer";

const FROM = process.env.EMAIL_FROM || "kboards <no-reply@kboards.local>";

// Sends the password reset link. When SMTP is configured we deliver a real
// email; otherwise (local dev, CI) we log the link so the flow stays testable
// end to end without external credentials. Wiring a transactional provider for
// production is a follow-up (see docs/adr/0004).
export async function sendResetEmail(to: string, link: string): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST) {
    console.info(`[email] password reset for ${to}: ${link}`);
    return;
  }

  const port = Number(SMTP_PORT) || 587;
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });

  await transport.sendMail({
    from: FROM,
    to,
    subject: "Reset your kboards password",
    text:
      `Reset your kboards password using this link:\n\n${link}\n\n` +
      `This link expires in one hour. If you did not request it, you can ignore this email.`,
  });
}
