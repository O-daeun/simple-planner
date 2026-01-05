# 환경 변수 설정 가이드 (Simple Planner)

이 문서는 로컬/배포 환경에서 필요한 `.env` 값을 준비하는 방법을 설명합니다.

- 복붙용 템플릿: `docs/env.example`
- 값 준비/설명 가이드: 이 문서(`docs/env.md`)

---

## 빠른 시작 (로컬)

1. 프로젝트 루트에 `.env` 파일을 생성합니다.
2. `docs/env.example` 내용을 복사해서 `.env`에 붙여넣습니다.
3. 아래 항목들을 채웁니다.
4. `pnpm dev` 실행 후 `http://localhost:3000` 접속합니다.

---

## 필수 환경 변수

## `DATABASE_URL` (필수)

- 설명: Postgres(Neon) 연결 문자열
- 형식 예시: `postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require`
- 어디서 받나: Neon 콘솔에서 프로젝트/브랜치의 connection string 복사

체크:

- `sslmode=require` 포함 권장(Neon 기본)
- Prisma가 `.env`의 `DATABASE_URL`로 DB에 연결합니다.

참고: `docs/neon.md`

---

## `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (필수)

- 설명: Google OAuth 로그인(Auth.js/NextAuth) 설정값
- 어디서 받나: Google Cloud Console → OAuth Client 생성 후 발급

체크(중요):

- 로컬 Authorized redirect URI:
  - `http://localhost:3000/api/auth/callback/google`
- 배포 시에도 배포 도메인에 대한 redirect URI를 추가해야 합니다.

---

## `AUTH_SECRET` (필수)

- 설명: Auth.js/NextAuth가 세션/토큰 암호화에 사용하는 secret
- 생성 예: `openssl rand -base64 32`

체크:

- 로컬/배포 모두 권장(사실상 필수)
- 값이 바뀌면 기존 세션이 무효화될 수 있습니다.

---

## `AUTH_URL` (선택이지만 권장)

- 설명: Auth.js/NextAuth가 호스트를 추론할 때 발생하는 이슈를 줄이기 위한 고정 URL
- 로컬 권장값: `http://localhost:3000`
- 배포 권장값: `https://your-domain.com`

---

## 로컬 동작 확인 체크리스트

- `.env`가 프로젝트 루트에 존재하는가
- `DATABASE_URL`로 DB 연결이 되는가
- Google OAuth의 redirect URI가 올바른가
- 로그인 후 새로고침 시에도 세션이 유지되는가

---

## 배포 체크리스트

- 배포 환경 변수에 아래 값들을 모두 설정:
  - `DATABASE_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `AUTH_SECRET`
  - `AUTH_URL`
- Google OAuth 콘솔에 배포 도메인의 redirect URI 추가
- `AUTH_URL`을 배포 도메인으로 설정
