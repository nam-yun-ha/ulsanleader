/* 매수 시뮬레이터 — window.SIM = [[주택형, 전용㎡, 최고 분양가(만원)], …]
   취득세는 1주택 표준세율: 6억 이하 1% · 6억~9억 (금액(억)×2/3−3)% · 9억 초과 3% · 지방교육세는 그 1/10 · 전용 85㎡ 초과 농특세 0.2% */
(function () {
  var S = window.SIM, ty = document.getElementById("sim-ty"), out = document.getElementById("sim-out");
  if (!S || !ty || !out) return;
  var won = function (m) { m = Math.round(m); var e = Math.floor(m / 10000), r = m % 10000; return (e ? e + "억" : "") + (r ? " " + r.toLocaleString() + "만원" : (e ? "원" : "0원")); };
  S.forEach(function (t, i) { var o = document.createElement("option"); o.value = i; o.textContent = t[0] + (t[1] ? " (전용 " + t[1] + "㎡)" : "") + " · " + won(t[2]); ty.appendChild(o); });
  var row = function (a, b, c) { return '<div' + (c ? ' class="' + c + '"' : '') + '><span>' + a + '</span><span>' + b + '</span></div>'; };
  function calc() {
    var t = S[+ty.value], opt = Math.max(0, +document.getElementById("sim-opt").value || 0), dp = Math.min(100, Math.max(0, +document.getElementById("sim-dp").value || 0));
    var tot = t[2] + opt, eok = tot / 10000;
    var rate = eok <= 6 ? 1 : (eok <= 9 ? Math.round((eok * 2 / 3 - 3) * 100) / 100 : 3);
    var acq = tot * rate / 100, edu = acq / 10, rural = t[1] > 85 ? tot * 0.002 : 0;
    out.innerHTML = row("분양가 (" + t[0] + " 최고가)", won(t[2])) + row("확장 · 옵션", won(opt)) + row("합계", won(tot), "t")
      + row("계약금 (" + dp + "%로 볼 때)", won(t[2] * dp / 100))
      + row("입주 때 내는 세금 어림 · 1주택 기준", "", "g")
      + row("취득세 (" + rate + "%)", won(acq)) + row("지방교육세", won(edu)) + (rural ? row("농어촌특별세", won(rural)) : "")
      + row("세금 합계", won(acq + edu + rural), "t");
  }
  ["change", "input"].forEach(function (e) { ty.addEventListener(e, calc); document.getElementById("sim-opt").addEventListener(e, calc); document.getElementById("sim-dp").addEventListener(e, calc); });
  calc();
})();
