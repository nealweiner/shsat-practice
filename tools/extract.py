#!/usr/bin/env python3
"""Turn NYC DOE SHSAT sample-test PDFs into bank.js + img/ for the practice app.

usage: extract.py <pdfdir> <outdir> [form ...]

ELA is extracted as text (single-column body text survives fine); math questions
and all math explanations are rendered as cropped images, because fractions,
figures and tables do not survive text extraction.
"""
import json, os, re, sys, statistics
import pymupdf

PDFDIR, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
IMG = os.path.join(OUT, 'img'); os.makedirs(IMG, exist_ok=True)
ZOOM = 1.6

# ---------- page -> ordered lines ----------
ID_RE   = re.compile(r'^(?:EWSA|EW|ER|M)\d[\dA-Z]*(?:_[eE][xX][pP])?(?:_([-–−\d.]+))?$')
JUNK_RE = re.compile(r'^(FORM ?[AB]\b|CONTINUE (ON )?TO THE NEXT PAGE|DO NOT OPEN|UNTIL YOU ARE|TURN YOUR BOOKLET|OVER TO THE|'
                     r'QUESTIONS \d|STOP\b|GRADE 8|For 20\d\d Admissions|Student Name|SAMPLE TEST|EXPLANATIONS OF|'
                     r'\d{1,3}$|[AB]$|SCORRECT|CORRECT ANSWERS|ANSWERS$|Mathematics Explanations|'
                     r'English Language Arts Explanations|of Correct Answers|Sample ?Test|This is the end|'
                     r'Explanations of|AMPLE TEST|.*Correct Answers$|PART [12] ?[—–-]|PART 2\s+MATHEMATICS|c$)', re.I)
Q_RE  = re.compile(r'^(\d{1,3})\.(?:\s+(.*))?$')
O_RE  = re.compile(r'^([A-H]) ?\.\s*(.*)$')

