"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  return (
    <Button
      variant="secondary"
      className="px-4"
      onClick={() => signOut({ redirectTo: "/login" })}
    >
      Sign out
    </Button>
  );
}
