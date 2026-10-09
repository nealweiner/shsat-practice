#!/usr/bin/env python3
"""Merge the written Revising/Editing questions (tools/gengrammar/*.json, written to the brief in
tools/grammarbrief.md) into gengrammar.js, in the same shape as the real items in items.js."""
import json, glob, os
here = os.path.dirname(os.path.abspath(__file__))
out, seen = [], set()
for f in sorted(glob.glob(os.path.join(here, 'gengrammar', '*.json'))):
    for r in json.load(open(f, encoding='utf-8')):
        assert r['id'] not in seen and len(r['opts']) == 4 and 0 <= r['a'] < 4, r['id']
        seen.add(r['id'])
        out.append(dict(id=r['id'], form='Extra', n=r['id'].split(':')[1], tag=r['tag'], pid=None, html=r['html'],
                        opts=r['opts'], letters=['A', 'B', 'C', 'D'], a=r['a'], exp=r['exp']))
open(os.path.join(here, '..', 'gengrammar.js'), 'w', encoding='utf-8').write('const GENGRAMMAR = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(len(out), 'written grammar questions')