def page_lines(page):
    """Merged text lines with bbox, tagged L/R/F by column, in reading order."""
    W = page.rect.width; mid = W/2
    raw = []
    for b in page.get_text('dict')['blocks']:
        if b['type'] != 0: continue
        for l in b['lines']:
            for sp in l['spans']:
                t = sp['text'].replace('\u200b', '').replace('\u00ad', '')
                if not t.strip(): continue
                x0,y0,x1,y1 = sp['bbox']
                raw.append(dict(t=t, x0=x0, y0=y0, x1=x1, y1=y1, size=sp['size']))
    # cluster spans into rows by vertical overlap, then assemble each row left to right
    raw.sort(key=lambda r: (r['y0']+r['y1'])/2)
    rows = []
    for r in raw:
        for row in reversed(rows[-8:]):
            ov = min(r['y1'], row['y1']) - max(r['y0'], row['y0'])
            if ov > 0.5*min(r['y1']-r['y0'], row['y1']-row['y0']):
                row['items'].append(r); break
        else:
            rows.append(dict(y0=r['y0'], y1=r['y1'], items=[r]))
    rows.sort(key=lambda row: row['y0'])
    lines = []
    for row in rows:
        cur = None
        for r in sorted(row['items'], key=lambda r: r['x0']):
            gap = r['x0'] - cur['x1'] if cur else 0
            gutter = gap > 15 and cur['x1'] < mid+5 and r['x0'] > mid-5
            if cur and gap >= -3 and not gutter:
                second = r is sorted(row['items'], key=lambda r: r['x0'])[1]
                if second and re.fullmatch(r'\d{1,3}', cur['t'].strip()) and gap > 1.5:
                    cur['t'] = '\u00ab' + cur['t'].strip() + '\u00bb'
                if second and re.fullmatch(r'\d{1,3}\.', cur['t'].strip()):
                    cur['tx0'] = r['x0']          # where the question text starts, after the number
                sp = '' if (cur['t'].endswith('\u00bb') or cur['t'].rstrip().endswith(('-', '\u2010', '\u2011', '\u2012', '\u2013', '\u2014')) or cur['t'].endswith(' ') or r['t'].startswith(' ') or gap <= 1.5) else ' '
                cur['t'] += sp + r['t'].lstrip() if cur['t'].endswith('\u00bb') else sp + r['t']
                cur['x1'] = max(cur['x1'], r['x1']); cur['y0'] = min(cur['y0'], r['y0']); cur['y1'] = max(cur['y1'], r['y1'])
                cur['size'] = max(cur['size'], r['size'])
            else:
                cur = dict(r); lines.append(cur)
    for l in lines:
        l['t'] = re.sub(r'\s+', ' ', l['t']).strip()
        l['t'] = re.sub(r'(?<=[A-Za-z0-9])([-\u2010\u2011\u2013]) (?=[A-Za-z0-9])', r'\1', l['t'])   # "low- cost" (soft breaks)
        l['col'] = 'L' if l['x1'] < mid+12 else 'R' if l['x0'] > mid-12 else 'F'
        l['page'] = page.number
    rules = [d['rect'] for d in page.get_drawings()
             if d['rect'].width < 3 and d['rect'].height > 100 and abs((d['rect'].x0+d['rect'].x1)/2 - mid) < 40]
    if rules:
        colTop = min(r.y0 for r in rules) - 6
        for l in lines:
            if l['y0'] >= colTop: l['col'] = 'L' if l['x0'] < mid else 'R'
        twocol = True
    else:
        nR = sum(1 for l in lines if l['col']=='R' and not JUNK_RE.match(l['t']))
        cross = sum(1 for l in lines if l['col']=='F' and l['x0'] < mid-30 and l['x1'] > mid+30 and not JUNK_RE.match(l['t']))
        twocol = nR >= 3 and cross <= 7
        if twocol: colTop = min(l['y0'] for l in lines if l['col'] in 'LR')
    if not twocol:
        for l in lines: l['col'] = 'F'
        return sorted(lines, key=lambda l:(l['y0'], l['x0'])), False
    top = [l for l in lines if l['col']=='F' and l['y0'] < colTop]
    L = [l for l in lines if l['col']=='L']; R = [l for l in lines if l['col']=='R']
    rest = [l for l in lines if l['col']=='F' and l['y0'] >= colTop]
    key = lambda l:(l['y0'], l['x0'])
    return sorted(top,key=key)+sorted(L,key=key)+sorted(R,key=key)+sorted(rest,key=key), True

def doc_lines(doc, pages=None):
    out = []
    for p in doc:
        if pages and p.number not in pages: continue
        ls, two = page_lines(p)
        for l in ls: l['two'] = two
        out.extend(ls)
    return out

# ---------- generic helpers ----------
def is_junk(l):
    t = l['t']
    return bool(JUNK_RE.match(t)) or bool(ID_RE.match(t))

def sec_kind(t):
    t = re.sub(r'\s+', '', t).upper()
    if re.search(r'REVISING/EDITINGPARTA', t): return 'rea'
    if re.search(r'REVISING/EDITINGPARTB', t): return 'reb'
    if re.search(r'^R?EADINGC?OMPREHENSION$', t): return 'rc'
    if re.search(r'^Q?UESTIONS58', t):           return 'grid'
    if re.search(r'^Q?UESTIONS63', t):           return 'mc'
    return None

def esc(s):
    return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

def paras_html(lines, box_x=None):
    """lines -> html paragraphs; vertical gaps split paragraphs, deeper-indented
    runs become a blockquote (the boxed sentence/paragraph of an ELA item)."""
    if not lines: return ''
    h = statistics.median(l['y1']-l['y0'] for l in lines)
    out, cur, curbox, prev = [], [], False, None
    def flush():
        if cur:
            txt = esc(' '.join(cur))
            txt = re.sub(r'\u00ab(\d{1,3})\u00bb', r'<span class="ln">\1</span>', txt)
            out.append(('<blockquote>%s</blockquote>' if curbox else '<p>%s</p>') % txt)
    for l in lines:
        box = box_x is not None and l['x0'] > box_x + 9
        newpara = prev is None or l['page'] != prev['page'] or l['col'] != prev['col'] \
                  or l['y0'] - prev['y1'] > 0.55*h or box != curbox
        if newpara:
            flush(); cur, curbox = [], box
        cur.append(l['t']); prev = l
    flush()
    # merge consecutive blockquotes
    return re.sub(r'</blockquote>\s*<blockquote>', '<br><br>', ''.join(out))

