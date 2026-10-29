# YN 변호사 사무실 - 채무탕감 신청 접수

채무탕감 법률 상담 신청을 받는 원페이지 랜딩페이지 (React + Vite + Supabase)

## 실행 방법

1. `.env.example`을 복사해 `.env.local`을 만들고 Supabase URL / anon key 입력
2. `npm install`
3. `npm run dev`

## 구조

- 백엔드 없이 브라우저에서 Supabase(`consultations` 테이블, 비공개 `post-files` 버킷)에 직접 저장
- 방문자(anon)는 신청서 저장(INSERT)만 가능, 조회/수정/삭제 불가 (RLS)
- 접수된 신청서는 Supabase 대시보드에서만 확인

## 배포

`main` 브랜치에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드 후 GitHub Pages로 배포합니다.
빌드에 필요한 키는 저장소 Secrets(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)로 관리합니다.
