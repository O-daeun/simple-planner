"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { signIn, signOut } from "next-auth/react";

interface LoginButtonProps {
  isAuthenticated?: boolean;
}

export default function LoginButton({ isAuthenticated }: LoginButtonProps) {
  return (
    <Button
      onClick={() =>
        isAuthenticated
          ? signOut({ redirectTo: ROUTES.login })
          : signIn("google", { redirectTo: ROUTES.plan.day })
      }
      size="sm"
    >
      {isAuthenticated ? "로그아웃" : "구글로 로그인"}
    </Button>
  );
}
