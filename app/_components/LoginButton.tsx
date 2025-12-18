"use client";

import { signIn, signOut } from "next-auth/react";

export function LoginButton({ isAuthed }: { isAuthed: boolean }) {
  return isAuthed ? (
    <button onClick={() => signOut()}>로그아웃</button>
  ) : (
    <button onClick={() => signIn("google")}>구글로 로그인</button>
  );
}
