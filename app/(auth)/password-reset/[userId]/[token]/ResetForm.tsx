"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { FormStatus } from "@/components/ui/FormStatus";

export function ResetForm({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords do not match.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, token, password }),
      });

      if (!response.ok) {
        setError("This reset link is invalid or has expired.");
        return;
      }

      toast.success("Password updated. Please sign in.");
      router.push("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormStatus message={error} />
      <TextField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="At least 8 characters"
      />
      <TextField
        label="Confirm new password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="Re-enter your password"
      />
      <Button type="submit" loading={pending}>
        Update password
      </Button>
    </form>
  );
}
