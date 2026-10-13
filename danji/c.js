/* 단지 쪽 — 거래 순위 · 매매 실거래 추이 그래프 · 면적별로 골라 보기 (2026-10-14 대표님 — 더원 단지 쪽을 보시고 「이렇게 자세하게 나온다」)
   쪽에는 window.DJ = {k: 단지키, s: [[계약일 YYYYMMDD, 전용㎡, 금액 만원, 층, 평], …]} (최근 매매 · 해제 제외 · 최근 것부터) 만 들어 있다.
   순위는 날마다 바뀌므로 쪽에 박지 않고 r.json 한 파일에서 읽는다 — 2,000쪽을 날마다 다시 만들지 않으려고. */
(function () {
  var D = window.DJ; if (!D || !D.s || !D.s.length) return;
  var won = function (m) { var e = Math.floor(m / 10000), r = m % 10000; return (e ? e + "억" : "") + (r ? " " + r.toLocaleString() + "만원" : (e ? "원" : "0원")); };
  var eok = function (m) { return (m / 10000).toFixed(m % 10000 ? 1 : 0) + "억"; };
  var COL = ["#0E5E57", "#C98A12", "#2F6FB5", "#C2402F", "#7A5CC2", "#4A5754"];
  var pys = []; D.s.forEach(function (r) { if (pys.indexOf(r[4]) < 0) pys.push(r[4]); }); pys.sort(function (a, b) { return a - b; });
  var cur = 0;                                            /* 0 = 전체 */
  var ymd = function (n) { var s = String(n); return s.slice(0, 4) + "." + s.slice(4, 6) + "." + s.slice(6, 8); };
  var t = function (n) { var s = String(n); return new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8)).getTime(); };

  /* ① 거래 순위 */
  var rk = document.getElementById("dj-rank");
  if (rk && window.fetch) fetch("r.json").then(function (x) { return x.json(); }).then(function (R) {
    var v = R[D.k]; if (!v) return;
    rk.innerHTML = '<div><small>울산 거래량 순위</small><b>' + v[0] + '위</b><span>' + v[1].toLocaleString() + '개 단지 중 · ' + v[2] + '건</span></div>'
      + '<div><small>' + R._gu[D.k] + ' 거래량 순위</small><b>' + v[3] + '위</b><span>' + v[4] + '개 단지 중</span></div>'
      + '<div><small>최근 12개월 최고 거래가</small><b>' + eok(v[5]) + '</b><span>' + won(v[5]) + '</span></div>';
    rk.hidden = false;
    var n = document.getElementById("dj-rank-note"); if (n) n.hidden = false;
  }).catch(function () {});

  /* ② 그래프 — 점 하나가 거래 한 건 · 점선은 분기 평균 */
  function chart() {
    var box = document.getElementById("dj-chart"); if (!box) return;
    var rows = D.s.filter(function (r) { return !cur || r[4] === cur; });
    if (rows.length < 3) { box.innerHTML = '<p class="src">그래프로 그리기에는 거래가 적습니다.</p>'; return; }
    var W = 880, H = 360, L = 58, Rr = 14, T = 14, B = 34;
    var xs = rows.map(function (r) { return t(r[0]); }), ys = rows.map(function (r) { return r[2]; });
    var x0 = Math.min.apply(0, xs), x1 = Math.max.apply(0, xs), y0 = Math.min.apply(0, ys), y1 = Math.max.apply(0, ys);
    if (x1 === x0) x1 = x0 + 864e5; var pad = (y1 - y0) * 0.08 || y1 * 0.1; y0 = Math.max(0, y0 - pad); y1 += pad;
    var X = function (v) { return L + (v - x0) / (x1 - x0) * (W - L - Rr); }, Y = function (v) { return T + (1 - (v - y0) / (y1 - y0)) * (H - T - B); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="매매 실거래 추이">';
    var step = Math.pow(10, Math.floor(Math.log10((y1 - y0) / 4))) * ([1, 2, 5, 10].filter(function (m) { return (y1 - y0) / (m * Math.pow(10, Math.floor(Math.log10((y1 - y0) / 4)))) <= 6; })[0] || 10);
    for (var g = Math.ceil(y0 / step) * step; g <= y1; g += step)
      s += '<line x1="' + L + '" x2="' + (W - Rr) + '" y1="' + Y(g) + '" y2="' + Y(g) + '" stroke="#DCE2E0"/><text x="' + (L - 8) + '" y="' + (Y(g) + 4) + '" text-anchor="end" font-size="13" fill="#4A5754">' + eok(g) + '</text>';
    var d0 = new Date(x0), yy = d0.getFullYear();
    for (var y = yy; y <= new Date(x1).getFullYear() + 1; y++) { var tx = new Date(y, 0, 1).getTime(); if (tx >= x0 && tx <= x1) s += '<line x1="' + X(tx) + '" x2="' + X(tx) + '" y1="' + T + '" y2="' + (H - B) + '" stroke="#ECEFEE"/><text x="' + X(tx) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="13" fill="#4A5754">' + y + '</text>'; }
    rows.forEach(function (r) { s += '<circle cx="' + X(t(r[0])).toFixed(1) + '" cy="' + Y(r[2]).toFixed(1) + '" r="4.5" fill="' + COL[pys.indexOf(r[4]) % COL.length] + '" fill-opacity=".72"><title>' + ymd(r[0]) + ' · ' + r[4] + '평 ' + r[3] + '층 · ' + won(r[2]) + '</title></circle>'; });
    var q = {}; rows.forEach(function (r) { var d = new Date(t(r[0])), k = d.getFullYear() * 4 + Math.floor(d.getMonth() / 3); (q[k] = q[k] || []).push(r[2]); });
    var pts = Object.keys(q).sort().filter(function (k) { return q[k].length >= 2; }).map(function (k) { var yr = Math.floor(k / 4), qq = k % 4; return X(Math.min(x1, Math.max(x0, new Date(yr, qq * 3 + 1, 15).getTime()))).toFixed(1) + "," + Y(q[k].reduce(function (a, b) { return a + b; }, 0) / q[k].length).toFixed(1); });
    if (pts.length > 1) s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="#16211F" stroke-width="2" stroke-dasharray="6 5"/>';
    box.innerHTML = s + '</svg><p class="dj-lg">' + pys.filter(function (p) { return !cur || p === cur; }).map(function (p) { return '<span><i style="background:' + COL[pys.indexOf(p) % COL.length] + '"></i>' + p + '평 (' + D.s.filter(function (r) { return r[4] === p; }).length + '건)</span>'; }).join("") + '<span><i class="ln"></i>분기 평균</span></p>';
  }

  /* ③ 면적 고르기 · 표 */
  function table() {
    var box = document.getElementById("dj-table"); if (!box) return;
    var rows = D.s.filter(function (r) { return !cur || r[4] === cur; }), n = box.dataset.n ? +box.dataset.n : 30;
    box.innerHTML = '<div class="atbl"><table><thead><tr><th>계약일</th><th class="r">평형</th><th class="r">층</th><th class="r">거래 금액</th></tr></thead><tbody>'
      + rows.slice(0, n).map(function (r) { return '<tr><td>' + ymd(r[0]) + '</td><td class="r">' + r[4] + '평 <small>' + r[1] + '㎡</small></td><td class="r">' + r[3] + '층</td><td class="r"><b>' + won(r[2]) + '</b></td></tr>'; }).join("")
      + '</tbody></table></div>' + (rows.length > n ? '<p style="text-align:center;margin:10px 0 0"><button type="button" class="dj-more">더 보기 (' + (rows.length - n) + '건 남음)</button></p>' : "");
    var m = box.querySelector(".dj-more"); if (m) m.addEventListener("click", function () { box.dataset.n = n + 50; table(); });
  }
  var chips = document.getElementById("dj-chips");
  if (chips) {
    chips.innerHTML = [0].concat(pys).map(function (p) { return '<button type="button" data-p="' + p + '" aria-pressed="' + (p === 0) + '">' + (p ? p + "평" : "전체") + '</button>'; }).join("");
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      cur = +b.dataset.p; [].forEach.call(chips.children, function (x) { x.setAttribute("aria-pressed", x === b); });
      var tb = document.getElementById("dj-table"); if (tb) delete tb.dataset.n;
      chart(); table();
    });
  }
  chart(); table();
})();
