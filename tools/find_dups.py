#!/usr/bin/env python3
"""The DOE reuses material across sample forms: six forms carry another form's math section
nearly whole, and ELA passages recombine. Map every duplicate question id to a canonical
(earliest) id so the app can treat the pair as one problem. Writes dups.js."""
import json, re, itertools, os
here = os.path.dirname(os.path.abspath(__file__))
bank = json.loads(open(os.path.join(here, '..', 'bank.js')).read()[len('const BANK = '):-2])
F = {f['id']: f for f in bank}
ids = sorted(F)
norm = lambda t: re.sub(r'[^a-z0-9]', '', re.sub('<[^>]+>', ' ', t).lower())
dups = {}
# ELA: identical normalized stem + options anywhere in the bank
seen = {}
for fid in ids:
    for p in F[fid]['ela']['parts']:
        for g in p['groups']:
            for q in g['questions']:
                k = norm(q['html'] + ' '.join(q['opts']))
                if len(k) < 40: continue
                if k in seen: dups[f'{fid}:{q["n"]}'] = seen[k]
                else: seen[k] = f'{fid}:{q["n"]}'
# math: forms whose answer keys agree far beyond chance share the section; matching positions are the same problem
def key(f): return {q['n']: str(q['a']) for q in f['math']['grid'] + f['math']['mc']}
pairs = []
for a, b in itertools.combinations(ids, 2):
    ka, kb = key(F[a]), key(F[b])
    same = [n for n in ka if n in kb and ka[n] == kb[n]]
    if len(same) >= 45:
        pairs.append((a, b, len(same)))
        for n in same: dups[f'{b}:{n}'] = f'{a}:{n}'
out = os.path.join(here, '..', 'dups.js')
open(out, 'w').write('const DUPS = ' + json.dumps(dups, separators=(',', ':')) + ';\n')
print('math section pairs:', pairs)
print(len(dups), 'duplicate questions mapped;', sum(1 for k in dups if int(k.split(':')[1]) >= 58), 'math,', sum(1 for k in dups if int(k.split(':')[1]) < 58), 'ELA')
