# Simple Planner

주간 시간표(weekly timetable) 기반으로 **단일 일정(TimeBlock)** 과 **반복 일정(TimeBlockRecurrence)** 을 관리하는 플래너 프로젝트입니다.

---

## Docs

- `docs/ux-planning.md`: 주간 시간표 UI/UX 기획(더블클릭 편집, 색상, 반복/삭제 플로우)
- `docs/backend-api.md`: Next.js Route Handlers 기반 백엔드 API 스펙(인증/TimeBlock/Recurrence/예외)
- `docs/env.md`: 환경 변수(.env) 설정 가이드(로컬/배포 체크리스트)
- `docs/db-structure.md`: Prisma 스키마 기준 DB 구조/규칙 정리(Postgres DATE, startMin/endMin 규칙 등)
- `docs/neon.md`: Neon(Postgres) 사용/역할/연결 방법 정리

---

## 기술 스택

### 프론트엔드

- **Next.js (App Router)**: 페이지/라우팅 및 서버 컴포넌트 기반 렌더링
- **React**: UI 컴포넌트
- **TypeScript**: 타입 안정성
- **Tailwind CSS (v4)**: 스타일링

### 백엔드

- **Next.js Route Handlers (`app/api/*`)**: API 엔드포인트 구현
- **Auth.js / NextAuth v5 (beta)**: Google OAuth 로그인
  - DB 세션 전략(`session.strategy = "database"`)

### DB/ORM

- **PostgreSQL (Neon)**: Neon에서 제공하는 Managed Postgres 사용
- **Prisma**: 스키마/마이그레이션/쿼리(Prisma Client)
- **@auth/prisma-adapter**: Auth.js/NextAuth와 Prisma 테이블 연동

### 날짜/시간 유틸

- **date-fns**: 날짜 계산/포맷
- **date-fns-tz**: KST(Asia/Seoul) 기준 날짜 처리

### 개발 도구

- **ESLint**: 코드 품질 검사
- **Prettier**: 포맷팅
  - `prettier-plugin-tailwindcss`: Tailwind 클래스 정렬
  - `prettier-plugin-prisma`: Prisma 스키마 포맷팅

---

## 환경 변수(.env)

로컬에서 실행하려면 아래 환경 변수가 필요합니다.

- 자세한 가이드: `docs/env.md`
- 복붙 템플릿: `docs/env.example`

- **DB (Neon Postgres)**
  - `DATABASE_URL`: Neon에서 발급받은 Postgres 연결 문자열
- **Google OAuth**
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

> 참고: Auth.js/NextAuth는 배포 환경에서 추가 설정(예: secret/url)이 필요할 수 있습니다. 현재 프로젝트는 `auth.ts`에서 위 Google 환경변수를 사용합니다.

---

## 로컬 실행

### 1) 의존성 설치

```bash
pnpm install
```

### 2) 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속 후 확인합니다.
