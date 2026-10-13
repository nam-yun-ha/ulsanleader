/* 상담 남기기 — 집 구하기 / 집 내놓기 (2026-10-14 대표님 — 더원부동산 상담 양식과 「이 단지 매물 접수」를 보시고 「이것도 좋은 거 같아」)
   모든 쪽이 이 파일 하나를 같이 쓴다: <div id="ask-slot"></div><script src="…/ask.js"></script>
   → 양식을 고칠 때 3,500쪽을 다시 만들 필요가 없다. 이 파일만 고쳐 올리면 된다.

   2026-10-14 대표님 「접수하는 사람 있으면 카톡으로 알림 오게」 — 「상담 접수하기」는 대표님 구글 설문지(울산부동산리더 상담 접수)로 보낸다.
   설문지 → 대표님 구글 시트 + 메일 알림 + (집 컴퓨터가 읽어) 카톡. 연락처를 받으므로 동의 체크가 있어야 보내진다(about.html 처리방침).
   「문자로 · 카톡으로 보내기」는 그대로 — 손님 휴대폰 앱에 글을 채워 손님이 직접 보낸다(그쪽은 저장하지 않는다).
   설문지 칸 번호(entry.N)는 설문지 질문을 지웠다 다시 만들면 바뀐다 — 그때는 FORM 을 고친다.
   쪽에 <meta name="ask-name" content="단지 이름"> 이 있으면 「단지명 · 주소」 칸에 미리 채운다.
   주소 끝이 #ask-sell 이면 「집 내놓기」, #ask-buy 면 「집 구하기」가 열린 채로 그 자리로 간다. */
