# ㈜나우리해운항공 랜딩페이지

㈜나우리해운항공(Nauri Logistics Co., Ltd.) 회사 소개 랜딩페이지입니다.
HTML + CSS + 순수 JavaScript 정적 사이트(빌드 없음)이며, Contact Us 문의는 Google Apps Script를 거쳐 구글 시트에 기록되고 담당자에게 메일로 알립니다.

명세: [`docs/spec.md`](docs/spec.md)

## 파일

| 경로 | 내용 |
|---|---|
| `index.html` | 랜딩페이지 |
| `privacy.html` | 개인정보처리방침 (미확정 항목 TODO) |
| `assets/css/style.css` | 스타일 (나우리 디자인 시스템 색·서체) |
| `assets/js/main.js` | 애니메이션·스크롤 효과 |
| `assets/js/form.js` | 문의 폼 검증·전송 (`ENDPOINT` 상수) |
| `assets/img/` | 로고 PNG (국문 `logo-ko`, 영문 `logo-en`, 심볼 `logo-mark` = 파비콘) |
| `apps-script/Code.gs` | 문의 접수용 Apps Script |
| `.nojekyll` | GitHub Pages에서 Jekyll 처리 끄기 |

## 오픈 전 확인 필요 (TODO)

화면에는 "확인 필요"로 보이고, 코드에는 `TODO:` 주석이 달려 있습니다. `grep -rn "TODO" .` 로 전체 위치를 볼 수 있습니다.

| # | 항목 | 화면 위치 | 파일 |
|---|---|---|---|
| 1 | 설립연도, 연간 물량, 파트너 수 | 회사 소개 카드 | `index.html` |
| 2 | 슬로건 사용 여부 | Hero | `index.html` |
| 3 | 강점 4개 최종 확정 | 강점 | `index.html` |
| 4 | 일본 노출 항구 목록 | 주력 지역 | `index.html` |
| 5 | 중국·동남아 항구 현재 서비스 여부 | 주력 지역 | `index.html` |
| 6 | 본사·부산 사무소 현재 주소 | Contact, Footer | `index.html` |
| 7 | 문의 메일 주소, 운영 시간 | Contact | `index.html` |
| 8 | Apps Script 웹앱 URL | – | `assets/js/form.js` (`ENDPOINT`) |
| 9 | 사업자등록번호 | Footer | `index.html` |
| 10 | 개인정보 보유 기간 | 폼 "내용 보기", 개인정보처리방침 | `index.html`, `privacy.html` |
| 11 | 개인정보처리방침 전문 (파기 운영, 처리 위탁·국외 이전, 보호책임자, 시행일), 법무 검토 | 개인정보처리방침 | `privacy.html` |
| 12 | 로고 원본 파일(AI·SVG), 로고 블루와 primary 색 통일 | 상단, Footer | `assets/img/` |
| 13 | OG 이미지 1200×630 (`assets/img/og-image.png`) | 링크 공유 썸네일 | `index.html` head |
| 14 | 도메인, 호스팅 → canonical·og:url | – | `index.html` head |

## 문의 폼 연결 (Google Apps Script)

### 1) 시트와 스크립트 만들기
1. 구글 드라이브에서 새 스프레드시트를 만듭니다. 예: `나우리 홈페이지 문의`
2. 시트 메뉴 **확장 프로그램 → Apps Script**를 엽니다.
3. 기본 `Code.gs` 내용을 지우고 `apps-script/Code.gs`를 통째로 붙여 넣습니다.
4. 맨 위 `NOTIFY_TO`가 알림 받을 메일 주소입니다. (현재 `regina.yi.sy@gmail.com`, 여러 명이면 쉼표로 구분)
5. 왼쪽 **⚙ 프로젝트 설정 → 시간대**를 `(GMT+09:00) 서울`로 맞춥니다. 접수시각 기준입니다.
6. 저장 후, 위쪽 함수 선택에서 `setup`을 고르고 **실행**합니다.
   - 권한 승인 창이 뜨면 본인 계정으로 허용합니다. ("확인되지 않은 앱" 경고가 나오면 고급 → 이동)
   - 시트에 `문의접수` 탭과 제목 행 17칸이 생깁니다.

