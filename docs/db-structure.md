# DB 구조 정리 (Prisma / Postgres)

본 문서는 `prisma/schema.prisma` 기준으로 현재 프로젝트의 DB 구조를 정리한 문서이다.  
인증(Auth.js/NextAuth) 기본 테이블 + 플래너(TimeBlock/반복) 모델을 포함한다.

---

## 1️⃣ 공통 전제

### 데이터베이스

- DB: **PostgreSQL**
- Prisma datasource: `provider = "postgresql"`, `DATABASE_URL` 사용

### 날짜 저장 규칙 (중요)

- `TimeBlock.date`, `TimeBlockRecurrence.startDate`, `TimeBlockRecurrence.untilDate`, `TimeBlockRecurrenceException.date` 는 모두 **Postgres `DATE`** (`@db.Date`)로 저장된다.
- 시간대/UTC 변환 이슈를 줄이기 위해 “하루 단위”는 **날짜만 의미** 있게 취급한다.

### 시간 저장 규칙

- `startMin`, `endMin` 은 **00:00 기준 분(minute) 정수**로 저장한다.
  - 예: 09:30 → `570`
  - 범위(의도): `startMin`: 0~1439, `endMin`: 1~1440
  - 조건(의도): `startMin < endMin`

---

## 2️⃣ Auth.js(NextAuth) 기본 테이블

Prisma Adapter 정석 형태로 구성되어 있으며, `session.strategy = "database"` 설정을 사용한다.

### `User`

- **PK**: `id` (String, cuid)
- **Unique**: `email`
- **Relations**
  - `accounts`: `Account[]`
  - `sessions`: `Session[]`
  - (앱 데이터) `timeBlocks`: `TimeBlock[]`
  - (앱 데이터) `timeRecurrences`: `TimeBlockRecurrence[]`
- **Timestamps**
  - `createdAt` (now)
  - `updatedAt` (@updatedAt)

### `Account`

- OAuth 계정 연결 테이블
- **PK**: `id`
- **FK**: `userId` → `User.id` (onDelete: Cascade)
- **Unique**: `@@unique([provider, providerAccountId])`
- **Index**
  - `@@index([userId])`

### `Session`

- DB 세션 테이블
- **PK**: `id`
- **Unique**: `sessionToken`
- **FK**: `userId` → `User.id` (onDelete: Cascade)
- **Index**
  - `@@index([userId])`

### `VerificationToken`

- 이메일 로그인/검증 등에 사용
- **Unique**
  - `token` 단독 unique
  - `@@unique([identifier, token])`

---

## 3️⃣ Planner - 단일 일정(TimeBlock)

하루 단위 타임블록(단발성 일정) 모델이다.

### `TimeBlock`

- **PK**: `id`
- **FK**: `userId` → `User.id` (onDelete: Cascade)
- **Columns**
  - `date`: DateTime `@db.Date` (날짜만)
  - `startMin`: Int
  - `endMin`: Int
  - `title`: String
  - `color`: String? (예: `#RRGGBB`, nullable)
  - `createdAt`, `updatedAt`
- **Index**
  - `@@index([userId, date])`
  - `@@index([userId, date, startMin])`

### 설계 의도 요약

- “주간 시간표” 조회를 위해 `userId + date` 기반 검색/정렬이 빠르도록 인덱스를 둔다.
- 시간 겹침(overlap) 방지는 현재 스키마 레벨 제약은 없고, API/서비스 레벨에서 검사하는 방식으로 확장 가능하다.

---

## 4️⃣ Planner - 반복 규칙(TimeBlockRecurrence)

반복 일정(매주 특정 요일, 특정 시간) 모델이다.

### `TimeBlockRecurrence`

- **PK**: `id`
- **FK**: `userId` → `User.id` (onDelete: Cascade)
- **Columns**
  - `startMin`, `endMin`
  - `daysOfWeek`: `Int[]`
    - 규칙: `0=일, 1=월 ... 6=토`
    - 예: 월/수/금 → `[1, 3, 5]`
  - `startDate`: DateTime `@db.Date`
  - `untilDate`: DateTime? `@db.Date` (반복 종료일)
  - `title`, `color`
  - `createdAt`, `updatedAt`
- **Relations**
  - `exceptions`: `TimeBlockRecurrenceException[]`
- **Index**
  - `@@index([userId, startDate])`

---

## 5️⃣ 반복 예외(TimeBlockRecurrenceException)

반복 일정에서 특정 날짜를 “건너뛰기(SKIP)” 하거나 “해당 날짜만 수정(MODIFY)” 하는 예외 모델이다.

### `RecurrenceExceptionType` (enum)

- `SKIP`
- `MODIFY`

### `TimeBlockRecurrenceException`

- **PK**: `id`
- **FK**: `recurrenceId` → `TimeBlockRecurrence.id` (onDelete: Cascade)
- **Columns**
  - `date`: DateTime `@db.Date` (예외 적용 날짜)
  - `type`: `RecurrenceExceptionType`
  - `overrideStartMin`, `overrideEndMin`, `overrideTitle`, `overrideColor` (모두 optional)
    - `type = MODIFY`인 경우에만 의미가 있다.
- **Constraints**
  - `@@unique([recurrenceId, date])` : 같은 반복 규칙에서 같은 날짜 예외는 1개만
- **Index**
  - `@@index([recurrenceId])`

---

## 6️⃣ 관계 요약(ER 관점)

- `User 1 - N Account`
- `User 1 - N Session`
- `User 1 - N TimeBlock`
- `User 1 - N TimeBlockRecurrence`
- `TimeBlockRecurrence 1 - N TimeBlockRecurrenceException`
