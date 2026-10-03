# BibleTree 접는 카드 → 웹 묵상 시연

2026년 11월 1일, 시편 30:1–6. 저학년/고학년 하루치 시연입니다.

- 공개 화면: https://fastkorea12-png.github.io/bibletree-focus-preview/card-demo/
- 4면 카드: print.html?age=lower 또는 print.html?age=upper
- 실제 QR: assets/qr-lower.png, assets/qr-upper.png 및 SVG
- 웹 활동 2개: 단어 카드 옮기기(드래그/터치/키보드), 선택하기
- 지면 활동 3개: 저학년 OX/선택/따라 쓰기, 고학년 연결/선택/감사 문장
- 원고는 집필 폴더 2026-11-01 JSON에서 가져왔습니다. 웹 활동과 카드용 요약은 시연에 맞게 변형했습니다.
- card-*.png는 이전 디자인 참고이며 QR이 비어 있습니다. 실제 인쇄는 print.html을 사용하세요.
- 입력은 localStorage에만 저장합니다. 계정, 서버 저장, 날짜별 자동 발행은 연결하지 않았습니다.
- 웹툰은 오늘의 삶에 적용한 창작 이야기입니다. 슬픔의 즉각적 해결을 약속하지 않습니다.
- 인쇄 파일은 55×85mm 카드 시연용입니다. 인쇄소용 도련/색상/폰트 마감은 별도입니다.

## 실행

저장소 루트에서 python3 -m http.server 8937 실행 후 /card-demo/를 엽니다. 파일 직접 열기는 JSON fetch 때문에 지원하지 않습니다.

## 그림 생성

내장 image_gen 도구로 웹툰을 제작했습니다. 최종 프롬프트:

```text
Use case: illustration-story
Asset type: Korean BibleTree children's devotional mobile vertical webtoon, original artwork
Create one polished vertical comic image with exactly SIX equally tall rectangular panels stacked top to bottom, no side-by-side panels, consistent 10-year-old Korean girl with short dark bob hair, mint green hoodie and yellow backpack. Contemporary clean anime webtoon linework, warm flat colors, generous white gutters. No text, no lettering, no speech bubbles, no logos, no watermark. Each panel is a complete scene.
Panel1: at school dusk, her best friend waves goodbye holding a moving box; girl sad, slight tears, affectionate goodbye not conflict.
Panel2: girl at bedroom window at night, tears, looking at an open notebook, navy moonlight, safe cozy room with potted sprout.
Panel3: same girl remembering her mother comforting her, warm amber flashback glow, realistic humans only.
Panel4: morning sunlight at same desk, she reads an open Bible with small blank lined pages, still thoughtful rather than suddenly cheerful.
Panel5: girl closes eyes praying at desk, gentle hopeful expression, hands together, potted sprout, mint and yellow light.
Panel6: girl and mother sitting together talking and holding hands, notebook open on table, quiet gentle smile. Missing friend is still absent, sadness hasn't magically disappeared.
Layout: vertical 1024x3072 or equivalent, all six panels same height, clear sequential continuity, professionally illustrated comic suitable ages6–12. Not ornate trading card art, not watercolor, no deity visible, no supernatural instant cure. Emotional theme gratitude and prayer while sadness remains, Psalm30.
```

