# Writing hard SHSAT-style math problems

You are writing new math problems for an adaptive practice app used by a strong NYC 8th grader preparing for the SHSAT (no calculator, about 90 seconds per problem). The real bank is mostly too easy for him, so every problem you write must be at the difficulty of the **hardest 15% of real SHSAT problems**: rating 4 or 5 on this scale.

- 4: needs an insight, an unusual setup, careful case work, or heavy arithmetic; strong students miss it under time pressure
- 5: the hardest problems on the test; most students miss these

Stay inside SHSAT content (8th-grade): integers and number theory (remainders, divisibility, digits, consecutive integers), fractions/percents/ratios with several steps, rates and work problems, linear equations and inequalities, exponents and scientific notation, simplifying expressions, geometry you can state in words (angles, area and perimeter of composites, circles, Pythagorean theorem, volume), coordinate geometry (slope, distance, midpoints), mean/median/mode traps, probability and counting, sequences and patterns. No calculus, no quadratics beyond factoring simple ones, no trigonometry.

Read the real examples in `mathtext.json` in this directory for the voice (search for a few problems with "least", "greatest", "remainder", "probability", "consecutive" to see how hard ones are phrased). Do not copy any of them; write original problems.

## Hard requirements
- **No diagrams.** Describe any figure in words so it can be rendered as text.
- Mix of types: about 7 multiple-choice and 3 grid-in (numeric answer) per set.
- Multiple choice: exactly four options, one correct. The three wrong options must come from specific plausible mistakes (stopping a step early, sign error, using the wrong unit, off-by-one, forgetting a case), not random numbers.
- Grid-in answers are a single number (integer or decimal, or a fraction written like 3/4). State the required form in the problem when it matters ("Express your answer as a decimal").
- **Verify every answer by computing it** (use Python via Bash for anything with arithmetic; enumerate cases for counting and probability). A wrong answer key is worse than no problem. Also check that no wrong option accidentally equals the right answer.
- Explanation: for multiple choice, first the solution, then one short line per option in the official SHSAT style: `<p><b>A. Incorrect.</b> ...</p><p><b>B. CORRECT.</b> ...</p>` naming the mistake each wrong option represents. For grid-in, the worked solution.
- Keep each problem self-contained and unambiguous. Say which integers or units are meant.

## Format
HTML strings, plain and small. Use `<p>` for paragraphs, `<sup>` for exponents, `&times;`, `&minus;`, `&divide;`, `&pi;`, `&deg;`, `&radic;`, `&le;`, `&ge;`, `&ne;`. Write fractions as `<span class="frac"><span class="fnum">3</span><span class="fden">4</span></span>` (renders stacked) and mixed numbers as `2<span class="frac">...</span>`. Variables in `<i>x</i>`. No images, no MathJax, no LaTeX.

Write a JSON array to `gen/<your-set-name>.json` in this directory (create `gen/` if needed):

```json
[{
  "id": "gen:ratios-01",
  "topic": "ratios-rates",
  "rating": 5,
  "kind": "mc",
  "html": "<p>A tank is filled by pipe A in 6 hours ...</p>",
  "opts": ["2", "2.4", "3", "3.6"],
  "a": 1,
  "exp": "<p>...solution...</p><p><b>A. Incorrect.</b> ...</p><p><b>B. CORRECT.</b> ...</p><p><b>C. Incorrect.</b> ...</p><p><b>D. Incorrect.</b> ...</p>"
},{
  "id": "gen:ratios-02",
  "topic": "ratios-rates",
  "rating": 4,
  "kind": "grid",
  "html": "<p>...</p>",
  "a": "2.4",
  "exp": "<p>...worked solution...</p>"
}]
```

Topics must be one of: arithmetic, fractions-percents, ratios-rates, number-theory, algebra-expressions, equations-inequalities, word-problems, geometry-angles, geometry-measure, coordinate-geometry, statistics, probability-counting, functions-patterns. Use the id prefix `gen:<set-name>-NN`. When done, reply with just the file path and the count of problems by rating.
