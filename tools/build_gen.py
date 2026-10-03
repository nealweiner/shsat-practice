#!/usr/bin/env python3
"""Merge generated problem sets (gen/*.json, written to the brief in tools/genbrief.md) into genmath.js."""
import json, glob, os, sys
src = sys.argv[1] if len(sys.argv) > 1 else 'gen'
rows = []
for f in sorted(glob.glob(os.path.join(src, '*.json'))): rows += json.load(open(f))
seen = set(); out = []
for r in rows:
    if r['id'] in seen: continue
    seen.add(r['id']); out.append({k: r[k] for k in ('id', 'topic', 'rating', 'kind', 'html', 'opts', 'a', 'exp') if k in r})
dst = os.path.join(os.path.dirname(__file__), '..', 'genmath.js')
open(dst, 'w').write('const GENMATH = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(len(out), 'generated problems')
