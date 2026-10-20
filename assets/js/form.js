/* 나우리해운항공 랜딩페이지 — Contact Us 문의 폼 (검증·전송·결과 표시) */
(function () {
  const form = document.getElementById('inquiry');
  if (!form) return;
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit');

  // 서비스 카드의 "문의" 링크로 들어오면 문의 유형을 미리 선택
  document.querySelectorAll('a[data-type]').forEach(a => {
    a.addEventListener('click', () => {
      const r = form.querySelector('input[name="type"][value="' + a.dataset.type + '"]');
      if (r) r.checked = true;
    });
  });

  function setErr(id, msg) {
    const err = document.getElementById(id + '-err');
    const field = document.getElementById(id).closest('.field');
    if (err) err.textContent = msg || '';
    if (field) field.classList.toggle('invalid', !!msg);
    return !msg;
  }

  function validate() {
    const v = id => document.getElementById(id).value.trim();
    let ok = true, first = null;
    const check = (id, msg) => { const good = setErr(id, msg); if (!good && !first) first = id; ok = ok && good; };
    check('company', v('company') ? '' : '회사명을 입력해 주세요.');
    check('name', v('name') ? '' : '담당자명을 입력해 주세요.');
    const em = v('email');
    check('email', !em ? '이메일을 입력해 주세요.' : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em) ? '' : '이메일 형식을 확인해 주세요. 예: name@company.com'));
    const ph = v('phone');
    check('phone', !ph ? '연락처를 입력해 주세요.' : (/^[0-9+\-\s()]{8,}$/.test(ph) ? '' : '숫자와 하이픈(-)만 입력해 주세요.'));
    ['cbm', 'kg', 'pkgs'].forEach(id => { const n = v(id); check(id, n && (isNaN(+n) || +n < 0) ? '0 이상 숫자로 입력해 주세요.' : ''); });
    const d = v('etd');
    if (d) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      check('etd', new Date(d + 'T00:00:00') < today ? '오늘 이후 날짜를 선택해 주세요.' : '');
    } else setErr('etd', '');
    check('message', v('message').length >= 10 ? '' : '문의 내용을 10자 이상 입력해 주세요.');
    check('consent', document.getElementById('consent').checked ? '' : '개인정보 수집·이용에 동의해 주세요.');
    if (first) document.getElementById(first).focus();
    return ok;
  }

  form.addEventListener('input', e => {
    const f = e.target.closest('.field');
    if (f && f.classList.contains('invalid') && e.target.id) setErr(e.target.id, '');
  });

  function showStatus(kind, html) {
    statusEl.className = 'status status--' + kind;
    statusEl.innerHTML = html;
  }

  // TODO(5단계): Google Apps Script 웹앱 ENDPOINT로 전송 (text/plain, 10초 타임아웃).
  // 지금은 연결 전이라 항상 false → 실패 메시지가 표시됩니다.
  async function sendInquiry(data) {
    return false;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    statusEl.className = ''; statusEl.textContent = '';
    if (document.getElementById('website').value) return; // honeypot
    if (!validate()) return;

    const data = {
      company: form.company.value.trim(),
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      type: form.querySelector('input[name="type"]:checked').value,
      pol: form.pol.value.trim(),
      pod: form.pod.value.trim(),
      item: form.item.value.trim(),
      cbm: form.cbm.value ? +form.cbm.value : null,
      kg: form.kg.value ? +form.kg.value : null,
      pkgs: form.pkgs.value ? +form.pkgs.value : null,
      etd: form.etd.value || null,
      message: form.message.value.trim()
    };

    submitBtn.disabled = true; submitBtn.classList.add('loading'); submitBtn.textContent = '보내는 중…';
    let saved = false;
    try { saved = await sendInquiry(data); } catch (err) { saved = false; }
    submitBtn.disabled = false; submitBtn.classList.remove('loading'); submitBtn.textContent = '문의 보내기';

    if (saved) {
      const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      showStatus('ok', '<svg class="check" viewBox="0 0 28 28" fill="none" stroke="#0057d2" stroke-width="2" aria-hidden="true"><circle cx="14" cy="14" r="12"/><path d="M8 14.5l4 4 8-8"/></svg><strong>문의가 접수되었습니다.</strong><span>' + esc(data.type) + ' 문의 · ' + esc(data.company) + ' ' + esc(data.name) + ' 님. 담당자가 확인 후 ' + esc(data.email) + '(으)로 답변드립니다.</span>');
      form.reset();
      document.getElementById('type-lcl').checked = true;
    } else {
      showStatus('warn', '<strong>문의를 저장하지 못했습니다.</strong><span>입력하신 내용은 그대로 남아 있습니다. 급한 문의는 서울 본사 02-737-9090으로 연락해 주세요.</span>');
    }
  });
})();
