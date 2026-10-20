# 나우리해운항공 랜딩페이지 — Claude Code 작업 명세

## 0. 작업 요청 (Claude Code에 먼저 전달)

㈜나우리해운항공(Nauri Logistics Co., Ltd.) 회사 랜딩페이지를 정적 웹사이트로 만들어 줘.
- 참고 시안: `nauri-landing.html` (같은 폴더에 둠). 화면·문구·애니메이션은 이 시안과 동일하게 유지.
- 아래 명세를 기준으로 구현하고, 명세와 시안이 다르면 명세를 따를 것.
- "확인 필요"로 표시된 값은 임의로 채우지 말고 `TODO:` 주석과 함께 그대로 둘 것.
- AEO 마크·인증 문구는 절대 넣지 말 것. 페리(FERRY) LCL 구간은 넣지 말 것.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 목적 | 방문자가 회사 소개·서비스·강점을 파악하고 견적·운송 문의를 남기게 함 |
| 형태 | 단일 페이지(One-page), 국문, 모바일 대응 |
| 핵심 행동 | Contact Us 폼 제출 |
| 기술 | HTML + CSS + 순수 JavaScript (프레임워크·빌드 도구 없음) |
| 배포 | 정적 호스팅(Vercel / Netlify / GitHub Pages 중 택1 — 확인 필요) |
| 문의 저장 | Google Apps Script 웹앱 → Google Sheets 1행 기록 + 담당자 메일 알림 |

## 2. 파일 구조

```
/
├─ index.html
├─ assets/
│  ├─ css/style.css
│  ├─ js/main.js          # 스크롤·애니메이션
│  ├─ js/form.js          # 문의 폼 검증·전송
│  └─ img/
│     ├─ logo-ko.png      # 국문 로고 (심볼 + ㈜나우리해운항공)
│     ├─ logo-en.png      # 영문 로고 (Nauri Logistics Co., Ltd.)
│     └─ og-image.png     # 공유 썸네일 1200x630 (TODO)
├─ privacy.html           # 개인정보처리방침 (TODO: 내용 확인 필요)
└─ apps-script/Code.gs    # 문의 접수용 Apps Script
```

로고: 시안 HTML에 base64로 내장된 PNG를 `assets/img/`로 분리. 원본(AI·SVG) 받으면 교체.

## 3. 화면 구조 (위 → 아래)

| 순서 | 섹션 | 앵커 ID | 비고 |
|---|---|---|---|
| 0 | 상단 진행 바 | – | 스크롤 비율 표시, 화면 맨 위 고정 3px |
| 1 | 상단 메뉴 | – | sticky. 국문 로고, 메뉴 4개, [견적 문의] 버튼 |
| 2 | Hero | `top` | 헤드라인 + LCL 콘솔 도식 |
| 3 | 항구 띠 | – | navy 배경, 항구명 흐름 |
| 4 | 회사 소개 | `about` | 소개 문단 + 요약 카드 4칸 |
| 5 | 서비스 | `services` | 카드 6개 + 연계 서비스 |
| 6 | 강점 | `strengths` | 4개, 2열 |
| 7 | 주력 지역 | `regions` | 중국·일본·동남아 카드 |
| 8 | Contact Us | `contact` | 사무소 정보 + 문의 폼 |
| 9 | Footer | – | 영문 로고, 상호, 주소, 연락처 |
| – | 모바일 하단 버튼 | – | 860px 이하에서만, 하단 고정 [견적 문의] |

모든 [견적 문의] 버튼은 `#contact`로 이동.

## 4. 섹션별 콘텐츠 (문구 그대로 사용)

