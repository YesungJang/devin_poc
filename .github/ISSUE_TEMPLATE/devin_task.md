### ⚡ Problem
우리 SaaS 사이트(Next.js) 제품 페이지는 다국어 고객이 내용을 이해하기 어렵다.

### 🎯 Goal
*“번역+TTS+요약 버튼”* MVP 위젯을 삽입해 영어→일본어/한국어 변환 + 음성 재생 + TL;DR 5줄 요약을 제공한다.

### ✅ Tasks
- [ ] `/widgets/translateButton.tsx` 컴포넌트 생성 (React hook)
- [ ] OpenAI GPT-4o 번역 API 래퍼 구현 (`libs/translate.ts`)
- [ ] OpenAI TTS 호출 (`libs/tts.ts`) – 128 kbps mp3 스트림
- [ ] GPT-4o `gpt-4o-mini`로 5-bullet 요약 (`libs/summarize.ts`)
- [ ] 버튼 클릭 시 i18n 언어 선택 → 번역 → 오디오 → 모달 표시
- [ ] Jest 테스트: ① 한글 번역 결과 길이 < 1.3× 원문 ② summary bullet = 5
- [ ] GitHub Actions CI 통과 (`npm run test`, `next build`)

### 🧪 Definition of Done
- CI green  
- `/products/123` 페이지에서 버튼 클릭 시 5 초 이내 자막·TTS 출력 확인  
- Lighthouse i18n 검증 스코어 ≥ 90

### 🔗 References
- `components/LocaleSelector.tsx` – 드롭다운 UI 예시  
- OpenAI TTS docs: https://platform.openai.com/docs/guides/text-to-speech  
- Glossary 파일: `/docs/glossary-product.json`

### 🚫 Out of Scope
- 모바일 레이아웃 조정  
- 캐싱·CDN 최적화
