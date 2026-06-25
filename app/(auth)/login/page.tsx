import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  // Already signed in: skip the form.
  if (await auth()) redirect("/boards");

  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back. Pick up where you left off."
      footer={
        <>
          New to kboards?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--color-accent-hover)] hover:underline focus-visible:underline focus-visible:outline-none"
          >
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
