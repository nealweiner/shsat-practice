# Writing extra Revising/Editing questions

You are writing new grammar questions for a practice app used by one strong NYC 8th grader preparing for the SHSAT. The official sample tests hold almost no stand-alone questions on some concepts (subject-verb agreement 0, pronouns 1, verb tense 2, colons and semicolons 2, modifiers 4), so he cannot practice them or be rated on them. Your questions fill that gap. They sit beside the real ones, labelled "Extra".

Model them on Revising/Editing Part A of the SHSAT: a boxed sentence or a short numbered paragraph of four sentences on a factual topic (science, history, city life, school, arts, sports), then one question with four options and exactly one correct answer. Formal, neutral, informative voice, like a textbook sidebar. Original content only; do not reuse the gelato, Play-Doh, debate-team bake sale, Eliza and Brianna, or Devon's audition material from the real tests.

## Difficulty
He already gets the easy ones. Aim at the hard end of the real test and a little past it: the error should survive a quick read. Use the traps the test uses, for example
- agreement: a long phrase between subject and verb; subject after the verb ("There are/is", "Among the ... was/were"); "each", "neither", "one of the", "a number of / the number of"; either/or and neither/nor (verb agrees with the nearer subject); collective nouns; "along with / as well as" (does not make a plural).
- pronoun: two possible antecedents for he/she/they/it; "this", "which", or "it" pointing at a whole idea or at nothing; a pronoun that disagrees in number with a distant antecedent (each ... their, the team ... they/it, a person ... they in formal test English); unnecessary shift between "one" and "you".
- tense: one verb out of frame in a past (or present) narrative, buried mid-sentence; include legitimate shifts that are NOT errors in the other sentences (past perfect for an earlier event, present tense for a general truth or for what a text "says", future for a plan) so he has to judge rather than scan.
- punct (colons, semicolons, and the "pair of revisions" format): a colon must follow a complete sentence; a semicolon joins two complete sentences or separates list items that contain commas; a semicolon before "however/therefore" between sentences, comma after it. At least half of this set must be the real test's "Which pair of revisions need to be made in this paragraph?" format: four options, one per sentence, each proposing two changes joined by AND; exactly one option fixes two real errors and each other option would break something that is correct.
- modifier: dangling opening -ing/-ed/"To ..." phrases; misplaced "only/nearly/almost"; a phrase stranded far from its noun; "How should this sentence be revised?" with four rewrites where three still dangle or are clumsy.

## Hard requirements
- Exactly one option is correct, and a careful English teacher would agree without argument. Every sentence not flagged as wrong must be fully correct standard written English: no accidental comma splices, no debatable usage (avoid singular "they" as a trap unless the question is explicitly about formal agreement, avoid "data is/are", "none is/are", and any point on which style guides differ).
- In "which sentence" questions the four options are exactly "sentence 1", "sentence 2", "sentence 3", "sentence 4" and the paragraph's sentences are numbered (1) to (4).
- Wrong options must be tempting for a specific reason (a legitimate tense shift, a plural noun next to a correctly singular verb, a correct semicolon that looks odd).
- Spread the correct answer evenly over positions A to D across your set.
- Vary the question format within the set; do not write ten clones.
- Explanation in the official style: one sentence on what the question asks and why the right option is right, naming the exact words, then why each wrong option is wrong. Plain HTML: `<p>`, `<i>` for quoted words.
- After writing, reread each item as a test-taker with the key hidden and confirm you land on the key and that no second option is defensible. Fix or replace any that fail.

## Format
A JSON array written to the path you are given. Curly quotes and apostrophes (’ “ ”) in prose, as the real items use.

```json
[{
  "id": "gg:agreement-01",
  "tag": "agreement",
  "html": "<p>Read this sentence.</p><blockquote>The collection of vintage posters in the library’s basement were donated by a former teacher.</blockquote><p>Which edit should be made to correct this sentence?</p>",
  "opts": ["Change <i>were</i> to <i>was</i>.", "Change <i>posters</i> to <i>poster</i>.", "Change <i>donated</i> to <i>donates</i>.", "Insert a comma after <i>basement</i>."],
  "a": 0,
  "exp": "<p>The question asks ... </p><p><b>A. CORRECT.</b> ...</p><p><b>B. Incorrect.</b> ...</p><p><b>C. Incorrect.</b> ...</p><p><b>D. Incorrect.</b> ...</p>"
}]
```

`tag` is one of agreement, pronoun, tense, punct, modifier. `a` is the 0-based index of the correct option. Ids are `gg:<tag>-NN`. Paragraph questions put the paragraph in one `<blockquote>` with sentence numbers like `(1) ... (2) ...`. When done, reply with just the file path and the count.
