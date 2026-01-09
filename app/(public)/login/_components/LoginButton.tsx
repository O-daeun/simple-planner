"use client";

import { ROUTES } from "@/lib/routes";
import { signIn, signOut } from "next-auth/react";

interface LoginButtonProps {
  isAuthenticated?: boolean;
}

export default function LoginButton({ isAuthenticated }: LoginButtonProps) {
  return (
    <button
      onClick={() =>
        isAuthenticated
          ? signOut({ redirectTo: ROUTES.login })
          : signIn("google", { redirectTo: ROUTES.plan.day })
      }
    >
      {isAuthenticated ? "로그아웃" : "구글로 로그인"}
    </button>
  );
}