# ---------- split a section's lines into passages + questions ----------
def parse_items(lines, want_first, want_last):
    """Returns list of ('passage', lines) / ('q', dict) in order."""
    items, expect, i = [], want_first, 0
    buf = []            # pending passage lines
    while i < len(lines):
        l = lines[i]
        m = Q_RE.match(l['t'])
        if m and int(m.group(1)) == expect:
            if buf: items.append(('passage', buf)); buf = []
            q = dict(n=expect, stem=[], opts=[], page=l['page'], col=l['col'],
                     y0=l['y0'], x0=l['x0'], anchor=l)
            first = dict(l); first['t'] = m.group(2) or ''; first['x0'] = l['x0'] + 18
            if first['t']: q['stem'].append(first)
            i += 1
            # stem lines until first option
            optx = None
            while i < len(lines):
                l = lines[i]; om = O_RE.match(l['t'])
                if om and om.group(1) in ('A','E') : break
                if Q_RE.match(l['t']) and int(Q_RE.match(l['t']).group(1)) == expect+1: break
                q['stem'].append(l); i += 1
            # options
            while i < len(lines):
                l = lines[i]; om = O_RE.match(l['t'])
                if om and (not q['opts'] or ord(om.group(1)) == ord(q['opts'][-1]['L'])+1) and len(q['opts']) < 4:
                    q['opts'].append(dict(L=om.group(1), t=om.group(2), x0=l['x0'], y1=l['y1'], page=l['page'], col=l['col']))
                    optx = l['x0']; i += 1; continue
                if q['opts']:
                    o = q['opts'][-1]
                    cont = l['page']==o['page'] and l['col']==o['col'] and l['y0']-o['y1'] < 9 and l['x0'] >= optx + 8
                    if cont:
                        o['t'] += ' ' + l['t']; o['y1'] = l['y1']; i += 1; continue
                break
            q['end'] = lines[i] if i < len(lines) else None
            items.append(('q', q)); expect += 1
            if expect > want_last: break
        else:
            buf.append(l); i += 1
    if buf: items.append(('passage', buf))
    return items

def q_html(q):
    tx0 = q['anchor'].get('tx0', q['x0'] + 24)
    return paras_html(q['stem'], box_x=tx0 - 5)

