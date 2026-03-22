# AI 말싸움 챌린지

## 앱 개요
AI와 말싸움해서 이겨보는 챌린지 앱. 사용자가 주제를 고르면 AI가 반대편을 잡고 5라운드 동안 반박. 마지막에 AI가 점수 매기고 티어 판정.

## 핵심 기능
- 주제 선택: 일상 / 연애 / 사회 / 억지주장 (각 카테고리별 고정 주제 목록)
- 5라운드 진행 (사용자 주장 1번 → AI 반박 1번 = 1라운드)
- 라운드 종료 후 AI가 최종 점수 + 티어 판정
- 티어: 브론즈 → 실버 → 골드 → 플래티넘 → (AI 못 이김)
- 티어 인증 공유 기능 (바이럴 목적)

## 기술 스택
- React Native (Expo)
- Gemini API (`gemini-2.5-flash`, `temperature=0.9` — 공격적으로 반박하도록)
- 시크릿: `.env` 파일의 `GEMINI_API_KEY`

## 개발 명령어
```bash
# 프로젝트 생성 (최초 1회)
npx create-expo-app ai_chat

# 실행
npx expo start

# 의존성 설치
npm install
```

## 시크릿 설정
`.env` 파일에 설정:
```
GEMINI_API_KEY=여기에입력
```

## 개발 규칙
- 컴포넌트는 기능별로 분리 (ChatScreen, TopicSelect, ResultScreen 등)
- AI 프롬프트 핵심: AI는 절대 지지 않고 어떻게든 반박함. 말도 안 되는 주장도 진지하게 반박.
- 티어 판정은 AI가 스스로 점수 매기되, 후하게 주지 않음 (골드 이상은 진짜 어렵게)
- 모바일 UI 우선
