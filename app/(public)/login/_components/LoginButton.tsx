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
      className="cursor-pointer rounded-md border border-gray-400 px-3 py-1 text-xs"
    >
      {isAuthenticated ? "로그아웃" : "구글로 로그인"}
    </button>
  );
}
