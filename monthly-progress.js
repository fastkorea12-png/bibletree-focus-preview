(function () {
  var MONTH = '2026-07';
  var TOTAL = 31;

  function completedDates() {
    var result = [];
    for (var day = 1; day <= TOTAL; day++) {
      var date = MONTH + '-' + String(day).padStart(2, '0');
      try {
        var saved = JSON.parse(localStorage.getItem('bibletree-beta-' + date) || '{}');
        if (saved.complete) result.push(date);
      } catch (e) {}
    }
    return result;
  }

  function streak(dates) {
    var days = dates.map(function (date) { return Number(date.slice(-2)); }).sort(function (a, b) { return a - b; });
    var best = 0, current = 0, previous = -2;
    days.forEach(function (day) {
      current = day === previous + 1 ? current + 1 : 1;
      best = Math.max(best, current);
      previous = day;
    });
    return best;
  }

  function render(root) {
    var completed = completedDates();
    var completeSet = new Set(completed);
    var percent = Math.round(completed.length / TOTAL * 100);
    var days = '';
    for (var day = 1; day <= TOTAL; day++) {
      var date = MONTH + '-' + String(day).padStart(2, '0');
      var done = completeSet.has(date);
      var today = day === 21;
      days += '<div class="bt-month-day' + (done ? ' done' : '') + (today ? ' today' : '') + '"><span>' + day + '</span><i>' + (done ? '🍇' : '') + '</i></div>';
    }
    root.innerHTML = '<div class="bt-month-card">' +
      '<div class="bt-month-head"><div><p>나의 묵상 기록</p><h3>이번 달 나의 큐티</h3></div><strong>' + percent + '%</strong></div>' +
      '<div class="bt-month-stats"><span><b>' + completed.length + '</b> / ' + TOTAL + '일 완료</span><span>최장 <b>' + streak(completed) + '</b>일 연속</span></div>' +
      '<div class="bt-month-bar"><i style="width:' + percent + '%"></i></div>' +
      '<div class="bt-month-week"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div>' +
      '<div class="bt-month-grid"><em></em><em></em><em></em>' + days + '</div>' +
      (completed.length ? '<p class="bt-month-note">🍇 표시가 집중 묵상을 완료한 날입니다.</p>' : '<p class="bt-month-note">집중 묵상을 완료하면 이곳에 포도 열매가 표시됩니다.</p>') +
      '</div>';
  }

  var style = document.createElement('style');
  style.textContent = '.bt-month-wrap{padding:0 16px 24px}.bt-month-card{background:#fff;border:1px solid #eee7f5;border-radius:18px;padding:18px;box-shadow:0 6px 20px rgba(44,25,64,.06)}.bt-month-head{display:flex;align-items:center;justify-content:space-between}.bt-month-head p{margin:0;color:#8b7c98;font-size:11px}.bt-month-head h3{margin:2px 0 0;color:#33283b;font-size:16px}.bt-month-head strong{font-size:24px;color:#7143b8}.bt-month-stats{display:flex;justify-content:space-between;margin-top:13px;color:#6f6577;font-size:12px}.bt-month-stats b{color:#5b3298}.bt-month-bar{height:7px;margin:9px 0 16px;border-radius:999px;background:#eee9f3;overflow:hidden}.bt-month-bar i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#8d63c9,#7143b8);transition:width .4s}.bt-month-week,.bt-month-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.bt-month-week span{text-align:center;color:#9a909f;font-size:10px}.bt-month-day{min-height:38px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:9px;color:#807684;font-size:11px}.bt-month-day i{height:15px;font-size:11px;font-style:normal;line-height:15px}.bt-month-day.done{background:#f2ecfa;color:#5b3298;font-weight:800}.bt-month-day.today{outline:1.5px solid #d1bde9}.bt-month-grid em{min-height:38px}.bt-month-note{margin:14px 0 0;text-align:center;color:#8b8190;font-size:11px}@media(min-width:1024px){.bt-month-wrap{padding-left:0;padding-right:0}}';
  document.head.appendChild(style);
  document.querySelectorAll('[data-monthly-qt]').forEach(render);
})();
