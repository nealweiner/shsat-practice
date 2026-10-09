#!/usr/bin/env python3
"""Build mathmeta.js: {id: {t: topic, r: rating 1-5, d: percentile difficulty in [0,1]}}.
Ratings come from ratings/<form>.json (rater output per tools/rubric.md) when a directory is
given, else from tools/ratings.json (a snapshot of the last run). Generated problems in
genmath.js are ranked alongside the real ones. Duplicate questions (dups.js) share one rank:
their ratings are averaged and both ids get the same d."""
import json, glob, os, sys
from collections import Counter
here = os.path.dirname(os.path.abspath(__file__))
snap = os.path.join(here, 'ratings.json')
rows = []
if len(sys.argv) > 1 and os.path.isdir(sys.argv[1]):
    for f in sorted(glob.glob(os.path.join(sys.argv[1], '*.json'))): rows += json.load(open(f))
else:
    rows = json.load(open(snap))
gen = os.path.join(here, '..', 'genmath.js')
if os.path.exists(gen):
    txt = open(gen).read(); txt = txt[txt.index('[') : txt.rindex(']') + 1]
    rows += [{'id': g['id'], 'topic': g['topic'], 'rating': g['rating']} for g in json.loads(txt)]
rows = list({r['id']: r for r in rows}.values())
json.dump([r for r in rows if not r['id'].startswith('gen:')], open(snap, 'w'))
dups = {}
dp = os.path.join(here, '..', 'dups.js')
if os.path.exists(dp): t = open(dp).read(); dups = json.loads(t[t.index('{'): t.rindex('}') + 1])
canon = lambda i: dups.get(i, i)
groups = {}
for r in rows: groups.setdefault(canon(r['id']), []).append(r)
def key(c):
    rs = groups[c]; rating = sum(x['rating'] for x in rs) / len(rs)
    fid, n = c.split(':'); k = sum(map(ord, n)); return (rating, k % 7, fid, n)
ordered = sorted(groups, key=key)
N = len(ordered)
meta = {}
for i, c in enumerate(ordered):
    rs = groups[c]; rating = round(sum(x['rating'] for x in rs) / len(rs), 2)
    d = round((i + 0.5) / N, 4)
    for x in rs: meta[x['id']] = {'t': rs[0]['topic'], 'r': rating, 'd': d}
open(os.path.join(here, '..', 'mathmeta.js'), 'w').write('const MATHMETA = ' + json.dumps(meta, separators=(',', ':')) + ';\n')
print(N, 'distinct problems (', len(rows), 'ids );', 'ratings', dict(sorted(Counter(round(key(c)[0]) for c in ordered).items())))
