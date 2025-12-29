# 백엔드 API 정리 (Next.js Route Handlers)

본 문서는 `app/api/**` 기준으로 현재 프로젝트에 구현된 백엔드 API를 정리한 문서이다.

---

## 1️⃣ 인증(Auth.js / NextAuth)

### 엔드포인트

- `GET|POST /api/auth/[...nextauth]`

### 구현 위치

- `app/api/auth/[...nextauth]/route.ts` 에서 `auth.ts`의 `handlers`를 그대로 export 한다.

### 세부 동작(핵심만)

- OAuth Provider: Google
- Adapter: `@auth/prisma-adapter` + Prisma
- Session 전략: **database**
- Session callback:
  - `session.user.id = user.id` 를 주입하여 프론트에서 `user.id`를 쓸 수 있게 한다.

### 프론트 연계 포인트

- 클라이언트 컴포넌트에서 `next-auth/react`의 `signIn("google")`, `signOut()` 호출 시 위 NextAuth 라우트가 내부적으로 호출된다.

---

## 2️⃣ TimeBlock API (단일 일정 CRUD)

모든 TimeBlock API는 요청 시 `auth()`로 세션을 확인하며, `session.user.id` 기준으로 **본인 데이터만** 접근하도록 제한한다.

---

## 2-1) `GET /api/time-blocks`

### 인증

- 필요: 로그인 세션
- 실패: `401 { message: "Unauthorized" }`

### 쿼리 파라미터(둘 중 하나)

#### A. 단일 날짜 조회

- `date=YYYY-MM-DD`

#### B. 기간(주간) 조회

- `startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

### 응답

- 성공: `200 { items: TimeBlock[] }`
- 실패:
  - `400 { message: "date must be YYYY-MM-DD" }`
  - `400 { message: "startDate/endDate must be YYYY-MM-DD" }`
  - `400 { message: "Provide either date=YYYY-MM-DD or startDate/endDate" }`

### 정렬 규칙

- 단일 날짜: `startMin asc`
- 기간 조회: `date asc`, `startMin asc`

---

## 2-2) `POST /api/time-blocks`

### 인증

- 필요: 로그인 세션
- 실패: `401 { message: "Unauthorized" }`

### 요청 바디(JSON)

- `date`: `"YYYY-MM-DD"` (필수)
- `startMin`: number (정수, 필수)
- `endMin`: number (정수, 필수)
- `title`: string (필수, 공백 불가, 최대 100자)
- `color`: string | null (선택, 지정 시 `#RRGGBB`)

### 주요 검증 규칙

- `date` 형식: `YYYY-MM-DD`
- `startMin/endMin`:
  - 정수
  - 범위: `startMin 0~1439`, `endMin 1~1440`
  - 순서: `startMin < endMin`
- `title`:
  - 공백 제거 후 비어 있으면 불가
  - 길이 100자 이하
- `color`:
  - 미지정/빈문자열이면 `null`로 저장
  - 지정 시 `#RRGGBB` 형식만 허용

### 응답

- 성공: `201 { item: TimeBlock }`
- 실패:
  - `400 { message: "Invalid JSON body" }`
  - 각 validation 실패에 대한 `400 { message: ... }`

---

## 2-3) `PATCH /api/time-blocks/[id]`

### 인증

- 필요: 로그인 세션
- 실패: `401 { message: "Unauthorized" }`

### 요청 바디(JSON)

아래 필드 중 **일부만** 보내도 되며, 보낸 것만 반영한다.

- `date`: `"YYYY-MM-DD"`
- `startMin`: number (정수)
- `endMin`: number (정수)
- `title`: string (공백 불가, 최대 100자)
- `color`: `"#RRGGBB"` | `null` | `""`
  - `null` 또는 `""` 는 색상 제거로 처리

### 동작/검증 포인트

- 먼저 `id`가 **내 데이터인지** 확인한다.
  - 없으면 `404 { message: "TimeBlock not found" }`
- `startMin/endMin`은 둘 중 하나만 바꿔도, 기존 값과 합쳐서 `startMin < endMin` 검증을 수행한다.
- 업데이트할 필드가 하나도 없으면:
  - `400 { message: "No fields to update" }`

### 응답

- 성공: `200 { item: TimeBlock }`

---

## 2-4) `DELETE /api/time-blocks/[id]`

### 인증

- 필요: 로그인 세션
- 실패: `401 { message: "Unauthorized" }`

### 동작

- 먼저 `id`가 **내 데이터인지** 확인
  - 없으면 `404 { message: "TimeBlock not found" }`
- 삭제 성공 시 본문 없이 응답

### 응답

- 성공: `204 (No Content)`

---

## 3️⃣ 구현 메모(확장 포인트)

- 현재 API는 **단일 일정(TimeBlock)** 에 대한 CRUD만 제공한다.
- 반복(`TimeBlockRecurrence`) 및 예외(`TimeBlockRecurrenceException`)에 대한 API는 스키마는 있으나 `app/api`에 라우트가 아직 없다.
