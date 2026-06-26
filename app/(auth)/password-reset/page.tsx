import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { RequestResetForm } from "./RequestResetForm";

export const metadata: Metadata = { title: "Reset your password" };

export default function PasswordResetPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we will send you a reset link."
      footer={
        <Link
          href="/login"
          className="font-semibold text-[var(--color-accent-hover)] hover:underline focus-visible:underline focus-visible:outline-none"
        >
          Back to sign in
        </Link>
      }
    >
      <RequestResetForm />
    </AuthCard>
  );
}