### 4-1. 상단 메뉴
- 메뉴: 회사소개(#about) · 서비스(#services) · 강점(#strengths) · 주력 지역(#regions)
- 버튼: 견적 문의(#contact)

### 4-2. Hero
- eyebrow: `LCL Consolidator · Sea & Air Forwarder`
- 헤드라인(3줄): `작은 화물도` / `한 컨테이너처럼` / `정확하게.` — "한 컨테이너"만 primary 색
- 리드: `상해·일본·동남아 LCL을 중심으로 해상·항공 운송을 제공하는 국제물류주선업체, ㈜나우리해운항공입니다.`
- 버튼: [견적 문의하기 →](#contact), [서비스 보기](#services, outline)
- 슬로건: `We Carry Customer's Mind — 고객의 마음을 운송합니다.` (TODO: 사용 여부 확인 필요)
- 오른쪽 도식(SVG): 화주 A 2.4 CBM / B 5.1 CBM / C 1.2 CBM / D 3.8 CBM → CFS → 20'/40' 컨테이너 1개 · 12.5 CBM, "ETD 맞춰 콘솔 선적"
  - 도식 하단: `운임은 R/T(1 CBM 또는 1 TON 중 큰 값) 기준으로 산정합니다.`
  - 캡션: `LCL 콘솔: 여러 화주의 소량 화물을 CFS에서 모아 하나의 컨테이너로 선적합니다. (수치는 예시)`

### 4-3. 항구 띠
Shanghai · Qingdao · Xingang · Hong Kong · Singapore · Bangkok · Jakarta · Port Kelang · Manila

### 4-4. 회사 소개
- 제목: `LCL 콘솔을 중심으로 해상·항공 운송 전반을 맡습니다.`
- 문단 1: `㈜나우리해운항공은 LCL 콘솔리데이터로서 소량 화물의 해상 운송을 주력으로 하며, FCL·항공·프로젝트 화물과 통관·내륙운송·창고 연계까지 수출입 물류를 한 창구에서 처리합니다.`
- 문단 2: `서울 본사와 부산 사무소가 함께 화물을 관리하며, 견적부터 B/L·도착지 업무까지 담당자가 끝까지 챙깁니다.`
- 요약 카드 4칸

| 라벨 | 값 | 보조 문구 |
|---|---|---|
| 주력 서비스 | 해상 LCL 콘솔 | FCL · 항공 · 프로젝트 화물 |
| 주력 지역 | 상해 · 일본 · 동남아 | – |
| 거점 | 서울 본사 · 부산 사무소 | 부산 CFS 연락 창구 운영 |
| 설립연도 | TODO: 확인 필요 | 연간 물량·파트너 수도 확인 필요 |

### 4-5. 서비스
- 제목: `화물 크기와 일정에 맞는 운송 방식을 제안합니다.`

| 코드 라벨 | 제목 | 설명 | 링크 문구 | 링크 클릭 시 선택할 문의 유형 |
|---|---|---|---|---|
| SEA · LCL | 해상 LCL 콘솔 | 컨테이너 하나를 채우지 않는 소량 화물을 CFS에서 모아 정기 스케줄로 선적합니다. 운임은 R/T 기준입니다. | LCL 견적 문의 › | 해상 LCL |
| SEA · FCL | 해상 FCL | 항로 상황을 보고 경제성·안전성을 따져 컨테이너 단위 화물에 맞는 Route를 제시합니다. | FCL 견적 문의 › | 해상 FCL |
| AIR | 항공 운송 | 긴급·고가 화물의 항공 수출입과 각 공항 통관·운송 업무를 대행합니다. | 항공 견적 문의 › | 항공 |
| SEA & AIR | Sea & Air | 해상으로 경유지까지 보낸 뒤 항공으로 연결해 운송 기간과 비용의 균형을 맞춥니다. | 문의하기 › | 기타 |
| DOOR TO DOOR | Door to Door · 삼국간 운송 | 수출화주 문전에서 수입화주 문전까지, 제3국 간 거래 화물의 서류와 운송을 일괄 처리합니다. | 문의하기 › | 기타 |
| PROJECT | 프로젝트 화물 | 플랜트·중량·초장척 화물의 운송 경로 조사, 수출포장, Lashing & Securing까지 지원합니다. | 문의하기 › | 기타 |

- 첫 카드(LCL)만 navy 배경 강조.
- 연계 서비스 한 줄: 통관(Customs Clearance) · 내륙운송(Inland Trucking) · 창고·보관(Warehousing) · 포장·팔레타이징 · Buyer's Consolidation

### 4-6. 강점
- 제목: `LCL에 집중해 온 포워더입니다.` (TODO: 강점 4개 최종 확정 필요)

| 제목 | 설명 | 아이콘(단색 선) |
|---|---|---|
| LCL 콘솔 전문 | 소량 화물을 모아 선적하는 LCL 콘솔이 주력입니다. 1 CBM 단위 화물도 정기 스케줄로 보냅니다. | 컨테이너 |
| 상해·일본·동남아 주력 | 물량이 많은 근거리 아시아 항로에 집중해 스케줄과 운임을 안정적으로 운영합니다. | 지구 |
| 지역별 전담 업무팀 | 동남아 등 지역별 담당자가 S/R 접수부터 B/L, 도착지 D/O 업무까지 이어서 관리합니다. | 건물 |
| 해상·항공·프로젝트 원스톱 | LCL·FCL·항공·프로젝트 화물에 통관·내륙운송까지 한 창구에서 처리합니다. | 트럭 |

### 4-7. 주력 지역
- 제목: `상해 · 일본 · 동남아`
- 설명: `한국 출항 LCL 기준 주요 도착항입니다. 기타 지역도 문의 주시면 안내해 드립니다.`

| 지역 | 항구 (UN/LOCODE) |
|---|---|
| 중국 CHINA | Shanghai (CNSHA), Qingdao (CNTAO), Xingang (CNTXG), Hong Kong (HKHKG) |
| 일본 JAPAN | TODO: 노출 항구 목록 확인 필요 |
| 동남아 SOUTHEAST ASIA | Singapore (SGSIN), Bangkok (THBKK), Jakarta (IDJKT), Port Kelang (MYPKG), Manila (PHMNL) |

- 하단 캡션: `스케줄·운임은 시기에 따라 달라지므로 문의 시 최신 기준으로 안내해 드립니다.`
- 항구 목록은 기존 사이트 기준 — TODO: 현재 서비스 여부 확인 필요

### 4-8. Contact Us
- 제목: `견적·운송 문의를 남겨 주세요.`
- 설명: `담당자가 확인 후 남겨 주신 이메일 또는 연락처로 답변드립니다.`
- 왼쪽 사무소 정보 (TODO: 현재 주소 확인 필요)

| 구분 | 전화 | FAX | 주소 |
|---|---|---|---|
| 서울 본사 | 02-737-9090 | 02-738-1020 | 서울시 영등포구 양평동3가 13번지 이노플렉스빌딩 10층 |
| 부산 사무소 | 051-442-4473 | 051-442-4493 | 부산 중구 중앙동4가 74-7 한국선원센터 6층 604호 |
| 문의 메일 · 운영 시간 | TODO: 확인 필요 | | |

- 전화번호는 `tel:` 링크로 연결.

### 4-9. Footer
- 영문 로고, `㈜나우리해운항공`
- 본사 주소 · TEL 02-737-9090 · FAX 02-738-1020 · 사업자등록번호 TODO: 확인 필요
- 개인정보처리방침 링크(privacy.html) · © Nauri Logistics Co., Ltd.

## 5. Contact Us 폼

### 5-1. 필드

| 라벨 | name | type | 필수 | 오류 문구 |
|---|---|---|---|---|
| 회사명 | company | text | O | 회사명을 입력해 주세요. |
| 담당자명 | name | text | O | 담당자명을 입력해 주세요. |
| 이메일 | email | email | O | 이메일 형식을 확인해 주세요. 예: name@company.com |
| 연락처 | phone | tel | O | 숫자와 하이픈(-)만 입력해 주세요. (8자 이상) |
| 문의 유형 | type | radio: 해상 LCL / 해상 FCL / 항공 / 기타 | O | 기본값 해상 LCL |
| 출발지 (POL) | pol | text | – | placeholder `예: Busan` |
| 도착지 (POD) | pod | text | – | placeholder `예: Shanghai` |
| 품목 | item | text | – | – |
| 부피 (CBM) | cbm | number, step 0.01, min 0 | – | 0 이상 숫자로 입력해 주세요. |
| 중량 (KG) | kg | number, step 0.1, min 0 | – | 0 이상 숫자로 입력해 주세요. |
| 포장 수 (PKG) | pkgs | number, step 1, min 0 | – | 0 이상 숫자로 입력해 주세요. |
| 희망 선적일 | etd | date | – | 오늘 이후 날짜를 선택해 주세요. |
| 문의 내용 | message | textarea | O | 문의 내용을 10자 이상 입력해 주세요. |
| 개인정보 동의 | consent | checkbox | O | 개인정보 수집·이용에 동의해 주세요. |
| (스팸 방지) | website | 숨김 text | – | 값이 있으면 전송하지 않음 |

- 문의 내용 placeholder: `화물 특성, 인코텀즈(FOB, DAP 등), 필요한 서비스를 적어 주세요.`
- 개인정보 동의 "내용 보기": 수집 항목(회사명, 담당자명, 이메일, 연락처) / 이용 목적(견적·운송 문의 답변) / 보유 기간(TODO: 확인 필요)

### 5-2. 동작
1. 제출 시 브라우저 기본 검증 끄고(`novalidate`) JS로 검증. 오류는 각 칸 아래 표시, 첫 오류 칸에 포커스.
2. 통과 시 버튼 비활성 + "보내는 중…"
3. Apps Script 웹앱 URL로 `fetch` POST (JSON). URL은 `form.js` 상단 상수 `ENDPOINT`로 분리.
4. 성공: 체크 아이콘 + `문의가 접수되었습니다.` + `{유형} 문의 · {회사명} {담당자명} 님. 담당자가 확인 후 {이메일}(으)로 답변드립니다.` → 폼 초기화
5. 실패: `문의를 저장하지 못했습니다.` + `입력하신 내용은 그대로 남아 있습니다. 급한 문의는 서울 본사 02-737-9090으로 연락해 주세요.` → 입력값 유지
6. 결과 영역은 `role="status" aria-live="polite"`

### 5-3. 전송 데이터
```json
{
  "company": "", "name": "", "email": "", "phone": "",
  "type": "해상 LCL", "pol": "", "pod": "", "item": "",
  "cbm": null, "kg": null, "pkgs": null, "etd": null,
  "message": "", "status": "신규", "createdAt": "ISO 8601"
}
```

### 5-4. Apps Script (apps-script/Code.gs)
- `doPost(e)`: JSON 파싱 → 시트 `문의접수`에 1행 추가(접수시각, 회사명, 담당자명, 이메일, 연락처, 유형, POL, POD, 품목, CBM, KG, PKG, 희망선적일, 문의내용, 처리상태=신규)
- 담당자 메일로 알림 발송(제목 예: `[홈페이지 문의] {유형} - {회사명}`). 수신 메일 주소 TODO: 확인 필요
- 응답: `{"ok": true}` / 오류 시 `{"ok": false}`
- CORS 회피를 위해 프론트는 `Content-Type: text/plain`으로 전송
- 배포 방법(웹앱 배포, 실행 권한 "나", 액세스 "모든 사용자")을 README에 적을 것

## 6. 디자인 기준 (나우리 디자인 시스템)

### 6-1. 색 토큰 (CSS 변수로 정의)
```css
:root {
  --primary: #0057d2;      /* 버튼·링크·eyebrow·진행 바 — 유일한 '행동' 색 */
  --primary-deep: #0040b0; /* hover, outline 버튼 라벨, 포커스 링 */
  --on-primary: #ffffff;
  --navy: #022879;         /* LCL 카드, 항구 띠, 도식 컨테이너 */
  --sky: #6bc0ff;          /* navy 위 라벨, 헤드라인 하이라이트. 흰 바탕 텍스트 금지 */
  --canvas: #ffffff;
  --chrome: #f5f6f7;       /* 서비스·Contact 밴드 */
  --band: #eaecee;         /* Footer */
  --band-blue: #ebf8ff;    /* Hero·주력 지역 밴드, 카드 hover */
  --ink: #000000;          /* 제목 */
  --ink-lead: #3c3c3c;     /* 리드 */
  --ink-body: #223548;     /* 본문 */
  --ink-list: #354a5f;     /* 리스트·카드 설명 */
  --ink-meta: #475e75;     /* 캡션 */
  --ink-nav: #545454;      /* 메뉴 */
  --hairline: #475e75;     /* outline 버튼·입력칸 테두리 */
  --line-soft: #d5dbe1;    /* 구분선 */
  --error: #b3261e;
}
```
- 밴드 배치: Hero(band-blue) → 항구 띠(navy) → 회사 소개(canvas) → 서비스(chrome) → 강점(canvas) → 주력 지역(band-blue) → Contact(chrome) → Footer(band)
- 두 번째 강조색, 그라데이션, 그림자 사용 금지. 깊이는 밴드 색으로 표현.
- 라이트 테마 단일.

### 6-2. 서체
- Noto Sans KR (Google Fonts, wght 300..700) 한 가족. 대체: "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif
- 자간 0, 제목 행간 1.1, 본문 1.5

| 역할 | 크기 / 굵기 |
|---|---|
| Hero 헤드라인 | 57px / 700 (900px 이하 40px) |
| 섹션 제목 | 32px / 500 |
| 리드 | 22px / 400 (900px 이하 19px) |
| 서비스·강점 제목 | 20px / 500 |
| 본문 | 18px / 400 |
| 카드 설명·리스트 | 15–16px / 350 |
| 버튼 | 16px / 500 |
| 메뉴 | 15px / 400 |
| eyebrow | 14px / 500, 대문자, 자간 0.06em, primary |
| 캡션 | 13–14px / 400 |

### 6-3. 간격·모서리
- 콘텐츠 최대 폭 1120px, 좌우 여백 최소 16px(`max(16px, env(safe-area-inset-*))`)
- 밴드 위아래 72px, 섹션 제목 → 본문 40px, 카드 간격 16px, 카드 안쪽 24px
- 모서리: 버튼·입력칸 8px / 카드·이미지 12px / 밴드 0px. pill 모양 금지

### 6-4. 로고
- 상단: logo-ko.png 높이 36px (스크롤 시·모바일 30px)
- Footer: logo-en.png 높이 27px
- TODO: 로고 블루와 primary 색 통일 여부 확인 필요

## 7. 애니메이션 (외부 라이브러리 없이 CSS + 순수 JS)

| # | 위치 | 효과 | 시점 | 시간 |
|---|---|---|---|---|
| 1 | 진행 바 | `scaleX(스크롤 비율)` | scroll (rAF) | 실시간 |
| 2 | 상단 메뉴 | 높이 64→56px, 로고 36→30px | scrollY > 24 | 0.3s |
| 3 | 메뉴 링크 | 현재 섹션 밑줄(scaleX) + primary 글자 | IntersectionObserver, rootMargin `-45% 0px -50% 0px` | 0.3s |
| 4 | Hero 헤드라인 | 줄별 mask 안에서 translateY(105%)→0 | 로드 | 0.9s, 줄마다 120ms |
| 5 | Hero 하이라이트 | "한 컨테이너" 아래 sky 줄 0→100% | 로드 1.1s 후 | 0.7s |
| 6 | Hero 기타 | eyebrow·리드·버튼·슬로건·도식 fade+rise 18px | 로드 | 0.8s, 110ms 간격 |
| 7 | 도식 화물 | 화주 박스 순서대로 6px 흔들림 | 상시 | 6s 주기, 300ms 간격 |
| 8 | 도식 연결선 | 점선 흐름(stroke-dashoffset) | 상시 | 1.2s 주기 |
| 9 | 도식 CFS | 확대 1.06 | 6s 주기 30% 지점 | – |
| 10 | 도식 컨테이너 | 박스가 위에서 떨어져 적입 → 유지 → 사라짐 | 상시 | 6s 주기, 180ms 간격 |
| 11 | CBM 숫자 | 0.0→12.5 카운트업(ease-out) | 2.1s 후, 6s마다 | 1.6s |
| 12 | 항구 띠 | 좌측으로 무한 흐름(목록 2벌 이어 붙여 -50%), hover 시 정지 | 상시 | 32s |
| 13 | 섹션 등장 | opacity 0→1 + translateY 28px→0, 형제 요소 90ms 간격 | 화면 진입 1회 | 0.7s |
| 14 | 강점 아이콘 | 선 그리기(stroke-dashoffset) / hover 시 흔들림 | 화면 진입 / hover | 1.4s / 0.6s |
| 15 | 지역 카드 항구 행 | 왼쪽에서 순차 등장(70ms 간격), hover 시 우측 6px + primary | 진입 / hover | 0.5s |
| 16 | 카드 hover | 서비스·지역 카드 translateY(-4px), 서비스 카드 배경 band-blue | hover | 0.25s |
| 17 | 버튼 | 화살표 4px 이동, 누르면 1px 내려감 | hover / active | 0.2s |
| 18 | 폼 | 유형 선택 pop(1.06), 오류 칸 shake, 접수 완료 체크 아이콘 선 그리기 | 각 동작 | 0.25–0.5s |

규칙
- 섹션 등장(#13)은 **로드 시 첫 화면 아래에 있는 요소에만** JS로 클래스를 붙여 적용. 첫 화면 내용은 처음부터 보여야 함.
- `prefers-reduced-motion: reduce`이면 모든 animation·transition 끄고 최종 상태로 표시.

## 8. 반응형

| 화면 폭 | 변경 |
|---|---|
| ≤ 900px | Hero 1단(도식 아래로), 서비스 2열, 지역 1열, Contact 1단, 헤드라인 40px |
| ≤ 860px | 메뉴 링크 숨김(로고 + 견적 문의만), 로고 30px, 회사 소개 1단, 하단 고정 [견적 문의] 표시, Footer 하단 여백 96px |
| ≤ 560px | 서비스 1열, 폼 2열 행 → 1열, 화물 정보 2열(품목은 전체 폭) |
| ≤ 460px | 회사 소개 요약 카드 1열 |

- 어느 폭에서도 가로 스크롤 없어야 함. 아이폰 safe-area 대응.

## 9. 접근성·SEO

- 글자 대비 4.5:1 이상. 포커스 링 `2px solid var(--primary-deep)`
- 모든 입력칸 `<label for>` 연결. 로고·도식 alt/aria-label. 장식 아이콘 `aria-hidden`
- `<html lang="ko">`, title: `㈜나우리해운항공 | LCL 콘솔 해상·항공 포워더`
- meta description: `상해·일본·동남아 LCL을 중심으로 해상·항공 운송을 제공하는 국제물류주선업체 ㈜나우리해운항공입니다.`
- Open Graph(og:title, og:description, og:image — 이미지 TODO)
- 키워드 반영: LCL 포워더, LCL 콘솔, 상해 LCL, 일본 LCL, 동남아 LCL

## 10. 완료 기준

- [ ] 시안(`nauri-landing.html`)과 화면·문구가 동일
- [ ] 375px / 768px / 1440px에서 레이아웃 깨짐·가로 스크롤 없음
- [ ] 메뉴·버튼 앵커 이동 정상, 서비스 카드 링크가 문의 유형 자동 선택
- [ ] 폼 검증 오류 문구가 명세대로 표시
- [ ] 테스트 문의 1건이 구글 시트에 기록되고 담당자 메일이 도착
- [ ] 동작 줄이기 설정에서 애니메이션 꺼짐
- [ ] AEO 문구·페리 LCL 미포함
- [ ] `TODO:` 항목 목록을 README에 정리

## 11. 확인 필요 (TODO) 목록

| 항목 | 위치 |
|---|---|
| 설립연도, 연간 물량, 파트너 수 | 회사 소개 카드 |
| 슬로건 사용 여부 | Hero |
| 강점 4개 최종 확정 | 강점 |
| 일본 노출 항구 / 중국·동남아 항구 현재 서비스 여부 | 주력 지역 |
| 본사·부산사무소 현재 주소 | Contact, Footer |
| 문의 접수 메일 주소, 운영 시간 | Contact, Apps Script |
| 사업자등록번호 | Footer |
| 개인정보 보유 기간, 개인정보처리방침 전문 | 폼, privacy.html |
| 로고 원본 파일, 브랜드 색 통일 | 상단·Footer |
| 도메인, 호스팅 | 배포 |
| OG 이미지 | head |
