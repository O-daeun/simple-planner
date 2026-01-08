# Middleware로 `/plan/**` 인증 보호 + `next`로 복귀하기 (Next.js App Router + next-auth v5)

이 문서는 **현재 프로젝트(Simple Planner)** 기준으로, 로그인하지 않은 사용자가 `/plan/**`에 접근하면 `/login`으로 보내고, 로그인 완료 후에는 **원래 가려던 경로로 복귀**시키는 방법을 정리합니다.

## 목표 UX

- 사용자가 `/plan/week` 접근
- 로그인 안 되어 있으면 → `/login?next=/plan/week` 로 이동
- 로그인하면 → `next` 값(`/plan/week`)으로 이동 (없으면 기본값 `/plan/day`)

## 전제 (현재 프로젝트 기준)

- `auth.ts`에서 `export const { auth } = NextAuth(...)` 형태로 서버 인증 헬퍼를 제공하고 있음
- 로그인 페이지는 `app/login/page.tsx`
- 경로 상수는 `lib/routes.ts`의 `ROUTES`
- 로그인 버튼은 `app/login/_components/LoginButton.tsx`에서 `signIn("google", { redirectTo })` 사용 중

---

## 1) `middleware.ts` 추가 (핵심)

프로젝트 루트(= `package.json` 있는 위치)에 `middleware.ts` 파일을 새로 만듭니다.

역할:
- `/plan/:path*` 요청만 가로채서 로그인 여부 확인
- 미로그인일 때 `/login`으로 **redirect**
- 이때 현재 경로를 `next` 파라미터로 같이 전달

```ts
import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    const loginUrl = new URL(ROUTES.login, req.nextUrl.origin);
    loginUrl.searchParams.set(
      "next",
      req.nextUrl.pathname + req.nextUrl.search,
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/plan/:path*"],
};
```

### 참고

- `matcher`에 `/plan/:path*`를 걸었기 때문에 `/login` 등은 영향받지 않습니다.
- `next`는 **상대 경로(`/...`)만** 안전하게 처리하는 게 좋습니다(아래 로그인 페이지에서 방어 처리).

---

## 2) `app/login/page.tsx`에서 `next` 처리

로그인 페이지에서 `searchParams.next`를 읽고:
- 로그인 이미 되어 있으면 그 경로로 `redirect()`
- 로그인 안 되어 있으면, `LoginButton`에 `redirectTo`로 전달

**권장 구현(보안 방어 포함):**
- `next` 값이 `/`로 시작하지 않으면 무시하고 기본값으로 대체 (오픈 리다이렉트 방지)

예시 코드(현재 프로젝트 구조 기준):

```tsx
import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";
import LoginButton from "./_components/LoginButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const session = await auth();
  const next = searchParams?.next;
  const safeNext = next && next.startsWith("/") ? next : ROUTES.plan.day;

  if (session) redirect(safeNext);

  return (
    <main>
      <h1>Simple Planner</h1>
      <LoginButton isAuthed={false} redirectTo={safeNext} />
    </main>
  );
}
```

---

## 3) `LoginButton`이 `redirectTo`를 받도록 변경

현재는 항상 `ROUTES.plan.day`로만 보내고 있으니, `redirectTo`를 prop으로 받아서 사용하도록 바꿉니다.

```tsx
"use client";

import { signIn, signOut } from "next-auth/react";
import { ROUTES } from "@/lib/routes";

export default function LoginButton({
  isAuthed,
  redirectTo,
}: {
  isAuthed: boolean;
  redirectTo: string;
}) {
  return (
    <button
      onClick={() =>
        isAuthed
          ? signOut({ redirectTo: ROUTES.login })
          : signIn("google", { redirectTo })
      }
    >
      {isAuthed ? "로그아웃" : "구글로 로그인"}
    </button>
  );
}
```

---

## 4) 동작 확인 체크리스트

- `/plan/day`로 접속했을 때 로그인 안 되어 있으면 `/login?next=/plan/day`로 이동한다
- 로그인 버튼 누르면 로그인 완료 후 `/plan/day`로 복귀한다
- `/plan/week?foo=bar`로 접속하면 `/login?next=/plan/week?foo=bar`가 되고, 로그인 후에도 쿼리 포함해서 복귀한다
- `/login?next=https://evil.com` 같은 값이 들어와도 `safeNext` 방어로 무시된다

---

## 트러블슈팅

### `req.auth`가 항상 비어있는 것 같을 때
- `auth.ts`가 루트에 있고, `export const { auth } = NextAuth(...)` 형태인지 확인
- `middleware.ts`에서 `import { auth } from "@/auth"` 경로가 맞는지 확인
- `NEXTAUTH_URL`, `AUTH_SECRET` 등 환경변수가 정상인지 확인(프로젝트의 `docs/env.md` 참고)

### 로그인 후 항상 `/plan/day`로 가는 것 같을 때
- `LoginButton`이 `redirectTo`를 prop으로 받는지 확인
- `login/page.tsx`에서 `safeNext`를 계산해서 전달하는지 확인

---

## 다음 단계(선택)

- `/plan` 외에 API도 보호하고 싶으면, API 라우트에서는 현재처럼 `requireUserId()`로 401을 주는 방식이 깔끔합니다.
- “로그인 유지 기간/세션 만료” UX는 `next-auth` 세션 설정과 함께 조정할 수 있습니다.


