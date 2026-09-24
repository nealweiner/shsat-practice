// Grammar concepts for the SHSAT Revising/Editing section, taught by example.
// Each concept: rule in plain words, wrong/right pairs, a note on how the test asks it,
// three self-check items, and the tags that pick its real SHSAT items out of items.js.
// Self-check items follow the test's own shape: a sentence, a question, four choices.
var CONCEPTS = [
{
  id: 'clauses', group: 'Building blocks', name: 'Clauses: complete and incomplete',
  rule: 'A <b>clause</b> is a group of words with a subject (who or what) and a verb (what it does). An <b>independent clause</b> can stand alone as a sentence. A <b>dependent clause</b> starts with a word like <i>because, although, when, which, that, if</i> and cannot stand alone; it leans on an independent clause.',
  pairs: [
    ['<u>The museum opened in 2016.</u>', 'Independent: subject <i>museum</i>, verb <i>opened</i>. A complete sentence.'],
    ['<u>Because the museum opened in 2016</u>', 'Dependent: the word <i>because</i> makes it lean forward. It needs a finish: <i>Because the museum opened in 2016, its collection is still growing.</i>'],
    ['The gloves, <u>which belonged to Muhammad Ali</u>, are on display.', 'A dependent <i>which</i> clause tucked inside an independent one. Remove it and the sentence still stands.']
  ],
  note: 'The test never asks you to name a clause. But every question about run-ons, commas, and combining sentences is really asking: where does one complete thought end and the next begin?',
  check: [
    {q: 'Which of these is a complete sentence on its own?', opts: ['Although the trail is more than 2,000 miles long', 'When hikers reach the summit in late afternoon', 'The trail crosses fourteen states', 'Which is why most hikers start in Georgia'], a: 2, why: 'Only <i>The trail crosses fourteen states</i> has a subject and a verb with no word in front making it depend on something else. The others start with <i>although, when, which</i>, so they lean on a clause that is missing.'},
    {q: 'Read this sentence.<blockquote>The bakery, which opened in 1954, still uses its original ovens.</blockquote>Which part could be removed and leave a complete sentence?', opts: ['The bakery', 'which opened in 1954', 'still uses its original ovens', 'its original ovens'], a: 1, why: 'The <i>which</i> clause is dependent and just adds information. <i>The bakery still uses its original ovens</i> stands on its own.'},
    {q: 'How many independent clauses are in this sentence?<blockquote>The storm knocked out power for two days, and the town opened a shelter in the school.</blockquote>', opts: ['none', 'one', 'two', 'three'], a: 2, why: '<i>The storm knocked out power</i> and <i>the town opened a shelter</i> can each stand alone. They are joined by a comma plus <i>and</i>, which is one correct way to join two independent clauses.'}
  ],
  tags: []
},
{
  id: 'runon', group: 'Sentence structure', name: 'Run-ons, comma splices, and fragments',
  rule: 'Two independent clauses cannot be glued with just a comma (a <b>comma splice</b>) or nothing at all (a <b>run-on</b>). Join them with a period, a semicolon, or a comma <i>plus</i> a joining word (<i>and, but, so, because</i>). A <b>fragment</b> is the opposite problem: a dependent clause or a phrase pretending to be a sentence.',
  pairs: [
    ['<s>The museum opened in 2016, it is already the third most popular site.</s>', 'The museum opened in 2016, <b>and</b> it is already the third most popular site.'],
    ['<s>Experts expect four million visitors a year the museum was built for it.</s>', 'Experts expect four million visitors a year<b>;</b> the museum was built for it.'],
    ['<s>Because the exhibit includes a dress sewn by Rosa Parks.</s>', 'The exhibit is popular <b>because</b> it includes a dress sewn by Rosa Parks.']
  ],
  note: 'Asked as "Which revision corrects the error in sentence structure?" or "Which sentence contains an error in its construction?" Read each numbered sentence and ask: is there a comma doing a period’s job, or a piece that never finishes?',
  check: [
    {q: 'Which sentence contains an error in its construction?<blockquote>(1) The city planted 400 trees along the avenue last spring. (2) Most of them are oaks, a few are maples. (3) Volunteers water the young trees every week. (4) By next summer the avenue should be noticeably shadier.</blockquote>', opts: ['sentence 1', 'sentence 2', 'sentence 3', 'sentence 4'], a: 1, why: 'Sentence 2 joins two independent clauses with only a comma. Fix: <i>Most of them are oaks, and a few are maples</i>, or use a semicolon.'},
    {q: 'Read this sentence.<blockquote>The robotics team qualified for the state finals, they had practiced every afternoon for a month.</blockquote>Which revision corrects the error in sentence structure?', opts: ['finals, they had practiced,', 'finals; they had practiced', 'finals they had practiced', 'finals, and they, had practiced'], a: 1, why: 'A semicolon can join two closely related independent clauses. Choice A adds a stray comma, C makes a run-on, D adds a comma between the subject and verb.'},
    {q: 'Which sentence is a fragment?<blockquote>(1) Sea otters wrap themselves in kelp before they sleep. (2) The kelp keeps them from drifting away. (3) Which is why a group of resting otters is called a raft. (4) Pups often sleep on their mothers’ chests.</blockquote>', opts: ['sentence 1', 'sentence 2', 'sentence 3', 'sentence 4'], a: 2, why: '<i>Which is why…</i> is a dependent clause with nothing to depend on. Attach it: <i>…drifting away, which is why a group of resting otters is called a raft.</i>'}
  ],
  tags: ['runon']
},
{
  id: 'setoff', group: 'Commas', name: 'Commas that set off extra information',
  rule: 'If a phrase or clause could be lifted out without changing who or what you mean, it is <b>nonrestrictive</b>: fence it off with a comma on <i>both</i> sides. If it is needed to identify the thing, it is <b>restrictive</b>: no commas. Places and dates work the same way: <i>Rome, Italy,</i> and <i>May 8, 2018,</i> take a comma after as well as before.',
  pairs: [
    ['<s>The Colosseum in Rome, Italy which is the largest amphitheater ever built, once held 50,000 people.</s>', 'The Colosseum in Rome, Italy<b>,</b> which is the largest amphitheater ever built, once held 50,000 people.'],
    ['The runner<b>,</b> who trains at dawn<b>,</b> won the race.', 'Commas mean <i>there is one runner; by the way, she trains at dawn.</i>'],
    ['The runner who trains at dawn won the race.', 'No commas mean <i>of all the runners, the one who trains at dawn won.</i> The clause picks her out, so it stays attached.']
  ],
  note: 'Asked as "Which edit should be made in the sentence?" with choices like "Insert a comma after Italy." Test each comma choice by covering the phrase: if the sentence still means the same thing, the phrase needs commas on both sides.',
  check: [
    {q: 'Read this sentence.<blockquote>On May 8, 2018, Boston University student Zach Prescott ran a mile in 4 minutes 43.2 seconds while juggling, breaking the world record in joggling a sport that combines jogging and juggling.</blockquote>Which edit should be made in the sentence?', opts: ['Delete the comma after 2018.', 'Insert a comma after student.', 'Delete the comma after juggling.', 'Insert a comma after joggling.'], a: 3, why: '<i>a sport that combines jogging and juggling</i> renames <i>joggling</i>; it is extra information and needs a comma before it. The comma after 2018 closes the date, and <i>student Zach Prescott</i> needs no comma because the name identifies which student.'},
    {q: 'Read this sentence.<blockquote>My cousin Ana, who lives in Denver is visiting for the holidays.</blockquote>Which edit should be made in the sentence?', opts: ['Delete the comma after Ana.', 'Insert a comma after Denver.', 'Insert a comma after cousin.', 'Insert a comma after visiting.'], a: 1, why: 'The <i>who</i> clause is nonrestrictive (Ana is already identified by name), so it needs a comma at both ends. Choice A removes the opening fence instead of adding the closing one.'},
    {q: 'Read this sentence.<blockquote>Students, who forget their permission slips, will not be allowed on the bus.</blockquote>Which edit should be made in the sentence?', opts: ['Delete both commas.', 'Delete the comma after slips only.', 'Insert a comma after allowed.', 'Change who to which.'], a: 0, why: 'Here the clause is restrictive: it tells <i>which</i> students. Only those who forget the slip stay behind, so no commas. With the commas, the sentence claims that all students forget their slips.'}
  ],
  tags: ['comma']
},
{
  id: 'series', group: 'Commas', name: 'Commas in lists, between adjectives, and where they do not belong',
  rule: 'Use commas between items in a series (<i>dogs, cats, and rabbits</i>), between two adjectives that could be swapped or joined by <i>and</i> (<i>the agile, athletic center</i>), and after an introductory phrase (<i>After the game, we ate</i>). Do <b>not</b> put a comma between a subject and its verb, or before a second verb that shares the same subject.',
  pairs: [
    ['<s>Volunteers help with walking dogs cleaning kennels, and feeding kittens.</s>', 'Volunteers help with walking dogs<b>,</b> cleaning kennels, and feeding kittens.'],
    ['<s>In 1962 the agile athletic Wilt Chamberlain scored 100 points.</s>', 'In 1962 the agile<b>,</b> athletic Wilt Chamberlain scored 100 points. (Test: <i>agile and athletic</i> sounds fine, so they take a comma.)'],
    ['<s>The team practiced every afternoon, and won the final.</s>', 'The team practiced every afternoon and won the final. (One subject, two verbs: no comma.)']
  ],
  note: 'The trap answers on these questions insert a comma between a subject and its verb, or before <i>and</i> when it joins two verbs rather than two full clauses. Ask: does a whole new subject follow the <i>and</i>?',
  check: [
    {q: 'Read this sentence.<blockquote>The recipe calls for flour sugar, and two eggs, but my grandmother always adds a pinch of salt.</blockquote>Which edit should be made in the sentence?', opts: ['Insert a comma after flour.', 'Delete the comma after sugar.', 'Delete the comma after eggs.', 'Insert a comma after always.'], a: 0, why: 'Items in a series each get a comma: <i>flour, sugar, and two eggs</i>. The comma after <i>eggs</i> is correct because <i>but</i> joins two independent clauses.'},
    {q: 'Read this sentence.<blockquote>The tall, narrow, brick building, on the corner was once a firehouse.</blockquote>Which edit should be made in the sentence?', opts: ['Delete the comma after tall.', 'Delete the comma after building.', 'Insert a comma after corner.', 'Delete the comma after narrow.'], a: 1, why: 'The comma after <i>building</i> splits the subject (<i>The tall, narrow, brick building on the corner</i>) from its verb (<i>was</i>). The adjective commas are fine: <i>tall and narrow</i> can be swapped.'},
    {q: 'Read this sentence.<blockquote>After the concert ended the crowd waited outside the stage door for nearly an hour.</blockquote>Which edit should be made in the sentence?', opts: ['Insert a comma after concert.', 'Insert a comma after ended.', 'Insert a comma after door.', 'Insert a comma after outside.'], a: 1, why: '<i>After the concert ended</i> is an introductory clause; a comma marks where the main sentence starts. Without it, a reader briefly thinks the concert ended the crowd.'}
  ],
  tags: ['comma']
},
{
  id: 'modifier', group: 'Sentence structure', name: 'Misplaced and dangling modifiers',
  rule: 'A describing phrase attaches to the nearest noun. If the nearest noun is the wrong one, the sentence says something silly: <i>Walking dogs and cleaning kennels, the animal shelter needs volunteers</i> makes the shelter walk the dogs. Move the phrase next to what it describes, or give it the right subject.',
  pairs: [
    ['<s>Covered in melted cheese, the waiter brought out the nachos.</s>', 'The waiter brought out the nachos<b>, covered in melted cheese</b>.'],
    ['<s>After studying all night, the test seemed easy.</s>', 'After studying all night, <b>Priya</b> found the test easy. (Who studied? Priya, so she must come right after the comma.)'],
    ['<s>The committee approved a plan to build a park at its meeting.</s>', 'At its meeting, the committee approved a plan to build a park. (The park was not going to be built at the meeting.)']
  ],
  note: 'Asked as "Which sentence contains an error in its construction?" Look for a sentence that opens with an <i>-ing</i> or <i>-ed</i> phrase and then names something that could not have done that action.',
  check: [
    {q: 'Which sentence contains an error in its construction?<blockquote>(1) The science fair drew more than 200 entries this year. (2) Judges walked the aisles for three hours. (3) Hoping to win, the judges were shown a volcano model by two sixth graders. (4) The top prize went to a project on soil bacteria.</blockquote>', opts: ['sentence 1', 'sentence 2', 'sentence 3', 'sentence 4'], a: 2, why: '<i>Hoping to win</i> sits next to <i>the judges</i>, but the sixth graders were the ones hoping. Fix: <i>Hoping to win, two sixth graders showed the judges a volcano model.</i>'},
    {q: 'Read this sentence.<blockquote>The librarian handed a book to the boy with a torn cover.</blockquote>Which revision corrects the error in the sentence?', opts: ['The librarian handed a book with a torn cover to the boy.', 'The librarian, with a torn cover, handed a book to the boy.', 'With a torn cover, the librarian handed a book to the boy.', 'The librarian handed to the boy a book, with a torn cover.'], a: 0, why: '<i>With a torn cover</i> describes the book, so it must sit next to <i>book</i>. In the original it attaches to the boy.'},
    {q: 'Which sentence is written correctly?', opts: ['Exhausted from the climb, the view still amazed the hikers.', 'Exhausted from the climb, the hikers were still amazed by the view.', 'The hikers, exhausted from the climb, the view still amazed them.', 'Exhausted from the climb, it was the view that amazed the hikers.'], a: 1, why: 'Only choice B puts <i>the hikers</i>, the ones who were exhausted, right after the opening phrase.'}
  ],
  tags: ['modifier']
},
{
  id: 'tense', group: 'Verbs and pronouns', name: 'Verb tense shifts',
  rule: 'Stay in one time frame unless the meaning changes time. A story told in the past (<i>spent, did, recited</i>) must not slip into the present (<i>studies</i>) for no reason. Watch for a single present-tense verb in a paragraph of past-tense ones, or the reverse.',
  pairs: [
    ['<s>Danielle did vocal exercises, then she studies the monologue, and finally she recited it.</s>', 'Danielle did vocal exercises, then she <b>studied</b> the monologue, and finally she recited it.'],
    ['<s>When coal was used to heat homes, it left soot stains; as natural gas becomes more common, the stains disappeared.</s>', '…as natural gas <b>became</b> more common, the stains disappeared.'],
    ['Ederle failed in 1925, but today she <b>is</b> remembered as a pioneer.', 'Correct: the time really does change from 1925 to today.']
  ],
  note: 'Asked as "Which sentence should be revised to correct an inappropriate shift in verb tense?" Read the verbs only, one after another: <i>spent, did, studies, recited</i>. The odd one out is the answer.',
  check: [
    {q: 'Which sentence contains an inappropriate shift in verb tense?<blockquote>(1) Last summer my brother built a raft out of scrap wood. (2) He tested it in the pond behind our house. (3) It floats for about a minute before it tipped over. (4) He spent the rest of the week fixing it.</blockquote>', opts: ['sentence 1', 'sentence 2', 'sentence 3', 'sentence 4'], a: 2, why: 'The paragraph is in the past (<i>built, tested, spent</i>). <i>Floats</i> is present tense; it should be <i>floated</i>.'},
    {q: 'Read this sentence.<blockquote>Every morning the baker arrives at four, lights the ovens, and shaped the first loaves before sunrise.</blockquote>Which revision corrects the error?', opts: ['Change arrives to arrived.', 'Change lights to lit.', 'Change shaped to shapes.', 'Change arrives to will arrive.'], a: 2, why: '<i>Every morning</i> describes a routine in the present: <i>arrives, lights, shapes</i>. Only <i>shaped</i> breaks the pattern.'},
    {q: 'Which sentence is correct as written?', opts: ['The volcano erupted in 1980 and ash falls across three states.', 'The volcano erupted in 1980, and ash fell across three states.', 'The volcano erupts in 1980, and ash fell across three states.', 'The volcano had erupted in 1980 and ash is falling across three states.'], a: 1, why: 'Both actions happened in 1980, so both verbs are past tense: <i>erupted, fell</i>.'}
  ],
  tags: ['tense']
},
{
  id: 'agreement', group: 'Verbs and pronouns', name: 'Subject-verb agreement',
  rule: 'A singular subject takes a singular verb (<i>the difference is</i>); a plural subject takes a plural verb (<i>the differences are</i>). The trap is a phrase between them: in <i>the butterfat content of these desserts is higher</i>, the subject is <i>content</i>, not <i>desserts</i>. Find the subject by asking <i>what is doing the verb?</i> and ignore everything between.',
  pairs: [
    ['<s>The mixing process, which adds less air to the treats, make gelato denser.</s>', 'The mixing process, which adds less air to the treats, <b>makes</b> gelato denser. (Subject: <i>process</i>.)'],
    ['<s>Each of the players were given a medal.</s>', 'Each of the players <b>was</b> given a medal. (Subject: <i>each</i>, which is singular.)'],
    ['The list of ingredients <b>is</b> long.', 'Subject: <i>list</i>, not <i>ingredients</i>.']
  ],
  note: 'On the test this usually hides inside "Which pair of revisions need to be made?" questions: one of the four choices proposes changing <i>is</i> to <i>are</i> or <i>makes</i> to <i>make</i>. Check the true subject before accepting that change.',
  check: [
    {q: 'Read this sentence.<blockquote>The collection of vintage posters in the library’s basement were donated by a former teacher.</blockquote>Which edit should be made in the sentence?', opts: ['Change were to was.', 'Change posters to poster.', 'Change donated to donates.', 'Insert a comma after basement.'], a: 0, why: 'The subject is <i>collection</i> (singular). <i>Posters</i> and <i>basement</i> are inside describing phrases and do not control the verb.'},
    {q: 'Which sentence is written correctly?', opts: ['Neither of the two routes are shorter than the highway.', 'Neither of the two routes is shorter than the highway.', 'Neither of the two route is shorter than the highway.', 'Neither of the two routes were being shorter than the highway.'], a: 1, why: '<i>Neither</i> is the subject and is singular, so the verb is <i>is</i>.'},
    {q: 'Read this paragraph.<blockquote>(1) Gelato and ice cream look alike but differ in three ways. (2) The butterfat content of gelato is lower. (3) The mixing process, which adds less air, make it denser. (4) Gelato is also served warmer.</blockquote>Which revision is needed?', opts: ['Sentence 1: Change look to looks.', 'Sentence 2: Change is to are.', 'Sentence 3: Change make to makes.', 'Sentence 4: Change is to are.'], a: 2, why: 'The subject of sentence 3 is <i>process</i>, so the verb is <i>makes</i>. The other proposed changes would break sentences that are already correct.'}
  ],
  tags: ['agreement']
},
{
  id: 'pronoun', group: 'Verbs and pronouns', name: 'Pronouns: vague reference and agreement',
  rule: 'A pronoun (<i>she, they, it, this, which</i>) must point clearly to one noun, its <b>antecedent</b>, and match it in number. <i>Eliza and Brianna sang, and she was nervous</i> is vague: which one? <i>Each student must bring their own lunch</i> mismatches singular <i>each</i> with plural <i>their</i> in formal test English.',
  pairs: [
    ['<s>Eliza told Brianna that she had been chosen for the solo.</s>', 'Eliza told Brianna, "<b>You</b> have been chosen for the solo." (Or name the person again.)'],
    ['<s>The city repaved the road and painted new lines, which pleased the residents.</s>', 'The city repaved the road and painted new lines, <b>improvements that</b> pleased the residents. (What did <i>which</i> refer to?)'],
    ['<s>A student who wants a locker must sign their name on the list.</s>', 'Students who want lockers must sign <b>their</b> names on the list.']
  ],
  note: 'Asked as "Which sentence uses a pronoun that is vague?" or hidden in a pair of revisions. For each <i>she, they, it, this</i>, point at the noun it replaces. If you can point at two, it is vague.',
  check: [
    {q: 'Which sentence contains a vague pronoun?<blockquote>(1) Marcus and Theo built a birdhouse for the science fair. (2) They painted it blue and hung it in the oak tree. (3) When the judge arrived, he showed her the nest inside. (4) The birdhouse won second prize.</blockquote>', opts: ['sentence 1', 'sentence 2', 'sentence 3', 'sentence 4'], a: 2, why: 'In sentence 3, <i>he</i> could be Marcus or Theo. Sentence 2’s <i>they</i> clearly means both boys and <i>it</i> clearly means the birdhouse.'},
    {q: 'Read this sentence.<blockquote>Every member of the chess club must return their board before leaving.</blockquote>Which edit should be made in the sentence?', opts: ['Change their to his or her.', 'Change member to members.', 'Change must to should.', 'No change is needed.'], a: 0, why: '<i>Every member</i> is singular, so in formal test English the pronoun is singular: <i>his or her</i>. (Changing <i>member</i> to <i>members</i> would also require changing <i>every</i>.)'},
    {q: 'Read this sentence.<blockquote>The coach canceled practice because of the storm, and this made the players happy.</blockquote>What is the clearest revision of the second clause?', opts: ['and this thing made the players happy.', 'and the cancellation made the players happy.', 'and it made them happy.', 'which made the players happy about this.'], a: 1, why: '<i>This</i> and <i>it</i> could mean the storm or the canceling. Naming <i>the cancellation</i> removes the doubt.'}
  ],
  tags: ['pronoun']
},
{
  id: 'punct', group: 'Commas', name: 'Colons, semicolons, and the "pair of revisions" trap',
  rule: 'A <b>colon</b> follows a complete sentence and introduces what comes next: a list, a question, an explanation. A <b>semicolon</b> joins two complete sentences that belong together. Questions that offer a <i>pair</i> of revisions per sentence are testing whether you can see that one of the two changes would break a correct sentence.',
  pairs: [
    ['Many people wonder<b>:</b> what is the difference between the two?', 'Correct. The colon introduces the question after a complete clause.'],
    ['<s>The ingredients are: flour, butter, and sugar.</s>', 'The ingredients are flour, butter, and sugar. (No colon after <i>are</i>; the clause before a colon must be complete.)'],
    ['<s>Sentence 2: Delete the comma after with AND change it is to they are.</s>', 'A trap pair: the comma after <i>To start with</i> is needed, and <i>it</i> refers to singular <i>content</i>. Both changes would introduce errors.']
  ],
  note: 'For "Which pair of revisions need to be made?", test each half separately. A choice is right only if <i>both</i> changes fix real errors. Three of the four choices will break something that is fine.',
  check: [
    {q: 'Read this paragraph.<blockquote>(1) Both gelato and ice cream are treats on a hot day, but many people wonder: what is the difference? (2) To start with, the butterfat content is much higher in ice cream than it is in gelato. (3) Additionally, the mixing process, which adds less air, makes gelato denser. (4) Finally, gelato is served warmer, which enhances its flavor, and allow it to melt more quickly.</blockquote>Which pair of revisions need to be made?', opts: ['Sentence 1: Delete the colon after wonder AND change is to are.', 'Sentence 2: Delete the comma after with AND change it is to they are.', 'Sentence 3: Delete the comma after process AND change makes to make.', 'Sentence 4: Delete the comma after flavor AND change allow to allows.'], a: 3, why: 'In sentence 4, <i>gelato is served warmer</i> is the subject of <i>allows</i>, and the comma after <i>flavor</i> wrongly separates two verbs sharing a subject. Every other choice would break a correct sentence.'},
    {q: 'Read this sentence.<blockquote>The museum has three floors, the top one is closed for repairs.</blockquote>Which edit should be made in the sentence?', opts: ['Change the comma to a semicolon.', 'Change the comma to a colon.', 'Delete the comma.', 'Insert a comma after floor.'], a: 0, why: 'Two independent clauses joined by only a comma: a comma splice. A semicolon fixes it. A colon would suggest the second part explains the first, which it does not.'},
    {q: 'Which sentence uses a colon correctly?', opts: ['She packed: a flashlight, a map, and extra socks.', 'She packed three things: a flashlight, a map, and extra socks.', 'She packed three things, such as: a flashlight, a map, and extra socks.', 'She packed: three things, a flashlight, a map, and extra socks.'], a: 1, why: 'A colon must follow a complete sentence. <i>She packed three things</i> is complete; <i>She packed</i> is not.'}
  ],
  tags: ['punct']
},
{
  id: 'combine', group: 'Sentence structure', name: 'Combining sentences',
  rule: 'When the test asks for the best way to combine sentences, the winner keeps every idea, puts the main idea in the main clause, and tucks the supporting detail into a dependent clause or phrase right next to what it describes. Wrong answers change the relationship (<i>although</i> instead of <i>because</i>), put the detail far from its noun, or string ideas with <i>and</i> so nothing is emphasized.',
  pairs: [
    ['Scientists now believe Jupiter has 79 moons. One is Io. Io has the most active volcanoes in the solar system.', 'Scientists now believe that Jupiter may have as many as 79 moons, <b>including one named Io, which</b> has the most active volcanoes in the solar system.'],
    ['<s>Io, which has the most active volcanoes, is one of Jupiter’s moons, and scientists believe Jupiter has 79 moons.</s>', 'Wrong emphasis: the new finding (79 moons) is buried at the end, and the detail about Io leads.'],
    ['<s>Although flyby missions began in 1973, they let scientists collect data.</s>', '<i>Although</i> claims a contrast that is not there. The missions began in 1973 <b>and</b> collect data; no contrast.']
  ],
  note: 'Asked as "What is the best way to combine the sentences?" Decide which sentence is the point and which are details before reading the choices. Then reject any choice whose joining word (<i>although, but, so, because</i>) states a relationship the originals never claimed.',
  check: [
    {q: 'Read these sentences.<blockquote>(1) The bridge was completed in 1883. (2) It was the longest suspension bridge in the world at the time. (3) It connects Brooklyn and Manhattan.</blockquote>What is the best way to combine the sentences?', opts: ['The bridge was completed in 1883, and it was the longest suspension bridge in the world at the time, and it connects Brooklyn and Manhattan.', 'Completed in 1883, the bridge, which connects Brooklyn and Manhattan, was the longest suspension bridge in the world at the time.', 'Although the bridge connects Brooklyn and Manhattan, it was completed in 1883 as the longest suspension bridge in the world.', 'The bridge connects Brooklyn and Manhattan, but it was completed in 1883 and was the longest suspension bridge at the time.'], a: 1, why: 'Choice B keeps all three facts, makes the record the main point, and attaches the details as phrases. A is a chain of <i>and</i>s; C and D invent contrasts with <i>although</i> and <i>but</i>.'},
    {q: 'Read these sentences.<blockquote>(1) Maya practiced the cello for two hours every day. (2) She earned a seat in the youth orchestra.</blockquote>Which combination best shows the relationship between the ideas?', opts: ['Maya practiced the cello for two hours every day, although she earned a seat in the youth orchestra.', 'Maya practiced the cello for two hours every day, so she earned a seat in the youth orchestra.', 'Maya earned a seat in the youth orchestra, and she practiced the cello for two hours every day.', 'Maya practiced the cello for two hours every day; the youth orchestra had a seat.'], a: 1, why: 'The practice caused the result, and <i>so</i> says exactly that. <i>Although</i> claims a contrast; <i>and</i> hides the cause.'},
    {q: 'Read these sentences.<blockquote>(1) The lighthouse was built in 1797. (2) The lighthouse still guides ships today.</blockquote>Which combination places the emphasis on the lighthouse’s continued use?', opts: ['The lighthouse still guides ships today, and it was built in 1797.', 'Built in 1797, the lighthouse still guides ships today.', 'The lighthouse, which still guides ships today, was built in 1797.', 'In 1797 the lighthouse was built, guiding ships today.'], a: 1, why: 'The main clause carries the emphasis. In B, <i>still guides ships today</i> is the main clause and the date is a phrase. In C the date is the main clause.'}
  ],
  tags: ['combine']
},
{
  id: 'precise', group: 'Word choice', name: 'Precise language and formal style',
  rule: 'The test prefers the specific word over the vague one: <i>interviewed the top three contestants</i> beats <i>talked to some people who did the best</i>. It also prefers a formal, even tone: no <i>really, a lot, stuff, kind of</i>, no slang, no exclamation. The most precise choice names exactly who, what, or how many.',
  pairs: [
    ['<s>The engineers tried some other things to insulate the compartment.</s>', 'The engineers <b>tested foam and fiberglass</b> to insulate the compartment.'],
    ['<s>The Appalachian Trail is a really long trail that a lot of people do each year.</s>', 'The Appalachian Trail is a <b>2,200-mile</b> trail that <b>more than a million</b> people hike each year.'],
    ['<s>The volunteers were super into the project.</s>', 'The volunteers were <b>enthusiastic about</b> the project. (Formal style.)']
  ],
  note: 'Asked as "Which revision uses the most precise language?" or "best maintains the formal style?" Beware choices that add detail but keep one vague verb (<i>worked with foam and fiberglass</i>): the winner is specific in <i>every</i> word that was vague.',
  check: [
    {q: 'Read this sentence.<blockquote>A reporter talked to some people who did the best in the contest.</blockquote>Which revision uses the most precise language?', opts: ['A reporter spoke with several people who did well in the contest.', 'A reporter interviewed the top three contestants.', 'A reporter talked to the people who did the best in the contest.', 'A reporter chatted with some of the winners of the contest.'], a: 1, why: 'Only B is specific about the action (<i>interviewed</i>) and about who (<i>the top three contestants</i>). A and D still say <i>several</i> and <i>some</i>; C changes nothing.'},
    {q: 'Read this sentence.<blockquote>The new library has lots of cool features for kids.</blockquote>Which revision best maintains a formal style?', opts: ['The new library has tons of awesome features for kids.', 'The new library has a bunch of features that children will really like.', 'The new library offers a reading garden, a recording studio, and a homework center for children.', 'The new library has lots of features for kids, which is great!'], a: 2, why: 'C replaces <i>lots of cool features</i> with the actual features and drops the casual tone. The others keep <i>tons, awesome, a bunch, really,</i> or an exclamation.'},
    {q: 'Read this sentence.<blockquote>The storm did a lot of damage to things along the coast.</blockquote>Which revision is most precise?', opts: ['The storm did significant damage to many things along the coast.', 'The storm damaged stuff all along the coast.', 'The storm destroyed forty homes and two piers along the coast.', 'The storm did a great deal of damage to the coast’s property.'], a: 2, why: 'C names what was damaged and how much. A and D swap one vague phrase for another (<i>significant, a great deal</i>); B is less formal.'}
  ],
  tags: ['precise']
},
{
  id: 'transition', group: 'Organization', name: 'Transitions',
  rule: 'A transition word tells the reader how the new sentence relates to the last one. <b>Adding</b>: <i>additionally, furthermore, also</i>. <b>Contrasting</b>: <i>however, on the other hand, nevertheless</i>. <b>Result</b>: <i>therefore, as a result, consequently</i>. <b>Example</b>: <i>for example, for instance</i>. <b>Order</b>: <i>first, finally, meanwhile</i>. Pick the relationship first, then the word.',
  pairs: [
    ['Proponents believe these programs make college affordable. <b>On the other hand</b>, some people believe "free" college is unsustainable.', 'Contrast: the second sentence disagrees with the first.'],
    ['Many students switch majors or work part time. <b>As a result</b>, they take longer than four years to finish.', 'Result: the second sentence follows from the first.'],
    ['<s>Students do not finish in four years. For example, taxes will rise.</s>', '<i>For example</i> promises an example of the first sentence, but the second is a consequence. <i>As a result</i> fits.']
  ],
  note: 'Asked as "Which transition word or phrase should be added to the beginning of sentence 5?" Cover the choices, read sentences 4 and 5, and say the relationship in your own words: <i>and also</i>, <i>but</i>, <i>so</i>, or <i>for instance</i>. Then find the matching word.',
  check: [
    {q: 'Read these sentences.<blockquote>(4) Bike-share programs reduce traffic in crowded downtowns. (5) ______, they give tourists an inexpensive way to explore a city.</blockquote>Which transition best begins sentence 5?', opts: ['However', 'In addition', 'For example', 'As a result'], a: 1, why: 'Sentence 5 adds a second benefit; it does not contrast with, result from, or exemplify sentence 4.'},
    {q: 'Read these sentences.<blockquote>(8) Most of the town supported the new park. (9) ______, a few business owners worried about losing parking spaces.</blockquote>Which transition best begins sentence 9?', opts: ['Similarly', 'Therefore', 'However', 'For instance'], a: 2, why: 'Sentence 9 pushes against sentence 8, so a contrast word is needed.'},
    {q: 'Read these sentences.<blockquote>(2) The river rose three feet overnight. (3) ______, the ferry canceled all morning crossings.</blockquote>Which transition best begins sentence 3?', opts: ['Nevertheless', 'Consequently', 'Meanwhile', 'Likewise'], a: 1, why: 'The cancellation is a result of the rising river.'}
  ],
  tags: ['transition']
},
{
  id: 'organization', group: 'Organization', name: 'Topic sentences, conclusions, and what does not belong',
  rule: 'Half of the Revising/Editing section is about paragraphs, not commas. A <b>topic sentence</b> states what the whole passage or paragraph will argue, wide enough to cover every paragraph and narrow enough to be about this passage. A <b>concluding sentence</b> restates that main idea using the points made, without adding new facts. An <b>irrelevant sentence</b> is true but about something else. A sentence is <b>misplaced</b> when it refers to something the reader has not met yet.',
  pairs: [
    ['Topic sentence for a passage about free-college debates: <b>Determining the most effective way to make college affordable is a complex issue, with differing opinions about how to approach it.</b>', 'Wide enough to cover both sides (state programs, critics, colleges themselves). A sentence about only one state program would be too narrow.'],
    ['<s>Concluding sentence: Tennessee’s program also offers mentoring services.</s>', 'That is a new detail, not a conclusion. A conclusion sounds like: <i>Passing legislation that boosts affordability will take time, expert input, and careful planning.</i>'],
    ['In a paragraph about how states fund tuition programs: <s>Many students also enjoy campus life more than they expected.</s>', 'True, maybe, but off the paragraph’s topic (funding). It should be deleted.']
  ],
  note: 'Asked five ways: which sentence best introduces the topic; which should follow sentence N to support it; which sentence should be deleted; where should sentence N be moved; which concluding sentence fits. In every case, first say the paragraph’s point in one phrase. The right answer serves that point; the traps are true-sounding sentences that serve a different one.',
  check: [
    {q: 'Read this paragraph.<blockquote>(1) ______ (2) In 2017 New York passed a bill covering tuition for nearly one million students. (3) Tennessee offers scholarships and mentoring to students at its community colleges. (4) Supporters call these programs a step toward making college affordable for students who would otherwise take on loans.</blockquote>Which sentence best introduces the topic of the paragraph?', opts: ['New York is home to many well-known universities.', 'Several states have created programs to make college financially realistic for students who want a degree.', 'Tennessee’s community colleges enroll more than 100,000 students.', 'College costs have risen faster than inflation for three decades.'], a: 1, why: 'B covers both examples and the supporters’ view. A and C are narrow details; D is about costs rising, not about state programs.'},
    {q: 'Read this paragraph.<blockquote>(9) Critics say "free" college programs are unsustainable. (10) States pay colleges from tax revenue, and as more students enroll, more money is needed. (11) Many students take longer than four years because they switch majors or work. (12) Community colleges often have beautiful campuses. (13) Critics believe these pressures will lead to higher taxes or lower-quality education.</blockquote>Which sentence should be deleted because it shifts away from the topic?', opts: ['sentence 10', 'sentence 11', 'sentence 12', 'sentence 13'], a: 2, why: 'The paragraph is about why critics think the programs cannot last. Campus beauty has nothing to do with that.'},
    {q: 'Read this paragraph.<blockquote>(14) Colleges themselves can help keep costs down. (15) Online courses reduce the need for physical classrooms. (16) Letting students test out of subjects they already know saves them from paying for unneeded classes. (17) High schools can prepare students for college-level work so they avoid paying for remedial courses. (18) ______</blockquote>Which concluding sentence best supports the ideas in the paragraph?', opts: ['Online courses have become popular since 2010.', 'Remedial courses usually do not count toward a degree.', 'Through changes like these, colleges and schools can lower the price of a degree without waiting for new laws.', 'The state of Tennessee also pays for mentoring services.'], a: 2, why: 'C gathers the three ideas (online courses, testing out, preparation) into the paragraph’s point. The others are details, one of them from a different paragraph.'}
  ],
  tags: ['organization', 'parallel']
}
];