def passage_obj(lines):
    """title = leading centered lines; body = paragraphs."""
    lines = [l for l in lines if not is_junk(l)]
    # drop DIRECTIONS blocks
    keep, skip = [], False
    for k, l in enumerate(lines):
        if l['t'].startswith('DIRECTIONS'): skip = True; keep_prev = l; continue
        if skip:
            if l['y0'] - keep_prev['y1'] < 6 and l['page']==keep_prev['page']: keep_prev = l; continue
            skip = False
        keep.append(l)
    lines = keep
    if not lines: return None
    xs = sorted(l['x0'] for l in lines)
    margin = xs[len(xs)//4]
    def titley(l): return (l['size'] > 11.5 or l['x0'] > margin + 40) and len(l['t']) < 90
    # title = first titley run within the first 6 lines; anything before it is an intro blurb
    start = next((k for k in range(min(6, len(lines))) if titley(lines[k])), None)
    title, intro = [], ''
    if start is not None:
        intro = paras_html(lines[:start]); lines = lines[start:]
        while lines and (titley(lines[0]) or re.match(r'^by ', lines[0]['t'])):
            title.append(lines[0]['t']); lines.pop(0)
    html = (('<div class="intro">%s</div>' % intro) if intro else '') + paras_html(lines)
    title = ' — '.join(title).replace('\u00ab', '').replace('\u00bb', ' ')
    return dict(title=title, html=html, pages=sorted({l['page'] for l in lines}))

# ---------- answers ----------
def norm_ans(s):
    s = s.strip().replace('–','-').replace('−','-').replace(',','')
    return s

def key_table(lines):
    """'Answer Key' page: 'N. X' cells."""
    ans = {}
    kp = {l['page'] for l in lines if re.search(r'Answer Key', l['t'])}
    if not kp: return {}
    txt = ' '.join(l['t'] for l in lines if l['page'] in kp)
    for m in re.finditer(r'(?<![\d.])(\d{1,3})\.\s+([A-H]\b|[-–−]?\d+(?:\. ?\d+)?(?:/\d+)?)', txt):
        n = int(m.group(1))
        if 1 <= n <= 114 and n not in ans: ans[n] = norm_ans(m.group(2)).replace(' ', '')
    return ans if len(ans) >= 100 else {}

def answers_from_expl(lines, first, last):
    """'N. (X)' or 'N. ...' followed by 'X. CORRECT' before N+1."""
    ans, expl = {}, {}
    expect, cur = first, None
    kp = {l['page'] for l in lines if re.search(r'Answer Key', l['t'])}
    for l in lines:
        if l['page'] in kp: continue
        m = Q_RE.match(l['t'])
        if m and int(m.group(1)) == expect:
            cur = expect; expect += 1
            pm = re.match(r'\(([-–−]?[A-H\d][\d.,/ ]*)\)', m.group(2) or '')
            if pm: ans[cur] = norm_ans(pm.group(1)).replace(' ', '')
            expl[cur] = [dict(l, t=m.group(2) or '')]
            continue
        if cur is None: continue
        if is_junk(l): continue
        cm = re.match(r'^([A-H])\.\s+CORRECT', l['t'])
        if cm: ans[cur] = cm.group(1)
        expl[cur].append(l)
        if cur >= last and expect > last: pass
    return ans, expl

# ---------- images ----------
def clip_rect(page, anchor, nxt, twocol):
    W, H = page.rect.width, page.rect.height
    mid = W/2
    if not twocol or anchor['col']=='F': x0, x1 = 30, W-30
    elif anchor['col']=='L': x0, x1 = 30, mid+4
    else: x0, x1 = mid-4, W-30
    y0 = anchor['y0'] - 5
    ids = [l['y0'] for l,_ in page_cache[page.number] if ID_RE.match(l['t']) and l['col']==anchor['col'] and l['y0'] > anchor['y0']+5]
    if nxt is not None and nxt['page']==anchor['page'] and nxt['col']==anchor['col']:
        y1 = nxt['y0'] - 8
    else:
        # lowest ink in this column above the footer (text, paths, images alike)
        # text objects can span a whole column, so take anything that reaches below the anchor
        ys = [r.y1 for r in ink(page) if r.x0 >= x0-2 and r.x1 <= x1+2 and r.y1 > y0 and r.y1 < H-45 and r.width < W*0.9]
        ys += [l['y1'] for l,_ in page_cache[page.number] if l['col']==anchor['col'] and not is_junk(l) and l['y0'] >= y0]
        y1 = (max(ys) if ys else anchor['y1']) + 8
    # extend across figures that sit within the range (tables, graphs) horizontally
    if ids: y1 = min(y1, min(ids) - 4)
    return pymupdf.Rect(x0, y0, x1, min(y1, H-42))

_ink = {}
def ink(page):
    k = (id(page.parent), page.number)
    if k not in _ink:
        _ink[k] = [pymupdf.Rect(r) for t, r in page.get_bboxlog() if not t.startswith('ignore')]
    return _ink[k]

def render(doc, page_no, rect, name):
    page = doc[page_no]
    if rect.height < 20: rect.y1 = rect.y0 + 40
    if rect.width < 20 or rect.y1 > page.rect.height: rect = pymupdf.Rect(30, rect.y0, page.rect.width-30, min(rect.y0+40, page.rect.height))
    pix = page.get_pixmap(matrix=pymupdf.Matrix(ZOOM, ZOOM), clip=rect, alpha=False)
    path = os.path.join(IMG, name + '.png')
    pix.save(path)
    return 'img/' + name + '.png'

def draw_rects(page):
    rs = []
    for d in page.get_drawings():
        r = d['rect']
        if r.width < 2 and r.height > 100: continue   # column rule
        if r.width > page.rect.width*0.9: continue     # header/footer rules
        rs.append(r)
    for im in page.get_image_info():
        rs.append(pymupdf.Rect(im['bbox']))
    return rs

def figure_clusters(page, pages_rects):
    """cluster drawing rects; keep clusters with >= 8 paths or any raster image."""
    rects = pages_rects
    imgs = [pymupdf.Rect(im['bbox']) for im in page.get_image_info()]
    clusters = []
    for r in rects:
        placed = False
        for c in clusters:
            if pymupdf.Rect(c['r']).intersects(r + (-6,-6,6,6)):
                c['r'] |= r; c['n'] += 1; placed = True; break
        if not placed: clusters.append(dict(r=pymupdf.Rect(r), n=1))
    # merge again
    merged = True
    while merged:
        merged = False
        for a in clusters:
            for b in clusters:
                if a is b: continue
                if a['r'].intersects(b['r'] + (-6,-6,6,6)):
                    a['r'] |= b['r']; a['n'] += b['n']; clusters.remove(b); merged = True; break
            if merged: break
    out = []
    for c in clusters:
        hasimg = any(c['r'].intersects(i) for i in imgs)
        if (c['n'] >= 8 or hasimg) and c['r'].width > 60 and c['r'].height > 30:
            out.append(c['r'])
    return out

# ---------- per form ----------
def build_form(fid):
    test = pymupdf.open(os.path.join(PDFDIR, fid + '.pdf'))
    ansf = os.path.join(PDFDIR, fid + '_ans.pdf')
    ansdoc = pymupdf.open(ansf) if os.path.exists(ansf) else test
    global page_cache, page_cache_draw
    page_cache = {p.number: [(l,None) for l in page_lines(p)[0]] for p in test}
    page_cache_draw = {p.number: draw_rects(p) for p in test}

    L = doc_lines(test)
    # find section boundaries (first occurrence of each kind, in test portion)
    secs = {}
    for k, l in enumerate(L):
        sk = sec_kind(l['t'])
        if sk and sk not in secs: secs[sk] = k
    order = sorted(secs, key=secs.get)
    print(fid, 'sections', [(s, secs[s]) for s in order])
    # answers doc lines (for the combined 2024/25 files: the explanations follow the test)
    if ansdoc is test:
        # explanations start at the last "REVISING/EDITING PART A" occurrence
        idx = [k for k,l in enumerate(L) if sec_kind(l['t'])=='rea']
        AL = L[idx[-1]-3:] if len(idx) > 1 else []
        testL = L[:idx[-1]-3] if len(idx) > 1 else L
    else:
        AL = doc_lines(ansdoc); testL = L
    secs = {}
    for k, l in enumerate(testL):
        sk = sec_kind(l['t'])
        if sk and sk not in secs: secs[sk] = k
    order = sorted(secs, key=secs.get)
    bounds = {s: (secs[s]+1, (secs[order[i+1]] if i+1 < len(order) else len(testL))) for i,s in enumerate(order)}

    # ELA question ranges: PART A/B first..last are unknown per year -> parse sequentially
    def sec_lines(s):
        a,b = bounds[s]; return [l for l in testL[a:b] if not is_junk(l) or ID_RE.match(l['t'])]
    # answers via 2025-style ID suffixes: ID line right before question
    id_ans = {}
    ela_lines = sec_lines('rea') + sec_lines('reb') + sec_lines('rc')
    for s in ('grid','mc'): ela_lines += sec_lines(s)
    pend = None
    for l in ela_lines:
        m = ID_RE.match(l['t'])
        if m:
            pend = m.group(1); continue
        qm = Q_RE.match(l['t'])
        if qm and pend:
            id_ans[int(qm.group(1))] = norm_ans(pend); pend = None
    id_ans = {n:a for n,a in id_ans.items() if n <= 114}

    # ELA
    ela = dict(parts=[])
    n = 1
    for s, name in (('rea','Revising/Editing Part A'), ('reb','Revising/Editing Part B'), ('rc','Reading Comprehension')):
        ls = [l for l in sec_lines(s) if not ID_RE.match(l['t'])]
        items = parse_items(ls, n, 57)
        part = dict(name=name, groups=[])
        cur = dict(passage=None, questions=[])
        for kind, it in items:
            if kind == 'passage':
                po = passage_obj(it)
                if po is None: continue
                if cur['questions'] or cur['passage']:
                    part['groups'].append(cur)
                cur = dict(passage=po, questions=[])
            else:
                cur['questions'].append(dict(n=it['n'], html=q_html(it), opts=[o['t'] for o in it['opts']],
                                             letters=[o['L'] for o in it['opts']]))
                n = it['n'] + 1
        if cur['questions'] or cur['passage']: part['groups'].append(cur)
        ela['parts'].append(part)
    # passage figures
    for part in ela['parts']:
        for g in part['groups']:
            p = g['passage']
            if not p: continue
            figs = []
            for pn in p['pages']:
                page = test[pn]
                for r in figure_clusters(page, page_cache_draw[pn]):
                    figs.append(render(test, pn, r + (-4,-4,4,4), f'{fid}_p{pn}_{int(r.y0)}'))
            p['figs'] = figs

    # MATH (images)
    math = dict(grid=[], mc=[])
    for s in ('grid','mc'):
        ls = sec_lines(s)
        # an ID line not followed by the expected question number: synthesize the anchor below it
        first = 58 if s=='grid' else 63; last = 62 if s=='grid' else 114
        expect, fixed = first, []
        for k, l in enumerate(ls):
            qm = Q_RE.match(l['t'])
            if qm and int(qm.group(1)) == expect: expect += 1
            if ID_RE.match(l['t']):
                soon = any(Q_RE.match(x['t']) and int(Q_RE.match(x['t']).group(1)) == expect for x in ls[k+1:k+7])
                if expect <= last and not soon:
                    fixed.append(dict(l, t=f'{expect}.', y0=l['y1']+2, y1=l['y1']+14)); expect += 1
                    print(fid, 'synthesized anchor for', expect-1, 'on page', l['page'])
                continue
            fixed.append(l)
        items = [it for k,it in parse_items(fixed, first, last) if k=='q']
        for j, q in enumerate(items):
            a = q['anchor']; page = test[a['page']]
            nxt = items[j+1]['anchor'] if j+1 < len(items) else None
            rect = clip_rect(page, a, nxt, a['two'])
            img = render(test, a['page'], rect, f'{fid}_q{q["n"]}')
            letters = [] if s=='grid' else (['A','B','C','D'] if q['n'] % 2 else ['E','F','G','H'])
            math[s].append(dict(n=q['n'], img=img, letters=letters))

    # ANSWERS
    key = key_table(AL)
    e_ans, expl = answers_from_expl(AL, 1, 114)
    letters = {q['n']: q['letters'] for p in ela['parts'] for g in p['groups'] for q in g['questions']}
    letters.update({q['n']: q['letters'] for q in math['mc']})
    for n, v in list(id_ans.items()):
        if n in letters and re.fullmatch(r'[1-4]', v) and len(letters[n]) == 4:
            id_ans[n] = letters[n][int(v)-1]
    ans = {}
    for q in range(1, 115):
        ans[q] = key.get(q) or id_ans.get(q) or e_ans.get(q)
    src = 'key' if key else 'ids' if id_ans else 'expl'
    conflicts = [(q, key.get(q), id_ans.get(q), e_ans.get(q)) for q in range(1,115)
                 if len({v for v in (key.get(q), id_ans.get(q), e_ans.get(q)) if v}) > 1]
    if conflicts: print(fid, 'ANSWER CONFLICTS', conflicts)
    missing = [q for q in range(1,115) if not ans[q]]
    print(fid, 'answers from', src, 'missing', missing, 'expl for', len(expl))

    # explanations: ELA text, math image
    def expl_html(q):
        ls = expl.get(q)
        if not ls: return ''
        paras, cur = [], []
        for l in ls:
            if cur and (re.match(r'^[A-H]\. ', l['t']) or l['y0'] - prev['y1'] > 8 or l['page'] != prev['page']):
                paras.append(' '.join(cur)); cur = []
            cur.append(l['t']); prev = l
        if cur: paras.append(' '.join(cur))
        out = []
        for ptxt in paras:
            ptxt = esc(ptxt)
            ptxt = re.sub(r'^([A-H]\. CORRECT\.?)', r'<b class="ok">\1</b>', ptxt)
            ptxt = re.sub(r'^([A-H]\. Incorrect\.?)', r'<b>\1</b>', ptxt)
            out.append('<p>' + ptxt + '</p>')
        return ''.join(out)
    def expl_img(q):
        ls = expl.get(q)
        if not ls: return ''
        a = ls[0]; nxt = (expl.get(q+1) or [None])[0]
        page = ansdoc[a['page']]
        # temporarily point caches at the answer doc page
        pl, _ = page_lines(page)
        page_cache[page.number] = [(l,None) for l in pl]; page_cache_draw[page.number] = draw_rects(page)
        rect = clip_rect(page, a, nxt, a['two'])
        return render(ansdoc, a['page'], rect, f'{fid}_e{q}')

    for part in ela['parts']:
        for g in part['groups']:
            for q in g['questions']:
                a = ans[q['n']]
                q['a'] = q['letters'].index(a) if a in q['letters'] else -1
                q['exp'] = expl_html(q['n'])
    for q in math['grid']:
        q['a'] = ans[q['n']]; q['exp'] = expl_img(q['n'])
    for q in math['mc']:
        a = ans[q['n']]
        q['a'] = q['letters'].index(a) if a in q['letters'] else -1
        q['exp'] = expl_img(q['n'])

    # sanity
    nq = sum(len(g['questions']) for p in ela['parts'] for g in p['groups'])
    bad = [(q['n'], len(q['opts'])) for p in ela['parts'] for g in p['groups'] for q in g['questions'] if len(q['opts'])!=4 or q['a']<0]
    badm = [(q['n'], len(q['letters'])) for q in math['mc'] if len(q['letters'])!=4 or q['a']<0]
    print(fid, 'missing mc', sorted(set(range(63,115)) - {q['n'] for q in math['mc']}), 'missing grid', sorted(set(range(58,63)) - {q['n'] for q in math['grid']}))
    print(fid, f'ELA {nq} q, groups', [len(p['groups']) for p in ela['parts']], 'bad', bad,
          '| math', len(math['grid']), len(math['mc']), 'bad', badm)
    return dict(id=fid, ela=ela, math=math)

forms = ONLY or sorted(f[:-4] for f in os.listdir(PDFDIR) if re.match(r'^\d{4}[AB]\.pdf$', f))
bank = []
for fid in forms:
    try:
        bank.append(build_form(fid))
    except Exception as e:
        import traceback; traceback.print_exc(); print(fid, 'FAILED', e)
with open(os.path.join(OUT, 'bank.js'), 'w') as f:
    f.write('const BANK = ' + json.dumps(bank, ensure_ascii=False) + ';\n')
print('wrote', len(bank), 'forms')
