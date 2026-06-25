"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { FormStatus } from "@/components/ui/FormStatus";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    setPending(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setPending(false);

    // Generic message: never reveal whether the email or the password was wrong.
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/boards");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormStatus message={error} />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="Your password"
      />
      <Button type="submit" loading={pending}>
        Sign in
      </Button>
      <p className="text-center text-xs text-[var(--color-dim)]">
        <Link
          href="/password-reset"
          className="hover:underline focus-visible:underline focus-visible:outline-none"
        >
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}
