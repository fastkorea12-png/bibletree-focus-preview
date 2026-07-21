(function () {
  var contents = {
    '2026-07-03': { day: '금', title: '여호와는 나의 목자', ref: '시 23:1', questions: ['목자이신 하나님은 나에게 어떤 분입니까?'] },
    '2026-07-10': { day: '금', title: '합력하여 선을 이루시는 하나님', ref: '롬 8:28', questions: ['지금은 이해되지 않지만 하나님께 맡기고 싶은 일이 있습니까?'] },
    '2026-07-17': { day: '금', title: '위로하시는 하나님', ref: '고후 1:3-7', questions: ['하나님이 환난 중에 우리를 위로하시는 목적은 무엇입니까?', '내가 받은 위로는 다른 사람에게 어떻게 이어질 수 있습니까?', '오늘 위로가 필요한 사람에게 어떻게 다가갈 수 있습니까?'] },
    '2026-07-19': { day: '일', title: '은사는 다르되 한 몸', ref: '고전 12:1-11', questions: ['은사가 여러 가지이지만 그 원천은 하나라고 한 이유는 무엇입니까?', '은사의 목적이 내 사용 방식에 어떤 변화를 요구합니까?', '내 은사가 공동체에서 어떻게 사용되고 있습니까?'] },
    '2026-07-20': { day: '월', title: '위로부터 오는 선물', ref: '약 1:16-21', questions: ['좋은 은사와 선물의 원천은 어디이며 하나님은 어떤 분입니까?', '듣기와 말하기와 성냄의 태도는 은사 사용과 어떻게 연결됩니까?', '오늘 받은 선물을 누구에게 어떻게 흘려보낼 수 있습니까?'] },
    '2026-07-21': { day: '화', title: '자유의 역설', ref: '갈 5:13-18', questions: ['바울은 자유를 어떻게 사용해야 한다고 말합니까?', '육체의 욕심과 성령의 인도 사이 갈등은 내 삶에 어떻게 나타납니까?', '오늘 자유를 이웃을 섬기는 데 어떻게 사용할 수 있습니까?'] },
    '2026-07-22': { day: '수', title: '한 몸, 많은 지체', ref: '고전 12:12-20', questions: ['오늘 말씀에서 가장 마음에 남는 문장은 무엇입니까?', '이 말씀이 지금 내 삶을 어떻게 비추고 있습니까?', '오늘 바로 실천할 한 가지는 무엇입니까?'] },
    '2026-07-23': { day: '목', title: '약한 지체가 더 귀하다', ref: '고전 12:21-26', questions: ['오늘 말씀에서 가장 마음에 남는 문장은 무엇입니까?', '이 말씀이 지금 내 삶을 어떻게 비추고 있습니까?', '오늘 바로 실천할 한 가지는 무엇입니까?'] },
    '2026-07-24': { day: '금', title: '더욱 큰 은사를 사모하라', ref: '고전 12:27-31', questions: ['오늘 말씀에서 가장 마음에 남는 문장은 무엇입니까?', '이 말씀이 지금 내 삶을 어떻게 비추고 있습니까?', '오늘 바로 실천할 한 가지는 무엇입니까?'] },
    '2026-07-25': { day: '토', title: '사랑이 없으면', ref: '고전 13:1-7', questions: ['오늘 말씀에서 가장 마음에 남는 문장은 무엇입니까?', '이 말씀이 지금 내 삶을 어떻게 비추고 있습니까?', '오늘 바로 실천할 한 가지는 무엇입니까?'] }
  };
  var samples = {
    '2026-07-03': ['시험 기간이라 불안했지만, 내가 어디로 가야 할지 모를 때에도 앞서 길을 아시는 목자라는 말씀이 마음을 붙잡아 주었다.'],
    '2026-07-10': ['동아리 오디션에서 떨어진 일이 아직 속상하다. 지금은 이해하기 어렵지만 이 경험도 합력하여 선이 될 것을 믿고 하나님께 맡겨 보기로 했다.'],
    '2026-07-17': ['내가 받은 위로로 다른 사람을 위로하게 하시려는 것이다. 위로가 나에게서 끝나지 않는다는 점이 마음에 남았다.', '작년에 힘들 때 말없이 곁에 있어 준 친구처럼, 나도 누군가에게 그런 사람이 될 수 있다고 생각했다.', '요즘 표정이 어두운 친구에게 먼저 안부를 묻고 이야기를 들어주고 싶다.']
  };

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function records() {
    return Object.keys(contents).map(function (date) {
      try {
        var saved = JSON.parse(localStorage.getItem('bibletree-beta-' + date) || '{}');
        var answers = Array.isArray(saved.answers) ? saved.answers : [];
        var hasSavedRecord = saved.complete || answers.some(function (answer) { return String(answer || '').trim(); });
        if (!hasSavedRecord && samples[date]) return { date: date, content: contents[date], answers: samples[date], complete: true, sample: true, updatedAt: '' };
        if (!hasSavedRecord) return null;
        return { date: date, content: contents[date], answers: answers, complete: !!saved.complete, sample: false, updatedAt: saved.updatedAt || '' };
      } catch (e) { return null; }
    }).filter(Boolean).sort(function (a, b) { return b.date.localeCompare(a.date); });
  }

  function card(record, index) {
    var dateNumber = Number(record.date.slice(-2));
    var answer = record.answers.find(function (item) { return String(item || '').trim(); }) || '';
    var summary = answer ? escapeHtml(answer).slice(0, 90) + (answer.length > 90 ? '…' : '') : '집중 묵상을 완료했습니다.';
    var qa = record.content.questions.map(function (question, questionIndex) {
      var value = String(record.answers[questionIndex] || '').trim();
      if (!value) return '';
      return '<div class="bt-record-qa"><b>Q' + (questionIndex + 1) + '. ' + escapeHtml(question) + '</b><p>' + escapeHtml(value) + '</p></div>';
    }).join('');
    return '<article class="bt-record-card">' +
      '<button type="button" class="bt-record-toggle" aria-expanded="false" aria-controls="bt-record-detail-' + index + '">' +
        '<span class="bt-record-date"><b>' + dateNumber + '</b>' + record.content.day + '요일</span>' +
        '<span class="bt-record-main"><small>' + (record.sample ? '📝 샘플 기록' : record.complete ? '🍇 묵상 완료' : '✍️ 작성 중') + '</small><strong>' + escapeHtml(record.content.title) + '</strong><em>' + escapeHtml(record.content.ref) + '</em><p>' + summary + '</p></span>' +
        '<span class="bt-record-arrow">⌄</span>' +
      '</button>' +
      '<div class="bt-record-detail" id="bt-record-detail-' + index + '">' + (qa || '<p class="bt-record-empty">작성한 답변은 없지만 묵상을 완료한 기록입니다.</p>') + '</div>' +
    '</article>';
  }

  function render(root) {
    var list = records();
    root.innerHTML = '<section class="bt-library">' +
      '<div class="bt-library-head"><div><p>나의 서재</p><h3>이번 달 큐티 기록</h3></div><span><b>' + list.length + '</b>개의 기록</span></div>' +
      (list.length ? '<div class="bt-record-list">' + list.map(card).join('') + '</div>' : '<div class="bt-library-empty">아직 작성한 기록이 없습니다.<br>집중 묵상에서 답변을 적거나 묵상을 완료해 보세요.</div>') +
    '</section>';
    root.querySelectorAll('.bt-record-toggle').forEach(function (button) {
      button.addEventListener('click', function () {
        var open = button.getAttribute('aria-expanded') === 'true';
        root.querySelectorAll('.bt-record-toggle').forEach(function (other) { other.setAttribute('aria-expanded', 'false'); });
        button.setAttribute('aria-expanded', String(!open));
      });
    });
  }

  var style = document.createElement('style');
  style.textContent = '.bt-month-wrap{padding:0 16px 24px}.bt-library{background:#fffdf8;border:1px solid #e8dfcf;border-radius:18px;padding:18px;box-shadow:0 6px 20px rgba(60,45,20,.06)}.bt-library-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:14px}.bt-library-head p{margin:0;color:#9a886c;font-size:11px;letter-spacing:.08em}.bt-library-head h3{margin:2px 0 0;color:#493d2c;font-size:17px}.bt-library-head span{color:#8b7f6a;font-size:12px}.bt-library-head span b{color:#8a6d3b}.bt-record-list{display:flex;flex-direction:column;gap:9px}.bt-record-card{overflow:hidden;border:1px solid #e8dfcf;border-radius:14px;background:#fff}.bt-record-toggle{width:100%;display:grid;grid-template-columns:46px 1fr 18px;gap:11px;align-items:start;padding:14px;border:0;background:#fff;color:#493d2c;text-align:left;cursor:pointer}.bt-record-date{display:flex;flex-direction:column;align-items:center;color:#9a886c;font-size:10px}.bt-record-date b{font:700 25px/1 Georgia,serif;color:#8a6d3b}.bt-record-main{min-width:0}.bt-record-main small,.bt-record-main strong,.bt-record-main em{display:block}.bt-record-main small{color:#9a7650;font-size:10px}.bt-record-main strong{margin-top:2px;font-size:14px}.bt-record-main em{color:#978b78;font-size:11px;font-style:normal}.bt-record-main p{margin:7px 0 0;color:#756a5a;font:13px/1.65 Georgia,"Noto Serif KR",serif;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.bt-record-arrow{color:#9a886c;transition:transform .2s}.bt-record-toggle[aria-expanded="true"] .bt-record-arrow{transform:rotate(180deg)}.bt-record-detail{display:none;padding:2px 16px 16px 71px;border-top:1px dashed #e8dfcf;background:#fffdf8}.bt-record-toggle[aria-expanded="true"]+.bt-record-detail{display:block}.bt-record-qa{padding-top:13px}.bt-record-qa b{display:block;color:#7b684b;font-size:11px;line-height:1.55}.bt-record-qa p,.bt-record-empty{margin:5px 0 0;color:#544a3b;font:14px/1.75 Georgia,"Noto Serif KR",serif;white-space:pre-wrap}.bt-library-empty{padding:26px 10px;border:1px dashed #e2d5be;border-radius:13px;color:#998b75;text-align:center;font-size:12px;line-height:1.7}@media(min-width:1024px){.bt-month-wrap{padding-left:0;padding-right:0}}';
  document.head.appendChild(style);
  document.querySelectorAll('[data-monthly-qt]').forEach(render);
})();
