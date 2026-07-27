"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { FormStatus } from "@/components/ui/FormStatus";
import { apiFetch } from "@/lib/api/client";
import type { BoardDTO } from "@/lib/dto";

export function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(
          response.status === 409
            ? "An account with that email already exists."
            : (body?.error ?? "Could not create your account."),
        );
        return;
      }

      // Account created: sign in, then fulfill the landing-page promise by
      // opening a useful Personal board instead of another setup screen.
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      let destination = "/boards";
      try {
        const { board } = await apiFetch<{ board: BoardDTO }>("/api/boards", {
          method: "POST",
          body: { name: "My week", template: "personal" },
        });
        destination = `/boards/${board.id}`;
      } catch {
        // The account and session are already valid. Fall back to the existing
        // empty state so a transient board-creation failure never strands the
        // new user or asks them to register again.
      }

      router.push(destination);
      router.refresh();
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
        label="Name (optional)"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="Ada Lovelace"
      />
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
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="At least 8 characters"
      />
      <Button type="submit" loading={pending}>
        Create account &amp; board
      </Button>
    </form>
  );
}
