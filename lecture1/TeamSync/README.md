# TeamSync

그룹 기반 스케줄 공유 웹 앱

## 시작하기

### 1. 서버 설정

```bash
cd server
cp .env.example .env
# .env 파일에서 DATABASE_URL과 JWT_SECRET 설정

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 2. 클라이언트 설정

```bash
cd client
npm install
npm run dev
```

### 접속

- 클라이언트: http://localhost:5173
- 서버: http://localhost:3000

## 기술 스택

- Frontend: React + Vite + TypeScript + Tailwind CSS + FullCalendar
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
- 인증: JWT (bcrypt)
