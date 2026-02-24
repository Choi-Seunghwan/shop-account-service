# shop-account-service

회원/인증 백엔드 서비스 (NestJS)

## Links

- [web.shop.chuz.site](https://web.shop.chuz.site/) - 예제 사이트
- [shop-commerce-service](https://github.com/Choi-Seunghwan/shop-commerce-service) - 커머스 서비스
- [msa-common-packages](https://github.com/Choi-Seunghwan/msa-common-packages) - 공통 패키지

## Tech Stack

- NestJS
- Prisma (PostgreSQL)
- JWT Authentication
- PortOne (본인인증)

## Modules

- **Account** - 회원가입, 로그인, 계정 관리
- **Verification** - 본인인증 (PortOne 이니시스)
- **Database** - Prisma 연동

## 로컬 개발 설정

```bash
# 패키지 설치
pnpm install

# Prisma 클라이언트 생성
npx prisma generate

# DB 마이그레이션
npx prisma migrate deploy

# 개발 서버 실행
pnpm start:dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /account/signup | 회원가입 |
| POST | /account/login | 로그인 |
| POST | /account/refresh-token | 토큰 갱신 |
| GET | /account/me | 내 정보 |
