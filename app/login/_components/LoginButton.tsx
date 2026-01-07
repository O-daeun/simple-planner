"use client";

import { ROUTES } from "@/lib/routes";
import { signIn, signOut } from "next-auth/react";

export default function LoginButton({ isAuthed }: { isAuthed: boolean }) {
  return (
    <button
      onClick={() =>
        isAuthed
          ? signOut({ redirectTo: ROUTES.login })
          : signIn("google", { redirectTo: ROUTES.plan.day })
      }
    >
      {isAuthed ? "로그아웃" : "구글로 로그인"}
    </button>
  );
}
