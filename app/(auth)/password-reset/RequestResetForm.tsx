"use client";

import { useState, type SyntheticEvent } from "react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { FormStatus } from "@/components/ui/FormStatus";

export function RequestResetForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");

    setPending(true);
    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // For a valid email the endpoint always responds the same way (so the UI
      // reveals nothing); a non-OK response means the input itself was rejected.
      if (!response.ok) {
        setError("Please enter a valid email address.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <p role="status" className="text-sm text-[var(--color-dim)]">
        If an account exists for that email, a password reset link is on its way.
        Check your inbox.
      </p>
    );
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
      <Button type="submit" loading={pending}>
        Send reset link
      </Button>
    </form>
  );
}
