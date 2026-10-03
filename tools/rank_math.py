#!/usr/bin/env python3
"""Merge the per-form rating files (ratings/<form>.json, from the rubric in tools/rubric.md)
into mathmeta.js: {id: {t: topic, r: rating 1-5, d: percentile difficulty in [0,1]}}.
d is the mid-rank percentile of (rating, form, n) across the whole bank, so ties within a
rating are spread deterministically rather than piled on one value."""
import json, glob, os, sys
src = sys.argv[1] if len(sys.argv) > 1 else 'ratings'
rows = []
for f in sorted(glob.glob(os.path.join(src, '*.json'))):
    rows += json.load(open(f))
# generated problems (genmath.js, ids gen:...) are ranked alongside the real ones
gen = os.path.join(os.path.dirname(__file__), '..', 'genmath.js')
if os.path.exists(gen):
    txt = open(gen).read(); txt = txt[txt.index('[') : txt.rindex(']') + 1]
    rows += [{'id': g['id'], 'topic': g['topic'], 'rating': g['rating']} for g in json.loads(txt)]
rows = {r['id']: r for r in rows}.values()
def key(r):
    fid, n = r['id'].split(':'); k = sum(map(ord, n)); return (r['rating'], k % 7, fid, n)   # scramble within a rating
ordered = sorted(rows, key=key)
N = len(ordered)
meta = {}
for i, r in enumerate(ordered):
    meta[r['id']] = {'t': r['topic'], 'r': r['rating'], 'd': round((i + 0.5) / N, 4)}
out = os.path.join(os.path.dirname(__file__), '..', 'mathmeta.js')
open(out, 'w').write('const MATHMETA = ' + json.dumps(meta, separators=(',', ':')) + ';\n')
from collections import Counter
print(N, 'problems; ratings', dict(sorted(Counter(r['rating'] for r in ordered).items())), '; topics', dict(Counter(r['topic'] for r in ordered).most_common()))
