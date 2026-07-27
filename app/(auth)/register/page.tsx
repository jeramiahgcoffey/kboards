import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Create an account" };

export default async function RegisterPage() {
  if (await auth()) redirect("/boards");

  return (
    <AuthCard
      title="Start your board"
      subtitle="Create your account and open a ready-to-edit Personal flow."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--color-accent-hover)] hover:underline focus-visible:underline focus-visible:outline-none"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
