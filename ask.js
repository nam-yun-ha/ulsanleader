/* 상담 남기기 — 집 구하기 / 집 내놓기 (2026-10-14 대표님 — 더원부동산 상담 양식과 「이 단지 매물 접수」를 보시고 「이것도 좋은 거 같아」)
   모든 쪽이 이 파일 하나를 같이 쓴다: <div id="ask-slot"></div><script src="…/ask.js"></script>
   → 양식을 고칠 때 3,500쪽을 다시 만들 필요가 없다. 이 파일만 고쳐 올리면 된다.

   서버가 없다. 적은 내용을 **손님 휴대폰의 문자 앱**(또는 카톡 채널 채팅)에 채워 넣어 손님이 직접 보낸다 —
   홈페이지는 아무것도 저장하지 않는다. 그래서 개인정보 수집 동의가 따로 필요 없다.
   쪽에 <meta name="ask-name" content="단지 이름"> 이 있으면 「단지명 또는 주소」 칸에 미리 채운다.
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
    + ".askf .msg{font-weight:700;color:var(--accent,#0E5E57);min-height:1.2em}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var WAYS = { buy: ["매수", "전세", "월세"], sell: ["매도", "전세", "월세"] };
  var WHEN = ["1개월 안", "3개월 안", "6개월 안", "6개월 이후", "아직 정하지 않았어요"];
  var meta = document.querySelector('meta[name="ask-name"]');
  var preset = meta ? meta.getAttribute("content") : "";
  slot.innerHTML = '<form class="askf" id="askf" novalidate>'
    + '<h3>상담 남기기</h3>'
    + '<div class="tabs" role="group" aria-label="상담 종류"><button type="button" data-t="buy" aria-pressed="true">집 구하기</button><button type="button" data-t="sell" aria-pressed="false">집 내놓기</button></div>'
    + '<div><span class="lb">거래 방식 <small>(여러 개 골라도 됩니다)</small></span><div class="chips" id="askf-way"></div></div>'
    + '<div><label class="lb" for="askf-where">단지명 또는 주소</label><input id="askf-where" type="text" maxlength="60" placeholder="예: 신정현대홈타운, 남구 야음동"></div>'
    + '<div><span class="lb">거래 희망 시기</span><div class="chips" id="askf-when"></div></div>'
    + '<div class="row"><div><label class="lb" for="askf-name">성함</label><input id="askf-name" type="text" autocomplete="name" maxlength="20"></div>'
    + '<div><label class="lb" for="askf-tel">연락처</label><input id="askf-tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="010-0000-0000" maxlength="20"></div></div>'
    + '<div><label class="lb" for="askf-memo">추가로 알려 주실 내용 <small>(선택)</small></label><textarea id="askf-memo" maxlength="500"></textarea></div>'
    + '<div class="send"><button type="button" id="askf-sms">📱 문자로 보내기</button><button type="button" id="askf-kk" class="kk">💬 카톡 채널로 보내기</button></div>'
    + '<p class="msg" id="askf-msg" role="status" aria-live="polite"></p>'
    + '<p>단추를 누르면 적으신 글이 문자(010-3696-5677)나 카톡에 채워집니다. <b>보내기를 눌러 주셔야 전송됩니다.</b> 이 홈페이지는 적으신 내용을 저장하지 않습니다.</p>'
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
