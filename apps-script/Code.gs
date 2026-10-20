/**
 * ㈜나우리해운항공 홈페이지 문의 접수 (Google Apps Script 웹앱)
 *
 * 흐름: 홈페이지 폼(form.js) → POST(JSON, Content-Type: text/plain)
 *       → '문의접수' 시트에 1행 추가 → 담당자 메일 알림 → {"ok": true}
 *
 * 배포 방법은 README.md "문의 폼 연결 (Google Apps Script)" 참고.
 */

// ===== 설정 =====
// TODO: 문의 알림을 받을 메일 주소 확인 필요 (여러 명이면 쉼표로 구분: 'a@x.com,b@x.com')
const NOTIFY_TO = '';

// 시트에 바인딩된 스크립트(시트 > 확장 프로그램 > Apps Script)로 만들면 비워 둠.
// 독립 스크립트로 만들 때만 스프레드시트 ID를 적음 (URL의 /d/ 와 /edit 사이 값).
const SPREADSHEET_ID = '';

const SHEET_NAME = '문의접수';
const MESSAGE_MAX = 2000;   // 문의내용 최대 글자 수
const FIELD_MAX = 200;      // 그 외 텍스트 칸 최대 글자 수
const TYPES = ['해상 LCL', '해상 FCL', '항공', '기타'];
const HEADERS = [
  '접수시각', '회사명', '담당자명', '이메일', '연락처', '문의유형', 'POL', 'POD',
  '품목', 'CBM', 'KG', 'PKG', '희망선적일', '문의내용', '처리상태', '담당자', '회신일'
];

// ===== 웹앱 진입점 =====
function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) return json_({ ok: false });
    const d = JSON.parse(raw);

    // 스팸 방지(숨김 칸에 값이 있으면 저장하지 않고 성공처럼 응답)
    if (d.website) return json_({ ok: true });

    const row = buildRow_(d);
    if (!row) return json_({ ok: false });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet_().appendRow(row);
    } finally {
      lock.releaseLock();
    }

    // 메일 실패는 접수 실패로 보지 않음 (시트에는 이미 기록됨)
    try {
      notify_(row);
    } catch (mailErr) {
      console.error('메일 발송 실패: ' + mailErr);
    }

    return json_({ ok: true });
  } catch (err) {
    console.error('doPost 오류: ' + err);
    return json_({ ok: false });
  }
}

// 배포 확인용: 웹앱 URL을 브라우저로 열면 {"ok":true,"service":"nauri-inquiry"} 표시
function doGet() {
  return json_({ ok: true, service: 'nauri-inquiry' });
}

// ===== 행 만들기 =====
function buildRow_(d) {
  const company = text_(d.company, FIELD_MAX);
  const name = text_(d.name, FIELD_MAX);
  const email = text_(d.email, FIELD_MAX);
  const phone = text_(d.phone, FIELD_MAX);
  const message = text_(d.message, MESSAGE_MAX);

  // 서버 쪽 최소 검증 (화면 검증과 같은 기준)
  if (!company || !name || !phone || message.length < 10) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const type = TYPES.indexOf(d.type) >= 0 ? d.type : '기타';
  const etd = /^\d{4}-\d{2}-\d{2}$/.test(String(d.etd || '')) ? String(d.etd) : '';

  return [
    new Date(),                       // 접수시각 (서버 시각, 시트 시간대 기준)
    safe_(company),
    safe_(name),
    safe_(email),
    safe_(phone),
    type,
    safe_(text_(d.pol, FIELD_MAX)),
    safe_(text_(d.pod, FIELD_MAX)),
    safe_(text_(d.item, FIELD_MAX)),
    num_(d.cbm),
    num_(d.kg),
    num_(d.pkgs),
    etd ? "'" + etd : '',             // 날짜를 글자 그대로 보존
    safe_(message),
    '신규',                           // 처리상태
    '',                               // 담당자 (사내 입력)
    ''                                // 회신일 (사내 입력)
  ];
}

// 문자열 정리 + 길이 제한
function text_(v, max) {
  if (v === null || v === undefined) return '';
  return String(v).trim().slice(0, max);
}

// 수식 주입 방지: =, +, -, @ 로 시작하면 앞에 ' 를 붙여 글자로 저장
function safe_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// 0 이상 숫자만 저장, 그 외는 빈칸
function num_(v) {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  return isFinite(n) && n >= 0 ? n : '';
}

// ===== 시트 =====
function getSheet_() {
  const ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  }
  return sh;
}

// 편집기에서 한 번 실행: 시트·제목 행 만들기 + 권한 승인
function setup() {
  getSheet_();
  if (NOTIFY_TO) MailApp.getRemainingDailyQuota(); // 메일 권한 승인 유도
}

// ===== 메일 알림 =====
function notify_(row) {
  if (!NOTIFY_TO) {
    console.warn('NOTIFY_TO가 비어 있어 메일을 보내지 않았습니다.');
    return;
  }
  const v = row.map(function (x) {
    if (x instanceof Date) return Utilities.formatDate(x, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
    return String(x).replace(/^'/, '');
  });
  const oneLine = function (s) { return s.replace(/[\r\n]+/g, ' '); };
  const subject = '[홈페이지 문의] ' + v[5] + ' - ' + oneLine(v[1]);
  const lines = [];
  for (let i = 0; i < 14; i++) lines.push(HEADERS[i] + ': ' + (v[i] === '' ? '-' : v[i]));
  const body = lines.join('\n') + '\n\n문의접수 시트에서 처리상태·담당자·회신일을 입력해 주세요.';

  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: subject,
    body: body,
    replyTo: v[3],
    name: '나우리해운항공 홈페이지'
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== 편집기 테스트용 (배포 전 확인) =====
function testDoPost() {
  const res = doPost({
    postData: {
      contents: JSON.stringify({
        company: '테스트상사', name: '홍길동', email: 'test@example.com', phone: '010-1234-5678',
        type: '해상 LCL', pol: 'Busan', pod: 'Shanghai', item: '기계부품',
        cbm: 2.5, kg: 800, pkgs: 3, etd: '2026-12-01',
        message: '=테스트 문의입니다. 시트 기록과 메일 도착을 확인합니다.',
        status: '신규', createdAt: new Date().toISOString()
      })
    }
  });
  console.log(res.getContent());
}
