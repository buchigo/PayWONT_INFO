# PayWONT

Vite 기반의 React 프로젝트가 초기화되었습니다. 아래 단계에 따라 개발 서버 실행과 빌드를 진행할 수 있습니다.

## 시작하기

```bash
npm install
npm run dev
```

- 개발 서버는 기본적으로 `http://localhost:5173` 에서 실행됩니다.
- 종료할 때는 터미널에서 `Ctrl + C` 를 누르세요.

## 주요 스크립트

- `npm run dev`: 개발 서버 구동 (HMR 지원)
- `npm run build`: 프로덕션 번들 생성 (`dist/` 디렉터리)
- `npm run preview`: 프로덕션 빌드 미리보기
- `npm run lint`: ESLint 검사 수행

## 디렉터리 구조

- `src/`: 앱의 메인 코드 (엔트리: `main.jsx`, 주요 컴포넌트: `App.jsx`)
- `public/`: 정적 자산
- `vite.config.js`: Vite 설정 파일

## 다음 단계

필요한 UI 컴포넌트와 페이지를 `src/` 디렉터리에 추가하고, ESLint 규칙과 Vite 설정을 프로젝트 요구사항에 맞게 조정해 주세요.
