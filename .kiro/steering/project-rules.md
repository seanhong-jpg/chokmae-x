---
inclusion: always
---

# 프로젝트 규칙 (항상 지킬 것)

이 프로젝트는 해커톤 사후 MVP다. 완성한 앱은 멘토가 준비한 EC2 서버에서 `npm install` → `npm run build` → `npm start` 순서로 배포한다.
아래 규칙은 그 배포 방식이 그대로 통하게 하기 위한 것이므로, 사용자가 따로 말하지 않으면 바꾸지 않는다.

## 1. 기술 스택 (고정)

- Next.js (App Router) + TypeScript, Node 20 이상
- DB는 MySQL, 드라이버는 `mysql2/promise`
- 그 밖의 라이브러리는 꼭 필요할 때만 추가하고, 추가하기 전에 이유를 한 줄로 말한다
- CSS 프레임워크 없이 `src/app/globals.css` 하나로 스타일을 관리

## 2. package.json scripts (이 이름과 값 그대로)

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start -p 8000"
}
```

`npm start`는 반드시 8000 포트로 뜬다. 서버의 8000 포트만 열려 있다.

## 3. 환경변수 (.env)

- DB 접속 정보는 코드에 쓰지 않고 아래 네 개만 `process.env`에서 읽는다. 이름은 바꾸지 않는다.
  ```
  DB_HOST=
  DB_USER=
  DB_PASSWORD=
  DB_NAME=
  ```
- 포트는 `DB_PORT`가 없으면 3306을 기본값으로 쓴다.
- 값을 비운 `.env.example`을 만들어 GitHub에 올리고, 진짜 값이 든 `.env`는 절대 올리지 않는다.
- 비밀번호, API 키는 코드나 채팅 답변에 그대로 적지 않는다.

## 4. DB 코드 구조

- DB 연결은 `src/lib/db.ts` 한 곳에서만 만든다. 파일 맨 위에 `import "server-only";`
- 커넥션 풀은 `globalThis`에 한 번만 만들어 재사용한다.
- 테이블은 앱이 처음 DB를 쓸 때 `CREATE TABLE IF NOT EXISTS ... DEFAULT CHARSET=utf8mb4`로 자동 생성한다.
  기본 데이터가 필요하면 테이블이 비어 있을 때만 넣는다. 따로 마이그레이션 도구나 SQL 파일을 쓰지 않는다.
- 테이블 이름에는 앱 이름 접두어를 붙인다 (예: `app_items`). 같은 DB를 다른 앱과 같이 쓸 수 있다.
- SQL에 값을 넣을 때는 항상 `?` 자리표시자를 쓰고, 문자열을 이어 붙여 SQL을 만들지 않는다.
- `next.config.ts`에 `serverExternalPackages: ["mysql2"]`를 넣는다.
- DB를 읽는 페이지에는 `export const dynamic = "force-dynamic";`을 넣는다.
  (빌드할 때 DB에 접속하려다 `npm run build`가 실패하는 것을 막기 위해)
- 데이터를 저장·수정하는 것은 Server Actions(`"use server"`)로 하고, 별도 API 서버는 만들지 않는다.

## 5. .gitignore

```
node_modules/
.next/
out/
.env*
!.env.example
*.tsbuildinfo
next-env.d.ts
```

## 6. MVP 범위

- 테이블은 2-3개 정도로 시작하고, 더 늘릴 때는 이유를 한 줄로 말한다.
- 화면 수는 필요한 만큼 두되, 처음에는 핵심 화면부터 만든다.
- 핵심 행동 1개가 처음부터 끝까지 되고, 저장한 결과가 다른 화면에서 보이면 MVP 완성이다.
- 다음은 MVP에서 뺀다: 로그인·회원가입, 결제, 알림·메일·문자, 실시간 기능, 외부 API·AI 연동.
  사용자가 이런 걸 원하면 바로 만들지 않고, README의 "다음에 할 것" 목록에 적자고 제안한다.
- 화면 글자는 한국어, 휴대폰에서도 보기 좋게.

## 7. 작업 방식

- 한 번에 화면 하나 또는 기능 하나씩 만들고, 끝날 때마다 무엇을 바꿨는지 짧게 설명한다.
- 기능을 마칠 때마다 `npm run build`로 오류가 없는지 확인한다. 빌드가 깨진 채로 다음 작업으로 넘어가지 않는다.
- README.md에 앱 설명, 화면 목록, 실행 방법(`.env` 채우기 → `npm install` → `npm run dev`)을 최신으로 유지한다.
- Git은 main 브랜치 하나만 쓴다. `--force`, `reset --hard`, `rebase`, `clean`, `rm -rf`는 쓰지 않고,
  필요해 보이면 멈추고 멘토를 부르라고 안내한다.
- 명령을 실행하기 전에 무엇을 하는 명령인지 쉬운 말로 한 줄 설명한다.

## 8. 배포 전 화면 확인 (local-db)

- `.env`가 비어 있으면 아직 실제 DB가 연결되지 않은 것이다. 이때 화면을 확인하려면
  `local-db` 폴더에서 `npm install` → `npm start`로 띄운다.
- 이미 `npm run dev`가 켜져 있으면 먼저 끄고 띄운다. 같은 폴더에서 개발 서버는 하나만 켤 수 있다.
- 임시 DB 값은 `.env`나 코드에 적지 않는다. `.env`는 실제 DB 전용이다.
- `local-db` 폴더에는 파일을 만들거나 고치지 않는다.
- DB 없이 화면을 띄우려고 가짜 데이터나 오류를 무시하는 코드를 넣지 않는다.
