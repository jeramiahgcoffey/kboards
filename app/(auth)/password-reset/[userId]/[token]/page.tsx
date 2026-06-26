import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetForm } from "./ResetForm";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetConfirmPage({
  params,
}: {
  params: Promise<{ userId: string; token: string }>;
}) {
  const { userId, token } = await params;

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Pick something at least 8 characters long."
    >
      <ResetForm userId={userId} token={token} />
    </AuthCard>
  );
}
