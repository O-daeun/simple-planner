# Neon 사용 정리

이 프로젝트는 DB로 PostgreSQL을 사용하며, 현재는 **Neon(Managed Postgres)** 을 통해 DB를 운영한다.

---

## Neon이 하는 역할(무엇을 대신해주나)

- **DB 서버 호스팅**: Postgres가 실행되는 인프라(서버/스토리지/네트워크)를 Neon이 제공
- **연결 정보 제공**: 애플리케이션은 Neon이 발급한 `DATABASE_URL`로 접속
- **운영/관리 지원**: 백업/복구, 모니터링, 스케일링 등 운영 요소를 서비스 차원에서 지원
- **브랜치(Branch) 기반 DB**: 개발/테스트 환경에서 브랜치로 DB를 분리해 쓰기 쉬움

---

## 이 프로젝트에서의 연결 방식

- 앱(Next.js)이 Prisma를 통해 DB에 접근한다.
- Prisma는 `.env`의 `DATABASE_URL`을 사용한다.
- 따라서 로컬에서 앱을 실행하더라도, DB는 Neon(클라우드)로 연결될 수 있다.

---

## `DATABASE_URL`은 어디서 얻나?

- Neon Console에서 프로젝트/브랜치(예: `production`)를 선택한 뒤 **Connect** 화면에서 Postgres 연결 문자열을 확인한다.
- 확인한 값을 로컬 `.env`의 `DATABASE_URL`에 넣는다.

> 주의: `DATABASE_URL`은 민감 정보이므로 커밋하지 않는다.