### 2) 웹앱 배포
1. 오른쪽 위 **배포 → 새 배포**
2. 유형 선택 ⚙ → **웹 앱**
3. 설정
   - 설명: `홈페이지 문의 v1`
   - 다음 사용자 인증 정보로 실행: **나**
   - 액세스 권한이 있는 사용자: **모든 사용자**
4. **배포** → 나온 **웹 앱 URL**(`https://script.google.com/macros/s/…/exec`)을 복사합니다.
5. URL을 브라우저 주소창에 열어 `{"ok":true,"service":"nauri-inquiry"}`가 보이면 정상입니다.

### 3) 사이트에 연결
`assets/js/form.js` 맨 위 상수에 URL을 넣고 커밋·푸쉬합니다.

```js
const ENDPOINT = 'https://script.google.com/macros/s/…/exec';
```

### 4) 테스트
- 편집기에서 `testDoPost` 실행 → 시트에 1행 추가 + 메일 도착 확인 (문의내용이 `=`로 시작해도 글자로 저장되는지 확인)
- 배포된 사이트에서 테스트 문의 1건 제출 → 같은 결과 확인 후 테스트 행 삭제

### 코드를 고친 뒤 다시 배포할 때
**배포 → 배포 관리 → ✏ 편집 → 버전: 새 버전 → 배포.** 이렇게 하면 URL이 바뀌지 않습니다. ("새 배포"를 다시 만들면 URL이 바뀌므로 `ENDPOINT`도 바꿔야 합니다.)

### 시트 열

| 접수시각 | 회사명 | 담당자명 | 이메일 | 연락처 | 문의유형 | POL | POD | 품목 | CBM | KG | PKG | 희망선적일 | 문의내용 | 처리상태 | 담당자 | 회신일 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

- 처리상태는 `신규`로 들어갑니다. 담당자·회신일은 사내에서 직접 입력합니다.
- 보안 처리: `=`, `+`, `-`, `@`로 시작하는 값은 앞에 `'`를 붙여 수식으로 실행되지 않게 저장. 문의내용 2,000자, 그 외 칸 200자로 자름. 숨김 스팸 방지 칸에 값이 있으면 저장하지 않음.
- 메일 제목: `[홈페이지 문의] {문의유형} - {회사명}`. 회신(Reply)을 누르면 문의자 이메일로 갑니다.

## 배포 (GitHub Pages)

1. GitHub 저장소 **Settings → Pages**
2. Source: **Deploy from a branch**, Branch: **main** / **/(root)** → Save
3. 1~2분 뒤 `https://reginayisy-lab.github.io/websitetest/` 에서 확인
4. 회사 도메인을 쓸 경우: Pages의 **Custom domain**에 도메인 입력 → 도메인 업체 DNS에 CNAME(`reginayisy-lab.github.io`) 등록 → **Enforce HTTPS** 체크. 이후 `index.html`의 canonical·og:url TODO 주석을 해제합니다.

> 공개 저장소의 GitHub Pages는 누구나 볼 수 있습니다. 개인정보처리방침 등 TODO가 정리되기 전에는 테스트 용도로만 쓰는 것을 권장합니다.

## 배포 전 점검 목록

- [ ] 375 / 768 / 1440px에서 시안과 동일, 가로 스크롤 없음
- [ ] 메뉴·버튼 앵커 이동, 서비스 카드 링크 → 문의 유형 자동 선택
- [ ] 폼 오류 문구가 `docs/spec.md` 5번과 동일
- [ ] 테스트 문의 1건이 시트에 기록되고 메일 도착
- [ ] OS "동작 줄이기" 설정 시 애니메이션 꺼짐
- [ ] AEO 문구·페리(FERRY) LCL 미포함
- [ ] 위 TODO 표 정리