(function () {
  var slot = document.getElementById("ask-slot");
  if (!slot || slot.dataset.on) return;
  slot.dataset.on = "1";
  var css = ".askf{background:var(--surface,#fff);border:1px solid var(--line,#DCE2E0);border-radius:12px;padding:18px 18px 16px;display:grid;gap:12px;color:var(--ink,#16211F);text-align:left;scroll-margin-top:110px}"
    + ".askf h3{margin:0;font-size:18px}.askf p{margin:0;font-size:13.5px;color:var(--ink-2,#4A5754)}"
    + ".askf .tabs{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line,#DCE2E0);border-radius:10px;overflow:hidden}"
    + ".askf .tabs button{font:inherit;font-weight:700;font-size:15.5px;padding:11px;border:0;background:var(--ground,#F3F5F4);color:var(--ink-2,#4A5754);cursor:pointer}"
    + ".askf .tabs button[aria-pressed=true]{background:var(--ink,#16211F);color:var(--surface,#fff)}"
    + ".askf .lb{font-size:13px;color:var(--ink-2,#4A5754);font-weight:700;margin-bottom:5px;display:block}"
    + ".askf .chips{display:flex;flex-wrap:wrap;gap:6px}"
    + ".askf .chips button{font:inherit;font-size:14.5px;padding:8px 14px;border:1px solid var(--line,#DCE2E0);border-radius:8px;background:var(--surface,#fff);color:var(--ink,#16211F);cursor:pointer}"
    + ".askf .chips button[aria-pressed=true]{background:var(--accent,#0E5E57);border-color:var(--accent,#0E5E57);color:#fff;font-weight:700}"
    + ".askf .row{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px}"
    + ".askf input,.askf textarea{font:inherit;font-size:16px;padding:10px 11px;border:1px solid var(--line,#DCE2E0);border-radius:8px;background:var(--ground,#F3F5F4);color:var(--ink,#16211F);width:100%;box-sizing:border-box}"
    + ".askf textarea{min-height:84px;resize:vertical}"
    + ".askf .send{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px}"
    + ".askf .send button{font:inherit;font-weight:700;font-size:15.5px;padding:12px;border-radius:8px;cursor:pointer;border:2px solid var(--accent,#0E5E57);background:var(--accent,#0E5E57);color:#fff}"
    + ".askf .send button.kk{background:#FEE500;border-color:#FEE500;color:#191600}"
    + ".askf .send button.go{grid-column:1/-1;font-size:17px;padding:14px}"
    + ".askf .send button.alt{background:var(--surface,#fff);color:var(--accent,#0E5E57)}"
    + ".askf .agree{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;color:var(--ink,#16211F);cursor:pointer}"
    + ".askf .agree input{width:18px;height:18px;margin:2px 0 0;flex:none}"
    + ".askf .msg{font-weight:700;color:var(--accent,#0E5E57);min-height:1.2em}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var FORM = "https://docs.google.com/forms/d/e/1FAIpQLScPr-azGIzYLVmkpiACDz7OPgmfXVFRCYbD4XcAkgb73LNh4w/formResponse";
  var ENTRY = { kind: "432173295", way: "595060766", where: "1434067243", when: "1189324679", name: "66856935", tel: "938775454", memo: "1558258926", page: "617788216" };
  var me = document.currentScript || document.querySelector('script[src$="ask.js"]');
  var ROOT = me && me.getAttribute("src") ? me.getAttribute("src").replace(/ask\.js.*$/, "") : "";
  var WAYS = { buy: ["매수", "전세", "월세"], sell: ["매도", "전세", "월세"] };
  var WHEN = ["1개월 안", "3개월 안", "6개월 안", "6개월 이후", "아직 정하지 않았어요"];
  var meta = document.querySelector('meta[name="ask-name"]');
  var preset = meta ? meta.getAttribute("content") : "";
  slot.innerHTML = '<form class="askf" id="askf" novalidate>'
    + '<h3>상담 남기기</h3>'
    + '<div class="tabs" role="group" aria-label="상담 종류"><button type="button" data-t="buy" aria-pressed="true">집 구하기</button><button type="button" data-t="sell" aria-pressed="false">집 내놓기</button></div>'
    + '<div><span class="lb">거래 방식 <small>(여러 개 골라도 됩니다)</small></span><div class="chips" id="askf-way"></div></div>'
    + '<div><label class="lb" for="askf-where">단지명 · 주소</label><input id="askf-where" type="text" maxlength="60" placeholder="예: 신정현대홈타운 101동 · 남구 야음동 123-4"></div>'
    + '<div><span class="lb">거래 희망 시기</span><div class="chips" id="askf-when"></div></div>'
    + '<div class="row"><div><label class="lb" for="askf-name">성함</label><input id="askf-name" type="text" autocomplete="name" maxlength="20"></div>'
    + '<div><label class="lb" for="askf-tel">연락처</label><input id="askf-tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="010-0000-0000" maxlength="20"></div></div>'
    + '<div><label class="lb" for="askf-memo">추가로 알려 주실 내용 <small>(선택)</small></label><textarea id="askf-memo" maxlength="500"></textarea></div>'
    + '<label class="agree"><input type="checkbox" id="askf-ok"><span>상담 회신을 위한 개인정보(성함 · 연락처 · 문의 내용) 수집 · 이용에 동의합니다. 상담이 끝나면 1년 안에 지웁니다. <a href="' + ROOT + 'about.html" target="_blank" rel="noopener">자세히</a></span></label>'
    + '<div class="send"><button type="button" id="askf-go" class="go">✅ 상담 접수하기</button><button type="button" id="askf-sms" class="alt">📱 문자로 보내기</button><button type="button" id="askf-kk" class="kk">💬 카톡 채널로 보내기</button></div>'
    + '<p class="msg" id="askf-msg" role="status" aria-live="polite"></p>'
    + '<p>「상담 접수하기」를 누르면 바로 접수되고, 확인하는 대로 적어 주신 연락처로 연락드립니다. 문자 · 카톡 단추는 적으신 글을 휴대폰 문자(010-3696-5677)나 카톡에 채워 드리는 것이라 <b>보내기를 눌러 주셔야 전송됩니다.</b></p>'
    + '</form>';
  var $ = function (id) { return document.getElementById(id); };
  var mode = "buy";
  function chips(box, list, multi) {
    box.textContent = "";
    list.forEach(function (t) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = t; b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        if (!multi) Array.prototype.forEach.call(box.children, function (x) { if (x !== b) x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
      });
      box.appendChild(b);
    });
  }
  function picked(box) { return Array.prototype.filter.call(box.children, function (b) { return b.getAttribute("aria-pressed") === "true"; }).map(function (b) { return b.textContent; }); }
  function setMode(m) {
    mode = m;
    Array.prototype.forEach.call(slot.querySelectorAll(".tabs button"), function (b) { b.setAttribute("aria-pressed", b.dataset.t === m ? "true" : "false"); });
    chips($("askf-way"), WAYS[m], true);
    $("askf-memo").placeholder = m === "sell"
      ? "예: 84㎡에 살고 있습니다. 이사 일정은 협의할 수 있고, 평일 저녁 6시 이후 통화할 수 있어요."
      : "예: 초등학교 가까운 33평을 찾고 있습니다. 예산은 5억 안팎입니다.";
  }
  Array.prototype.forEach.call(slot.querySelectorAll(".tabs button"), function (b) { b.addEventListener("click", function () { setMode(b.dataset.t); }); });
  chips($("askf-when"), WHEN, false);
  setMode("buy");
  if (preset) $("askf-where").value = preset;

  function say(t) { $("askf-msg").textContent = t; }
  function text() {
    var way = picked($("askf-way")), when = picked($("askf-when")), where = $("askf-where").value.trim(), memo = $("askf-memo").value.trim();
    if (!way.length && !where && !memo) { say("거래 방식이나 단지명, 문의 내용 가운데 하나는 적어 주세요."); return null; }
    var L = ["[울산부동산리더 홈페이지 상담 · " + (mode === "sell" ? "집 내놓기" : "집 구하기") + "]"];
    if (way.length) L.push("거래 방식: " + way.join(" · "));
    if (where) L.push("단지/주소: " + where);
    if (when.length) L.push("희망 시기: " + when[0]);
    if ($("askf-name").value.trim()) L.push("성함: " + $("askf-name").value.trim());
    if ($("askf-tel").value.trim()) L.push("연락처: " + $("askf-tel").value.trim());
    if (memo) L.push("내용: " + memo);
    var page = (document.title || "").replace(/\s*\|\s*울산부동산리더.*$/, "");
    if (page && page !== "울산부동산리더") L.push("(보던 화면: " + page + ")");
    return L.join("\n");
  }
  function copy(t, done) {
    try { navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); }); }
    catch (e) { done(false); }
  }
  var sent = 0;
  $("askf-go").addEventListener("click", function () {
    var tel = $("askf-tel").value.trim();
    if (tel.replace(/\D/g, "").length < 9) { say("연락드릴 전화번호를 적어 주세요."); $("askf-tel").focus(); return; }
    if (!$("askf-ok").checked) { say("개인정보 수집 · 이용 동의에 체크해 주세요."); $("askf-ok").focus(); return; }
    if (Date.now() - sent < 30000) { say("방금 접수되었습니다. 확인하는 대로 연락드리겠습니다."); return; }
    var page = (document.title || "").replace(/\s*\|\s*울산부동산리더.*$/, "");
    var v = { kind: mode === "sell" ? "집 내놓기" : "집 구하기", way: picked($("askf-way")).join(" · "), where: $("askf-where").value.trim(),
              when: picked($("askf-when"))[0] || "", name: $("askf-name").value.trim(), tel: tel, memo: $("askf-memo").value.trim(), page: page };
    var body = Object.keys(ENTRY).map(function (k) { return "entry." + ENTRY[k] + "=" + encodeURIComponent(v[k] || ""); }).join("&");
    var b = $("askf-go"); b.disabled = true; say("접수하는 중입니다…");
    fetch(FORM, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body }).then(function () {
      sent = Date.now(); b.disabled = false;
      say("접수되었습니다. 확인하는 대로 " + tel + " 로 연락드리겠습니다. 급하시면 052-254-4988 로 전화 주세요.");
    }, function () {
      b.disabled = false;
      say("접수가 되지 않았습니다. 아래 문자 · 카톡 단추로 보내시거나 052-254-4988 로 전화 주세요.");
    });
  });
  var phone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  $("askf-sms").addEventListener("click", function () {
    var t = text(); if (!t) return;
    if (phone) { say("문자 앱이 열립니다. 보내기를 눌러 주세요."); location.href = "sms:01036965677?&body=" + encodeURIComponent(t); }
    else copy(t, function (ok) {
      say(ok ? "컴퓨터에서는 문자 앱이 열리지 않습니다. 내용을 복사했으니 휴대폰 문자(010-3696-5677)나 카톡 채널에 붙여넣어 보내 주세요."
             : "컴퓨터에서는 문자 앱이 열리지 않습니다. 휴대폰에서 010-3696-5677 로 문자를 보내 주세요.");
    });
  });
  $("askf-kk").addEventListener("click", function () {
    var t = text(); if (!t) return;
    window.open("http://pf.kakao.com/_hkMiX/chat", "_blank", "noopener");
    copy(t, function (ok) { say(ok ? "내용을 복사했습니다. 열린 카톡 채팅창에 붙여넣기 해서 보내 주세요." : "카톡 채팅창이 열립니다. 문의 내용을 적어 보내 주세요."); });
  });

  /* 「이 단지 매물 접수」에서 왔으면 집 내놓기를 열고 그 자리로 */
  function jump() {
    var h = location.hash;
    if (h === "#ask-sell" || h === "#ask-buy") {
      setMode(h === "#ask-sell" ? "sell" : "buy");
      if (preset) $("askf-where").value = preset;
      $("askf").scrollIntoView();
    }
  }
  window.addEventListener("hashchange", jump);
  jump();
})();
