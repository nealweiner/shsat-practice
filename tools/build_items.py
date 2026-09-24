#!/usr/bin/env python3
"""Pull the Revising/Editing items out of ../bank.js, tag each with a
grammar concept, and write items.js (ITEMS + PASSAGES) for the grammar app."""
import json, re, collections, sys, os
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'bank.js')
bank = json.loads(open(src).read()[len('const BANK = '):-2])
RULES = [
 ('organization', r'introduce the (main )?(topic|claim)|state the (main )?(topic|claim)|topic sentence|concluding sentence|best conclude|shifts away|least relevant|irrelevant|be moved|organization|follow and support|support the ideas|best support|best follow|replace sentence \d+ to best|added (after|before|between)|develop the (ideas|claim)'),
 ('transition', r'transition'),
 ('precise', r'precise|vague language|formal style|maintains the (formal )?style|wordiness|concise'),
 ('combine', r'combine the sentences|best way to combine'),
 ('modifier', r'modif|dangling|misplaced'),
 ('runon', r'run-on|comma splice|fragment|error in (its )?(sentence )?(structure|construction)|structural error'),
 ('tense', r'tense'),
 ('pronoun', r'pronoun|antecedent'),
 ('agreement', r'agreement|subject and (the )?verb|singular|plural'),
 ('parallel', r'parallel'),
 ('punct', r'colon|semicolon|apostrophe|dash|hyphen'),
 ('comma', r'comma|nonrestrictive|restrictive|coordinate adjective|introductory|series|appositive'),
]
def tag(stem, opts, exp):
    for name, rx in RULES:
        if re.search(rx, stem + ' ' + opts): return name
    for name, rx in RULES:
        if re.search(rx, exp): return name
    return 'organization'
items, passages, cnt = [], {}, collections.Counter()
for f in bank:
    label = f['id'][:4] + ' Form ' + f['id'][4:]
    for pi, p in enumerate(f['ela']['parts'][:2]):
        for gi, g in enumerate(p['groups']):
            pid = None
            if g['passage']:
                pid = f['id'] + ':' + str(gi)
                passages[pid] = dict(title=g['passage']['title'], html=g['passage']['html'])
            for q in g['questions']:
                stem = re.sub('<[^>]+>', ' ', q['html']).lower()
                t = tag(stem, ' '.join(q['opts']).lower(), re.sub('<[^>]+>', ' ', q['exp']).lower())
                cnt[t] += 1
                items.append(dict(id=f['id'] + ':' + str(q['n']), form=label, n=q['n'], tag=t, pid=pid,
                                  html=q['html'], opts=q['opts'], letters=q['letters'], a=q['a'], exp=q['exp']))
out = os.path.join(os.path.dirname(__file__), '..', 'items.js')
open(out, 'w').write('const ITEMS = ' + json.dumps(items, ensure_ascii=False) + ';\nconst PASSAGES = ' + json.dumps(passages, ensure_ascii=False) + ';\n')
print(len(items), 'items,', len(passages), 'passages;', dict(cnt))
