# Rating SHSAT math problems

You are rating math problems from official NYC SHSAT sample tests (8th-grade admissions test, no calculator) by topic and difficulty, for an adaptive practice app used by one 8th grader.

Input: `mathtext.json` in this directory maps ids like `2025A:63` to `{kind: "grid"|"mc", text, fig}`. The text is extracted from the PDF, so fractions, exponents, and figures are garbled or missing (`fig: true` means there is a diagram or table). If the text is too thin to judge (fewer than ~8 words, or a figure you need to see), look at the rendered image: `/Users/neal/code/Kid Apps/shsat-practice/img/<form>_q<n>.png`, e.g. `/Users/neal/code/Kid Apps/shsat-practice/img/2025A_q58.png`. Only read images when needed.

## Topic (choose exactly one)
- `arithmetic` : integers, order of operations, decimals, absolute value, basic computation
- `fractions-percents` : fractions, mixed numbers, decimals, percents, percent change
- `ratios-rates` : ratios, proportions, rates, speed, unit conversion, scale
- `number-theory` : factors, multiples, primes, divisibility, remainders, consecutive integers, digits
- `algebra-expressions` : simplify or evaluate expressions, exponents, radicals, scientific notation, like terms
- `equations-inequalities` : solve linear equations or inequalities, systems, number-line graphs of solutions
- `word-problems` : multi-step story problems (money, ages, work, mixtures) that are mainly translation into arithmetic or algebra
- `geometry-angles` : angles, triangles, polygons, parallel lines, angle sums
- `geometry-measure` : perimeter, area, volume, surface area, circles, Pythagorean theorem
- `coordinate-geometry` : coordinate plane, slope, distance, transformations, graphs of lines
- `statistics` : mean, median, mode, range, reading tables and charts
- `probability-counting` : probability, outcomes, arrangements, combinations
- `functions-patterns` : sequences, patterns, function tables and rules

## Difficulty (1 to 5)
Judge how hard it is for a strong 8th grader working without a calculator under time pressure. Consider number of steps, how much translation or insight is needed, how tempting the wrong choices are, and how heavy the arithmetic is.
- 1: one step, direct recall or a single operation; a well-prepared student answers in under 30 seconds
- 2: one concept, two or three routine steps
- 3: two concepts combined, or a multi-step chain where each step is routine
- 4: needs an insight, an unusual setup, careful case work, or heavy arithmetic; strong students miss it under time pressure
- 5: the hardest problems on the test; most students miss these

Within one form, aim for roughly 10% rated 1, 25% rated 2, 35% rated 3, 22% rated 4, 8% rated 5. Grid-in problems (58 to 62) are not automatically harder.

## Output
Write a JSON array, one object per problem of your form, to `ratings/<form>.json` in this directory (create the `ratings` folder if needed), with every one of the 57 problems (58 through 114) present:

```json
[{"id": "2025A:58", "topic": "arithmetic", "rating": 2, "why": "signed decimal sum, three terms"}, ...]
```

Keep `why` under ten words. Rate every problem; do not skip any. When finished, reply with just the counts of each rating.
