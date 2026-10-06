#!/usr/bin/env python3
"""날짜별 원고(MD) → 웹 데이터(JSON). 명세 v2의 question_meta 판별 규칙 구현(인쇄 조판과 같은 표기 규칙).

사용: python3 웹제안/md_to_web.py 2026-11-01 2026-11-27 2026-12-22 > out.json
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AGES = {'저학년': 'low', '고학년': 'high', '청소년': 'youth', '청년': 'young'}
OX_RE = re.compile(r'\(\s*O\s*/\s*X\s*\)')
CIRCLED = '①②③④⑤⑥⑦⑧⑨'
KOR_KEYS = '㉠㉡㉢㉣㉤㉥㉦㉧'


def source(date):
    m, d = int(date[5:7]), int(date[8:10])
    folder = '2026-11_1주_집필' if (m == 11 and d <= 8) else f'2026-{m:02d}_집필'
    return ROOT / folder / f'{date}.md'


def field(sec, name, nxt):
    m = re.search(rf'\*\*{name}\*\*(.*?)(?=\*\*{nxt}\*\*)', sec, re.S)
    return m[1].strip() if m else ''


def hints(activity):
    """활동 안내를 문장으로 나눠 '질문 N(은|는|에서…)' 앞머리를 떼고 문항별로."""
    out, general = {}, []
    for s in re.split(r'(?<=[.!?])\s+', activity.strip()):
        m = re.match(r'^질문\s?(\d)(은|는|에서는|에서|에는|에|의|도)?\s+(.*)$', s)
        if m:
            out.setdefault(int(m[1]), []).append(m[3])
        elif s:
            general.append(s)
    return {k: ' '.join(v) for k, v in out.items()}, ' '.join(general)


def guide_part(guide, n):
    m = re.search(rf'(?:^|\s){n}\.\s(.*?)(?=\s{n + 1}\.\s|$)', guide, re.S)
    return m[1].strip() if m else ''


def strip_key(o):
    return re.sub(r'^([A-D][.\s]|[①-⑨]\s*|[㉠-㉧]\s*|□\s*|\(\s*\)\s*)', '', o).strip()


def classify(n, body, guide_txt, hint):
    lines = body.split('\n')
    prompt = lines[0].strip()
    rest = [l.strip() for l in lines[1:] if l.strip()]
    opts = [l[2:].strip() for l in rest if l.startswith('- ')]
    quotes = [l.lstrip('> ').strip() for l in rest if l.startswith('>')]
    q = {'no': n, 'prompt': OX_RE.sub('', prompt).strip(), 'hint': hint, 'answer_text': guide_txt}
    if OX_RE.search(body):
        q['type'] = 'ox'
        if not OX_RE.search(prompt):
            src = next((x for x in opts + quotes if OX_RE.search(x)), '')
            q['statement'] = re.sub(r'\s+”', '”', OX_RE.sub('', src)).strip()
        m = re.match(r'\s*([OX])\b', guide_txt)
        if m: q['answer'] = m[1]
    elif any('· ·' in o for o in opts) or (any(re.match(r'^[A-D][.\s]', o) for o in opts) and any(o[:1] in CIRCLED for o in opts)):
        q['type'] = 'match'
        if any('· ·' in o for o in opts):
            pairs = [o.split('· ·') for o in opts if '· ·' in o]
            q['left'] = [strip_key(p[0]) for p in pairs]; q['right'] = [strip_key(p[1]) for p in pairs]
        else:
            q['left'] = [strip_key(o) for o in opts if re.match(r'^[A-D][.\s]', o)]
            q['right'] = [strip_key(o) for o in opts if o[:1] in CIRCLED]
        ans = dict(re.findall(r'([A-D])\s*[–-]\s*([①-⑨])', guide_txt))
        if ans: q['answer'] = ans
    elif (('가:' in prompt and '나:' in prompt) or ('(가)' in prompt and '(나)' in prompt)
          or any(o.startswith('가:') for o in opts) or (opts and all(o[:1] in KOR_KEYS for o in opts) and re.search(r'나누|묶음|분류', prompt))):
        q['type'] = 'classify'
        groups = [{'key': o[0], 'label': o[2:].strip()} for o in opts if o[:2] in ('가:', '나:')]
        if not groups:
            names = re.findall(r'[‘\'"]([^’\'"]+)[’\'"]', prompt)[:2]
            groups = [{'key': k, 'label': names[i] if i < len(names) else k} for i, k in enumerate('가나')]
        q['groups'] = groups
        q['items'] = [{'key': o[0], 'text': o[1:].strip()} for o in opts if o[:1] in KOR_KEYS]
    elif opts and all(o.startswith('□') for o in opts):
        q['type'] = 'check'; q['multiple'] = True
        q['options'] = [strip_key(o) for o in opts]
    elif opts and all(re.match(r'^\(\s*\)', o) for o in opts):
        q['type'] = 'order'
        q['items'] = [{'key': str(i + 1), 'text': strip_key(o)} for i, o in enumerate(opts)]
    elif opts and opts[0][:1] in CIRCLED:
        q['type'] = 'choice'
        q['multiple'] = bool(re.search(r'모두|여러 개', prompt))
        q['options'] = [strip_key(o) for o in opts]
        m = re.match(r'\s*([①-⑨])', guide_txt)
        if m: q['answer'] = m[1]
    elif opts and opts[0][:1] in KOR_KEYS:
        q['type'] = 'choice'; q['multiple'] = True
        q['options'] = [o for o in opts]
    elif quotes and AGE_NOW == 'low':
        q['type'] = 'trace'; q['trace'] = quotes[0]
    elif opts:
        q['type'] = 'options_write'; q['options'] = opts
    else:
        q['type'] = 'write'
        if quotes: q['quote'] = quotes[0]
    return q


AGE_NOW = ''


def parse(date):
    global AGE_NOW
    t = source(date).read_text()
    head = t.split('\n## ')[0]
    meta = dict(re.findall(r'^- ([^:]+):\s*(.+)$', head, re.M))
    wd = re.search(r'\((.)\)', t.splitlines()[0])[1]
    verses = re.split(r'(?:^|\s)(\d+)\s', ' ' + meta['성경본문'].strip())
    verses = [{'n': verses[i], 't': verses[i + 1].strip()} for i in range(1, len(verses) - 1, 2)]
    out = {}
    for ko, code in AGES.items():
        AGE_NOW = code
        sec = t.split(f'## {ko}\n')[1].split('\n## ')[0]
        guide = field(sec, '답변 가이드', '활동·실천')
        act = field(sec, '활동·실천', '어휘')
        hs, general = hints(act)
        qs = []
        for n in (1, 2, 3):
            body = field(sec, f'질문 {n}', f'질문 {n + 1}' if n < 3 else '답변 가이드')
            qs.append(classify(n, body, guide_part(guide, n), hs.get(n, '')))
        vocab = [{'word': w.strip(), 'meaning': m.strip()} for w, m in
                 re.findall(r'\*\*([^*]+)\*\*:\s*(.+?)(?=\s/\s\*\*|$)', field(sec, '어휘', '기도'))]
        out[code] = {
            'target': code, 'date': date, 'weekday': wd,
            'weekly_theme': (meta.get('주별 주제') or meta.get('주제', '')).strip(),
            'title': re.search(r'^### 제목:\s*(.+)$', sec, re.M)[1].strip(),
            'scripture': meta['본문주소'].strip(), 'verses': verses,
            'commentary': [p.strip() for p in field(sec, '본문 해설', '질문 1').split('\n\n') if p.strip()],
            'questions': [q['prompt'] for q in qs],
            'question_meta': qs,
            'activity_general': general,
            'vocabulary': vocab,
            'prayer': sec.split('**기도**')[1].strip(),
        }
    return out


if __name__ == '__main__':
    print(json.dumps({d: parse(d) for d in sys.argv[1:]}, ensure_ascii=False, indent=1))
