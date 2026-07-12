# Bro Code JS Course - Gaps & Corrections Reference

> Internal reference for `/bro <Section>`. Per section: what it is, what Bro glosses/gets wrong, beneficial gaps for real+React code, the Java-dev trap, and a parallel-project variation idea.

Sections: 75/75. Built from the full course transcript.

---

## #1 JavaScript tutorial for beginners (basics/output)  `[0:00]`

**Concept:** Intro to JS as the browser's behavior layer, plus the four ways to emit output: console.log, alert, document.write, and element.innerHTML. Exists so a beginner can see a program produce something before learning syntax.

**Bro glosses / gets wrong:**
- document.write is not a real output tool: called after the page loads it wipes the entire DOM and replaces it. Bro uses it for convenience only.
- alert blocks the whole main thread until dismissed; never used in production.
- innerHTML parses its string as HTML, so injecting user data through it is an XSS hole. Use textContent when you just want text.

**Beneficial gaps (real/React code):**
- console.log is the actual day-to-day tool; the others are demo-only.
- Where the <script> goes matters: put it before </body> or use defer/type=module so the DOM exists when it runs.
- No 'use strict' or module discussion yet; modern code (and every React file) runs in module/strict mode by default.

**JS vs Java:** No compile step, no class, no main() method. Statements in the file just execute top to bottom. It is interpreted and dynamically typed.

**Variation to build:** Instead of a hello-world greeting, print a mock weather-station readout (city, temp, condition) to the console using three log calls.

---

## #2 Variables  `[12:32]`

**Concept:** let and const declare bindings; JS is dynamically typed so no type is written. typeof inspects a value's type at runtime. Why: names for data you reuse and reassign.

**Bro glosses / gets wrong:**
- const does not mean immutable: it blocks reassignment of the binding, but a const object or array can still have its contents mutated.
- typeof null returns "object" — a well-known language bug, not a real type.
- An accessed-but-never-declared name throws ReferenceError, whereas a declared-but-unassigned one is undefined. Two different states.

**Beneficial gaps (real/React code):**
- let/const are block-scoped ({}), unlike var which is function-scoped. This is the single biggest modern-JS correctness point.
- Temporal Dead Zone: referencing a let/const before its declaration line throws, even though it is hoisted.
- The type rides on the value, not the variable, so typeof can change across a variable's life.

**JS vs Java:** The type is attached to the value, not the variable. You never write the type, and one variable can hold a number then later a string. Also NaN is itself of type number.

**Variation to build:** Model a single library-book record as separate variables: title (string), pages (number), isAvailable (boolean), then typeof-check each.

---

## #3 Arithmetic operators  `[25:20]`

**Concept:** + - * / % and ** (exponent), plus ++/--. Standard math, plus operator precedence. Why: computation is the core of any program.

**Bro glosses / gets wrong:**
- + is overloaded: if either operand is a string it concatenates, so "5" + 1 is "51", not 6. This burns everyone.
- There is no integer division: 5 / 2 is 2.5, not 2.
- Division by zero yields Infinity (or -Infinity / NaN for 0/0), it does not throw.

**Beneficial gaps (real/React code):**
- Every number is a 64-bit IEEE-754 double, so 0.1 + 0.2 !== 0.3. Round money in integer cents.
- NaN poisons any expression it touches and NaN !== NaN; test with Number.isNaN, not ==.
- Reach for Math.floor / Math.round / Math.trunc when you actually want an integer result.

**JS vs Java:** One number type only — no int vs double, no long, no float. Division never truncates, and % works on non-integers (5.5 % 2 is 1.5).

**Variation to build:** Build a recipe scaler: take base ingredient amounts and a serving multiplier, output scaled quantities using * and rounding.

---

## #4 Accept user input  `[33:47]`

**Concept:** Getting data in: window.prompt() for a modal, or reading a form field's .value. Why: programs need external input to be useful.

**Bro glosses / gets wrong:**
- prompt() always returns a string, or null if the user cancels. Doing math on it concatenates instead of adding until you convert.
- An input element's .value is likewise always a string, even for <input type="number">.
- prompt is synchronous and blocks the page; production code never uses it.

**Beneficial gaps (real/React code):**
- Real input is event-driven: wire a button with addEventListener('click', fn), not the onclick property Bro favors. addEventListener stacks multiple handlers and is the React-adjacent mental model.
- Always parse/convert the string before arithmetic.
- In React you would not read .value directly at all — you bind state via onChange; worth knowing this is the manual version of that.

**JS vs Java:** There is no Scanner/readLine blocking read in real apps. Input arrives asynchronously through event callbacks, not a linear 'wait for a line' call.

**Variation to build:** A Celsius-to-Fahrenheit converter that reads a number from a text input and writes the result to a result <span> on button click.

---

## #5 Type conversion  `[39:09]`

**Concept:** Explicit conversion via Number(), String(), Boolean(), plus parseInt/parseFloat. Why: input arrives as strings and must become the right type before use.

**Bro glosses / gets wrong:**
- Number() and parseInt disagree: Number("123abc") is NaN but parseInt("123abc") is 123 (it reads the leading digits and stops).
- Number("") is 0 and Number(" ") is 0 — surprising empty-string behavior.
- The falsy set is exactly: false, 0, -0, "", null, undefined, NaN. Everything else, including "0" and "false" and [], is truthy.

**Beneficial gaps (real/React code):**
- Distinguish explicit conversion from implicit coercion; the == operator coerces silently, so always use === and !==.
- Unary + is a common shorthand for Number(): +"42" is 42.
- Truthy/falsy is what actually drives if-conditions and && || short-circuits in real code.

**JS vs Java:** No cast syntax like (int)x. Conversion is done through functions, and the language will also coerce types silently behind your back, which Java never does.

**Variation to build:** A survey normalizer: convert mixed answers like "yes", "1", "", "no" into real booleans and count the trues.

---

## #6 Constants  `[44:48]`

**Concept:** const declares a binding that cannot be reassigned. Why: signals intent and prevents accidental reassignment; it is the default declaration in modern JS.

**Bro glosses / gets wrong:**
- const is not deep immutability. const arr = []; arr.push(1) is legal; only arr = somethingElse is blocked. Bro tends to imply 'unchangeable'.
- const must be initialized at declaration — you cannot declare it empty and assign later.

**Beneficial gaps (real/React code):**
- Use Object.freeze(obj) for a shallow immutable object; nested objects still need freezing recursively.
- Convention: SCREAMING_SNAKE_CASE for true program constants (MAX_SIZE), plain const for ordinary once-bound values.
- Idiomatic modern/React code uses const for almost everything (components, handlers, values) and let only when reassignment is genuinely needed.

**JS vs Java:** Like Java's final on a reference: the binding is fixed but the object it points to is not. final and const both mean 'assign once', not 'contents frozen'.

**Variation to build:** Define game-config constants (BOARD_SIZE, STARTING_LIVES, POINTS_PER_COIN) and show that mutating a const settings object's field still works.

---

## #7 Counter program  `[52:30]`

**Concept:** First real project: buttons that increment, decrement, and reset a number shown on the page. Ties together a state variable, DOM selection, events, and updating the display. Why: it is the minimal example of stateful UI.

**Bro glosses / gets wrong:**
- Bro assigns handlers via the onclick property; the standard is element.addEventListener('click', fn). onclick allows only one handler and is overwritten on reassignment.
- Update the display with textContent, not innerHTML, since it is plain text — avoids the XSS surface.
- 'this' inside a regular handler is the element clicked; inside an arrow-function handler it is inherited from the surrounding scope, NOT automatically the element.

**Beneficial gaps (real/React code):**
- addEventListener is the pattern that maps onto React's onClick prop.
- This whole program is a manual version of useState: a count variable plus a hand-written 'sync the DOM' step. React automates exactly that render step, which is the key insight to carry forward.
- The handler closes over the count variable — a closure — which is why it keeps working across clicks.

**JS vs Java:** UI is event-driven callbacks, not a main loop that polls. State lives in a plain variable and you must manually push it into the DOM after every change; nothing redraws for you.

**Variation to build:** A basketball scoreboard: +1, +2, +3, and reset buttons updating a team's score, or a daily water-intake tracker counting glasses.

---

## #8 Math object  `[1:01:46]`

**Concept:** Math is a built-in namespace of static number utilities (Math.PI, Math.round, floor, ceil, trunc, pow, sqrt, abs, min, max, sign, cbrt). It exists so numeric helpers live in one place; you never instantiate it.

**Bro glosses / gets wrong:**
- Math is not a constructor: `new Math()` throws. It is a plain static object, unlike most other built-ins.
- Math.round rounds .5 toward +Infinity, not away from zero: Math.round(-2.5) === -2, not -3. Bro usually only shows positive cases.
- Math.trunc (chop toward 0) differs from Math.floor for negatives: floor(-2.3) === -3 but trunc(-2.3) === -2.
- Math.max()/Math.min() with zero arguments return -Infinity / +Infinity respectively, which can silently poison later math.

**Beneficial gaps (real/React code):**
- Math.max/min take varargs, not an array: use spread, Math.max(...arr). This trips people constantly.
- All results are IEEE-754 doubles, so classic float error applies (0.1 + 0.2 !== 0.3); Math does not give you exact decimals.
- For money/formatting use Number.prototype.toFixed or Intl.NumberFormat, not Math rounding.

**JS vs Java:** Java's java.lang.Math is nearly identical, but JS has no int/long type: everything is a double, so there is no integer overflow, no Math.floorDiv/floorMod, and no separate integer-returning overloads.

**Variation to build:** Instead of a temperature/area calc, build a physics helper: given initial velocity and angle, use Math.sin/cos/sqrt/pow to compute projectile range and max height.

---

## #9 Random number generator  `[1:07:23]`

**Concept:** Math.random() returns a float in [0, 1). You scale, floor, and offset it to get integer ranges. It exists because games, sampling, and IDs all need pseudo-randomness.

**Bro glosses / gets wrong:**
- Inclusive integer range [min, max] is Math.floor(Math.random() * (max - min + 1)) + min. Forgetting the +1 makes max unreachable (off-by-one).
- Math.random() is NOT cryptographically secure. For tokens/passwords/session IDs use crypto.getRandomValues() or crypto.randomUUID().
- The upper bound is exclusive: Math.random() can return 0 but never exactly 1.

**Beneficial gaps (real/React code):**
- There is no seeding in standard JS. You cannot make Math.random() reproducible for tests; you need a seedable PRNG library (e.g. seedrandom) for that.
- crypto.randomUUID() is built into modern browsers and Node for unique keys, often better than rolling your own.

**JS vs Java:** Java's java.util.Random is an instantiated object with nextInt(bound) (exclusive) and constructor seeding. JS gives you one static, unseedable Math.random() and you build the range formula yourself every time.

**Variation to build:** Skip dice/lottery: write a random hex color generator that produces `#RRGGBB` by generating three 0-255 channels, then render a swatch of the result.

---

## #10 If statements  `[1:15:59]`

**Concept:** if / else if / else branch on a condition. JS coerces the condition to a boolean via truthiness rather than requiring an actual boolean.

**Bro glosses / gets wrong:**
- Falsy values are exactly: false, 0, -0, 0n, "" (empty string), null, undefined, NaN. Everything else is truthy, including "0", "false", [], and {}. Bro rarely enumerates these.
- Use === (strict) over == (loose). == coerces types: 0 == "" is true, null == undefined is true, 1 == "1" is true. These surprises are a top source of bugs.

**Beneficial gaps (real/React code):**
- let/const are block-scoped, so a variable declared inside an if {} does not exist outside it (unlike function-scoped var).
- Guard clauses / early return keep code flat instead of deep nesting.
- Short-circuit && and || are common condition shorthands and underpin React's {cond && <JSX/>} rendering.

**JS vs Java:** Java requires the condition to be a real boolean; `if("0")` or `if(list)` won't compile. In JS any value is coerced to truthy/falsy, and `if(someString)` / `if(someObject)` is idiomatic.

**Variation to build:** Instead of an age/grade gate, classify an HTTP status code: 2xx success, 3xx redirect, 4xx client error, 5xx server error, else invalid.

---

## #11 Checked property  `[1:31:56]`

**Concept:** Read a checkbox's/radio's live boolean `.checked` property off the DOM element to branch logic (e.g. only apply a discount if a box is ticked).

**Bro glosses / gets wrong:**
- The HTML `checked` attribute only sets the INITIAL state; the DOM `.checked` property is the live current state. They diverge once the user clicks.
- For radio groups, each input has its own `.checked`; you loop or check each individually, there is no single 'value' property on the group.

**Beneficial gaps (real/React code):**
- Bro assigns element.onclick = fn. Real-world and React-adjacent code uses element.addEventListener('change', fn): onclick overwrites any prior handler (only one), addEventListener stacks multiple and is the standard.
- 'change' fires on actual state change and is semantically correct for checkboxes; 'click' also fires but is less precise.
- In React this becomes a controlled input: <input type="checkbox" checked={state} onChange={...} />, where checked is driven by state, not read from the DOM.

**JS vs Java:** No real Java analog; the trap is property-vs-attribute thinking. A Java dev expects a getter that reflects markup, but `.checked` is live mutable UI state independent of the original HTML attribute.

**Variation to build:** Instead of a payment/subscribe box, build a dietary-filter panel: several checkboxes (vegan, gluten-free, nut-free) whose .checked states filter a rendered list of menu items.

---

## #12 Ternary operator  `[1:42:03]`

**Concept:** condition ? valueIfTrue : valueIfFalse is the expression form of if/else. Because it returns a value, you can assign it or embed it inline.

**Beneficial gaps (real/React code):**
- It is an EXPRESSION, so it works where a statement can't: const label = pass ? "OK" : "Fail", and inside template literals.
- This is THE React conditional-rendering pattern: {cond ? <A/> : <B/>}, and its cousin {cond && <A/>} for render-or-nothing.
- Nesting ternaries hurts readability fast; extract to if/else or a lookup once you have more than one level.

**JS vs Java:** Essentially identical to Java's ?: operator, so nothing new mechanically. The only shift is cultural: in JS/JSX it is used far more heavily for inline UI branching.

**Variation to build:** Instead of even/odd or pass/fail, build a connection-status badge: `const badge = isOnline ? "🟢 Online" : "🔴 Offline"` and show it in the UI.

---

## #13 Switches  `[1:48:49]`

**Concept:** switch tests one value against multiple case labels and runs the first match. Cleaner than a long if/else-if chain when comparing one variable to many constants.

**Bro glosses / gets wrong:**
- Cases FALL THROUGH without break: matching a case runs every statement until a break or the end. Omitting break is a classic bug (and occasionally an intentional trick to group cases).
- case matching is strict (===), type-sensitive: `case "1"` will NOT match the number 1. Bro doesn't usually stress this.
- default can appear anywhere but conventionally goes last; if reached via fall-through it can run unexpectedly.

**Beneficial gaps (real/React code):**
- Declaring let/const inside a case leaks across sibling cases and can throw; wrap the case body in { } braces to get its own block scope.
- In React, one-off value mapping is often done with an object-literal lookup ({ get: ..., post: ... }[method]) instead of switch; switch mainly appears inside useReducer reducers.

**JS vs Java:** Java also falls through, so break discipline is familiar, BUT: JS switch compares with === on any type, while Java restricts switch to int/char/String/enum. There is also no JS equivalent of Java 14's arrow `case ->` expression switch.

**Variation to build:** Instead of day-of-week, build a tiny HTTP method router: switch(method) over GET/POST/PUT/DELETE returning the action string, with default handling 405 Method Not Allowed.

---

## #14 String methods  `[1:55:33]`

**Concept:** Strings carry built-in methods (toUpperCase, trim, slice, replace, includes, split, padStart, etc.) for text manipulation. Strings are immutable, so every method returns a NEW string rather than editing in place.

**Bro glosses / gets wrong:**
- Immutable: str.toUpperCase() does nothing unless you capture the return value; the original is unchanged.
- length is a PROPERTY, not a method: str.length with no parentheses. str.length() throws.
- indexOf returns -1 (not null/undefined) when the substring is absent.
- replace() only replaces the FIRST occurrence unless you pass a /g regex; use replaceAll() for every occurrence.
- slice accepts negative indices (from the end); substring does not and silently swaps arguments if start > end.

**Beneficial gaps (real/React code):**
- Template literals `Hello ${name}` are the modern way to build strings, not + concatenation.
- .length counts UTF-16 code units, so emoji/astral characters report length 2 and slice can split them; use [...str] or Intl.Segmenter for true character counts.
- Bracket access str[0] and str.at(-1) work; there is no separate char type.
- Immutability is why strings play nicely with React state (no accidental in-place mutation).

**JS vs Java:** Java strings are also immutable, so that model transfers, BUT: JS has no char type (charAt returns a one-char string, and str[i] indexing works), and length is a property (str.length) whereas Java uses the method str.length(). Compare with === , never Java's .equals().

**Variation to build:** Instead of formatting a username, build a URL-slug generator: take a title, trim it, toLowerCase, then replaceAll spaces with hyphens and strip non-alphanumerics to produce `my-first-post`.

---

## #15 String slicing  `[2:03:35]`

**Concept:** slice(start, end) extracts a substring; end index is exclusive. It exists to pull pieces out of text (dates, codes, names) without regex. Returns a brand-new string.

**Bro glosses / gets wrong:**
- slice, substring, and substr are three different methods and are easy to confuse: slice(2,5) accepts NEGATIVE indices (count from the end, str.slice(-3)); substring does NOT and silently swaps its args if start>end; substr is deprecated (drop it).
- Nothing is mutated. Strings are immutable primitives, so slice can only return a copy. str[0]='x' silently fails (throws only in strict mode).
- Out-of-range indices are clamped, not errors: slice(0, 999) on a 5-char string just returns the whole thing.

**Beneficial gaps (real/React code):**
- str.at(-1) is the clean modern way to grab the last char by negative index (works where bracket [] can't take negatives).
- Because strings are immutable, every slice allocates a new string; irrelevant at small scale, but it's WHY chaining (next section) is safe.
- In React you'll use slice constantly for display truncation ('text.slice(0, 100) + …'); it never touches the underlying state.

**JS vs Java:** Java's substring(start, end) is also end-exclusive so that intuition carries, but Java has no negative-index support; JS slice(-3) is the new tool to internalize.

**Variation to build:** Parse a hex color '#3F8A2C' into its R/G/B pairs, or extract the area code from a raw phone-number string. Different domain than Bro's name/text example.

---

## #16 Method chaining  `[2:11:36]`

**Concept:** Calling several methods back-to-back on one expression, each operating on the value the previous returned: str.trim().toUpperCase().slice(0,3). Exists to avoid throwaway intermediate variables.

**Bro glosses / gets wrong:**
- It only works because each string method RETURNS a new string. The chain is really 'call A, get a new string, call B on that.' Bro narrates it as one action but it's N separate allocations.
- Order is not commutative: .trim().slice() differs from .slice().trim() when leading spaces exist. Read chains left-to-right as a pipeline.

**Beneficial gaps (real/React code):**
- Chaining isn't a string feature, it's a return-value feature. Array chaining arr.filter(...).map(...) is the exact same idea and IS the core React list-rendering pattern.
- Debuggability tradeoff: a long chain is one un-inspectable expression. Break it when you need to log a middle step.
- Optional chaining ?. is a different thing (null-safety), don't conflate the two despite the shared word.

**JS vs Java:** Java's StringBuilder chaining (.append().append()) MUTATES one object and returns this; JS string chaining creates a fresh immutable string at every link. The closer Java analogy is Stream: .stream().filter().map().

**Variation to build:** Build a slugify pipeline for blog titles ('  My First Post! ' -> 'my-first-post') using trim/toLowerCase/replaceAll, a different domain than Bro's example.

---

## #17 Logical operators  `[2:17:03]`

**Concept:** && (and), || (or), ! (not) combine or invert conditions, with short-circuit evaluation: the right side is skipped once the result is decided.

**Bro glosses / gets wrong:**
- Big one Bro almost always glosses: && and || do NOT return true/false, they return one of the OPERANDS. 'a || b' yields the first truthy value; 'a && b' yields the first falsy value (or the last). That's why 'name || "guest"' works as a default.
- Short-circuit means side effects on the skipped side never run, e.g. 'user && user.save()' only saves if user is truthy.

**Beneficial gaps (real/React code):**
- ?? (nullish coalescing) is the safer default operator when 0 or '' are valid values: 'count ?? 5' keeps 0, but 'count || 5' wrongly replaces 0.
- '{condition && <Component/>}' is THE React conditional-render idiom and relies entirely on this operand-returning behavior. Watch the trap: '{items.length && <List/>}' renders a literal 0 when empty; use a real boolean or length > 0.
- Learn the falsy set cold: false, 0, '', null, undefined, NaN. Everything else is truthy (including '0', [], {}).

**JS vs Java:** Java's && and || are strictly boolean-in, boolean-out, and there is no 'truthy.' JS coerces any value and hands back the value itself, so JS lets you write 'const port = envPort || 3000', which is a type error in Java.

**Variation to build:** An access gate: 'isLoggedIn && hasPaid && renderDashboard()', or discount eligibility (age >= 65 || isStudent). Different domain than Bro's example.

---

## #18 Strict equality  `[2:22:44]`

**Concept:** === compares value AND type with no coercion; == coerces types before comparing. Rule of thumb: always use === (and !==).

**Bro glosses / gets wrong:**
- == has genuinely surprising rules: 0 == '' is true, 0 == '0' is true, null == undefined is true (but null === undefined is false), '' == false is true. === removes all of that guesswork.
- NaN is not equal to anything, including itself: NaN === NaN is false. Use Number.isNaN(x) to test.
- Objects/arrays compare by REFERENCE, not contents: {} === {} is false, [1] === [1] is false. === on them asks 'same object in memory?'

**Beneficial gaps (real/React code):**
- Reference equality is central to React: useMemo/useEffect dependency checks and React.memo use Object.is (=== with two NaN/-0 tweaks). A new object literal each render always 'changes,' triggering re-renders.
- To compare object contents you need a deep/shallow compare or JSON.stringify (with caveats), never ==.

**JS vs Java:** Java == on objects is already reference identity and .equals() is value equality, so the object case feels familiar. The trap is the reverse: Java devs habitually distrust == on Strings (interning), but JS === on string PRIMITIVES compares by value and is correct. Also JS has no .equals()/operator overloading.

**Variation to build:** A quiz-answer checker comparing normalized user input to the expected answer, or detecting a duplicate ID before insert. Different domain than Bro's example.

---

## #19 While loops  `[2:26:41]`

**Concept:** while(condition){...} repeats as long as condition is truthy; do{...}while(condition) runs the body once before testing. Use when the iteration count isn't known up front (retry, poll, validate-until-valid).

**Bro glosses / gets wrong:**
- Infinite loop if nothing inside changes the condition. Bro covers this, but note the condition is evaluated for TRUTHINESS, not strict boolean: while(queue.length) exits at 0 automatically.

**Beneficial gaps (real/React code):**
- break exits the loop, continue skips to the next test; 'while(true){ ... if(done) break; }' is a common valid pattern for input-validation loops.
- In React you almost never hand-write while loops for UI; data transforms use map/filter/reduce. while shows up in plain logic/algorithms, not render code.

**JS vs Java:** Syntax is essentially identical to Java. The only divergence: JS accepts a non-boolean condition (while(str) / while(node)) via truthiness, which Java rejects at compile time.

**Variation to build:** Model an ATM PIN retry that locks after 3 wrong attempts, or keep drawing cards until a deck-sum threshold is crossed. Different domain than Bro's example.

---

## #20 For loops  `[2:34:53]`

**Concept:** for(init; condition; update){...} bundles counter setup, test, and increment in one line. Best when you know or can compute the iteration count.

**Bro glosses / gets wrong:**
- let vs var in the header actually matters: 'for(let i...)' gives each iteration a FRESH block-scoped i, so callbacks/timeouts created inside capture the right value. With var (function-scoped) every closure sees the final i, the classic 'prints 5 five times' bug. Bro uses let, which quietly saves you here.
- i++ vs ++i doesn't matter as the loop's update expression; the loop reads it the same way.

**Beneficial gaps (real/React code):**
- for...of iterates VALUES (arrays, strings, any iterable). for...in iterates KEYS/indices as strings and should be avoided on arrays (includes inherited/extra props, order not guaranteed).
- Array.forEach / map / filter / reduce are the idiomatic replacements; in React you render lists with items.map(x => <li key={x.id}>...) and every element needs a stable key prop.
- break/continue work in for loops too; forEach cannot be broken out of (use for...of if you need break).

**JS vs Java:** Java's enhanced for (for(T x : coll)) maps to JS for...of, NOT for...in. A Java dev reaching for for...in expecting for-each gets keys/indices instead, a common first-week bug.

**Variation to build:** Render a multiplication table grid, or build a countdown that logs 10..1 then 'liftoff'. Different domain than Bro's example.

---

## #21 Number guessing game  `[2:40:37]`

**Concept:** Capstone project: generate a random target, loop taking guesses, give higher/lower feedback until correct, count attempts. Ties together random, loops, conditionals, and input.

**Bro glosses / gets wrong:**
- Math.random() returns a float in [0, 1) (1 never occurs). The standard 1..max formula is Math.floor(Math.random() * max) + 1; forgetting the +1 gives 0..max-1.
- prompt() and DOM input values return a STRING. '7' === 7 is false, so you must Number(x) or parseInt(x, 10) before comparing, or the game never registers a win. This is the single most likely bug in Bro's build.
- Bad input (parseInt('abc')) yields NaN, and NaN comparisons are all false; guard with Number.isNaN.

**Beneficial gaps (real/React code):**
- Bro likely wires buttons via the onclick property. The real-world / React-adjacent pattern is addEventListener('click', handler), which allows multiple listeners and cleaner separation. Prefer it going forward.
- In React you would NOT use a while loop + prompt at all: the target lives in useState, each guess is an event handler updating state, and the UI re-renders from state. Worth noting the mental-model shift now so the imperative version doesn't become your default.
- Always pass the radix to parseInt(x, 10).

**JS vs Java:** Math.random() usage mirrors Java's Math.random(), so that feels familiar. The trap is input typing: Java's Scanner.nextInt() hands you an int, whereas JS prompt()/input.value hand you a string that silently fails === against a number until you coerce it.

**Variation to build:** A higher/lower card-draw game, or a 'guess the year' history quiz with warmer/colder hints. Different domain than Bro's number example.

---

## #22 Functions  `[2:49:31]`

**Concept:** A named, reusable block of code you define once and call many times, optionally taking parameters and returning a value. In JS, functions are first-class values (you can store them in variables, pass them as args, return them) which is the whole basis for callbacks and React.

**Bro glosses / gets wrong:**
- Function DECLARATIONS are hoisted (callable before the line they are defined on); function expressions and arrow functions are NOT. Bro uses declarations and won't mention this asymmetry.
- A function with no explicit `return` returns `undefined`, not nothing/void.
- No function overloading in JS: defining two functions with the same name silently overwrites the first. Same name = last one wins.

**Beneficial gaps (real/React code):**
- Arrow function form `const f = (x) => x*2` is what you'll read constantly in React; declaration syntax is the tutorial default but not the modern norm.
- Default parameters: `function f(x = 10){}`.
- Args are not checked: passing too few gives `undefined` params, passing too many is silently ignored. No arity enforcement.
- Functions-as-values is the key mental unlock: `arr.map(myFunc)` passes the function itself, no parens.

**JS vs Java:** No method overloading, no declared param types, no return type, and functions live standalone (not required to sit inside a class). A JS function is a value you can pass around like an int.

**Variation to build:** Write a set of small pure functions for a coffee-shop order: `priceOf(drink)`, `withTax(price)`, `discount(price, percent)`. Then chain them. Different domain from Bro's greeting/isEven examples.

---

## #23 Variable scope  `[3:01:44]`

**Concept:** Scope is the region of code where a variable is visible. JS has global scope, function scope, and (for let/const) block scope. It exists to isolate names so inner code can use short local names without clobbering outer ones.

**Bro glosses / gets wrong:**
- Bro likely frames it as just global vs local (function-level). With `let`/`const` the real unit is the BLOCK: any `{ }` including an if or for creates a new scope, not only functions.
- Legacy `var` is function-scoped and ignores blocks, which is exactly why let/const replaced it. Bro correctly avoids var but may not say why block scope matters.
- Shadowing: an inner variable with the same name hides the outer one; it does not modify it.

**Beneficial gaps (real/React code):**
- `let` in a for-loop creates a FRESH binding each iteration, so callbacks/closures capture the right value. This is the single most common closure bug and matters in React event handlers.
- Temporal Dead Zone: referencing a let/const before its declaration throws, unlike var (undefined).
- Global variables in the browser become properties of `window`; avoid leaking them.
- Lexical scoping (a function sees variables from where it was DEFINED, not where it's called) is the foundation for closures and for how arrow `this` works.

**JS vs Java:** Java is block-scoped too, so let/const feel familiar. The trap is legacy `var` (function-scoped, hoisted as undefined) and the fact that globals attach to `window`. No access modifiers or package scope here.

**Variation to build:** Build a tiny click-counter using an outer variable and an inner increment function to demonstrate closure over scope: a 'likes' counter for a fake social post, logging the count each click.

---

## #24 Temperature conversion program  `[3:07:10]`

**Concept:** A DOM mini-project: read a number from an input, check which unit (radio button) is selected, convert C<->F, and write the result to the page. Ties together functions, conditionals, and reading/writing the DOM.

**Bro glosses / gets wrong:**
- `input.value` is ALWAYS a string. Doing math on it without `Number()`/`parseFloat()` gives string concatenation or NaN. This is the #1 bug in this project.
- `radio.checked` (boolean) is how you detect the selected unit.
- `parseFloat('')` and `Number('abc')` yield NaN; guard with `isNaN()` or the result renders 'NaN'.
- `.toFixed(1)` returns a STRING, not a number, so don't do further math on its result.

**Beneficial gaps (real/React code):**
- Bro uses the `onclick` property. Real-world / React-adjacent code uses `element.addEventListener('click', fn)`. The onclick property allows only ONE handler (a second assignment overwrites the first); addEventListener stacks multiple and is closer to React's onClick model.
- `Number()` vs `parseFloat()`: Number('') is 0 but parseFloat('') is NaN, and parseFloat('12px') is 12 while Number('12px') is NaN. Pick deliberately.
- Template literals `` `${temp} F` `` are cleaner than string `+` for building the output.

**JS vs Java:** No Scanner/BufferedReader; the DOM input IS your I/O. And the killer difference: string-to-number is implicit and `+` means concatenation when either side is a string, so `'5' + 1` is '51', not 6.

**Variation to build:** Build a distance converter (miles <-> kilometers) or a currency converter with the same input+radio+button skeleton. Different domain than temperature.

---

## #25 Arrays  `[3:23:28]`

**Concept:** An ordered, index-from-0, dynamically-sized list. JS arrays are reference types (objects under the hood) and can hold mixed types. The backbone of nearly all list rendering in React.

**Bro glosses / gets wrong:**
- `typeof someArray` returns `'object'`, not 'array'. Use `Array.isArray(x)` to test.
- A `const` array can still be mutated (`push`, `pop`, index assignment). `const` freezes the binding (the reference), not the contents. To truly freeze use `Object.freeze`.
- `.length` is writable: `arr.length = 0` empties the array; setting it larger creates sparse holes.
- Assigning past the end (`arr[10] = x` on a 3-item array) creates empty holes, not zeros.

**Beneficial gaps (real/React code):**
- map/filter/reduce/forEach are the real payload here and Bro's intro won't cover them. `map` especially is how React renders lists. Learn these next.
- Immutability matters in React: prefer `[...arr, item]` and `.filter()`/`.map()` (return new arrays) over `push`/`splice` (mutate in place), because React detects changes by reference.
- Copy vs reference: `b = a` shares the same array; `b = [...a]` makes a (shallow) copy.
- slice (non-destructive, returns copy) vs splice (destructive, edits in place) is a classic mix-up.

**JS vs Java:** One dynamic array type, no fixed-size `int[]` vs `ArrayList` split and no element-type declaration. It grows/shrinks freely and can be heterogeneous. Closest mental model is ArrayList<Object>, but with map/filter built in.

**Variation to build:** Model a music playlist: array of song objects, add/remove tracks, then use filter to show only songs under 3 minutes. Different domain than Bro's grocery/fruit list.

---

## #26 Spread operator  `[3:31:33]`

**Concept:** The `...` prefix expands an iterable (array, string) or object's entries into individual elements/properties. Used to copy, merge, and pass collections as separate arguments without loops.

**Bro glosses / gets wrong:**
- It is a SHALLOW copy only. `[...arr]` copies the top level, but nested arrays/objects are still shared by reference. Bro may imply it's a full clone; it isn't.
- In object spread, order matters: `{...a, ...b}` lets b's keys overwrite a's. Later wins.
- Spreading only works on iterables for the array form; plain objects aren't iterable, so `[...obj]` throws. Object spread `{...obj}` is a separate feature.

**Beneficial gaps (real/React code):**
- Object spread for React state is the everyday use: `setState({...prev, name: 'new'})` to update one field immutably. This is arguably why you learn spread.
- Spread into function calls: `Math.max(...numbers)` unpacks an array into args.
- Merge/concat arrays cleanly: `[...a, ...b]` instead of `a.concat(b)`.
- For deep copies you need `structuredClone(obj)` (modern) or a library; spread won't do it.

**JS vs Java:** Java's nearest relative is varargs, but that's only for method calls. There is no Java literal that unpacks an array/collection into an array literal or clones an object inline. Spread is broader and syntactic.

**Variation to build:** Merge two configuration objects (default settings + user overrides) with `{...defaults, ...userPrefs}`, and combine two arrays of guest names for an event into one list.

---

## #27 Rest parameters  `[3:36:27]`

**Concept:** `...args` in a function signature collects all remaining arguments into a single real Array. Lets you write variadic functions (unknown/any number of args) cleanly.

**Bro glosses / gets wrong:**
- The rest parameter MUST be the last parameter; anything after it is a syntax error.
- Only one rest parameter is allowed per function.
- Same `...` token as spread, but the meaning is opposite: spread expands OUT (in a call/literal), rest gathers IN (in a parameter list). Bro may not draw this contrast explicitly.

**Beneficial gaps (real/React code):**
- Rest gives you a genuine Array, so `.map`/`.reduce` work directly. It replaces the old `arguments` object, which is only array-like and NOT available inside arrow functions.
- Combines with destructuring: `const [first, ...others] = arr` grabs the head and collects the tail.
- Named params before the rest still work: `function log(level, ...messages)`.

**JS vs Java:** Almost a direct mirror of Java varargs (`void f(String... args)`) and gives a real array just like Java. Main difference: syntax is `...` before the name instead of after the type, and there's no type on it.

**Variation to build:** Write `total(...prices)` for a shopping-cart subtotal and `average(...scores)` for quiz grades, each reducing the collected array. Different domain than Bro's example.

---

## #28 Dice Roller program  `[3:44:32]`

**Concept:** A DOM project: on button click, generate N random dice (1-6) with Math.random, then render them (numbers or images) to the page. Combines randomness, loops, and dynamic DOM output.

**Bro glosses / gets wrong:**
- `Math.random()` returns a float in [0, 1) (never exactly 1). The formula for 1-6 is `Math.floor(Math.random() * 6) + 1`; forgetting the `+1` gives 0-5, forgetting floor gives decimals.
- Bro builds output by concatenating an HTML string and assigning `innerHTML +=`. Each `+=` reparses and rebuilds the entire container, which is slow and destroys existing DOM state/listeners.
- `innerHTML` with any user-derived content is an XSS vector; fine for hardcoded dice, but a bad habit to generalize.

**Beneficial gaps (real/React code):**
- Prefer `addEventListener('click', ...)` over the `onclick` property Bro uses (stacks handlers, matches React's model).
- For dynamic elements, `document.createElement` + `append` (or a DocumentFragment) is safer and faster than innerHTML string concat, and template literals make the string version far more readable.
- `Math.random()` is not cryptographically secure; irrelevant for dice, relevant if you ever generate tokens (use `crypto.getRandomValues`).

**JS vs Java:** There is no `Random` object with `nextInt(6)`. You get a single free function `Math.random()` returning a double in [0,1), and you scale it yourself. No seeding, so runs aren't reproducible.

**Variation to build:** Build a random color generator (roll a random hex and paint a swatch) or a lottery number picker (six unique numbers 1-49). Different domain than dice.

---

## #29 Random password generator  `[3:58:44]`

**Concept:** Build a password by pulling random characters from selected pools (lowercase/uppercase/numbers/symbols), typically via Math.random() over char-code ranges and String.fromCharCode(). Exists to show string building + Math.random + user-toggled options wired to a button.

**Bro glosses / gets wrong:**
- Math.random() is NOT cryptographically secure. It is fine for a tutorial toy but must never generate a real password. Use crypto.getRandomValues(new Uint32Array(n)) (browser) or node:crypto for anything real.
- If you concatenate pool-by-pool (all lowercase, then all uppercase...) the output has predictable structure. A correct generator shuffles the final characters. Bro's version usually does not.
- Math.floor(Math.random()*range) can hit the boundary; off-by-one in the char-code range silently produces an unintended character (e.g. one past 'z').

**Beneficial gaps (real/React code):**
- Real-world button wiring should use button.addEventListener('click', handler), not button.onclick = handler. onclick allows exactly one handler and is the pattern React abandons; addEventListener is the mental model you carry into React's onClick={}.
- String.fromCharCode / charCodeAt operate on UTF-16 code units, so this approach breaks for any non-BMP character. Not a problem for ASCII passwords but worth knowing.
- navigator.clipboard.writeText() is the modern copy-to-clipboard API if you extend the project.

**JS vs Java:** JS has no char primitive. A 'character' is just a length-1 string, so you juggle code points via String.fromCharCode()/charCodeAt() instead of casting int<->char like Java.

**Variation to build:** Build a random WiFi-style pairing code or a license-key generator (e.g. XXXX-XXXX-XXXX groups) with a checksum digit, instead of a password.

---

## #30 Callbacks  `[4:10:49]`

**Concept:** A function passed as an argument to another function, to be invoked later by that function. It is the foundation of higher-order functions and all async control flow in JS.

**Bro glosses / gets wrong:**
- Pass the function REFERENCE (myFn), never call it (myFn()). Bro is usually careful here, but the beginner error is invoking it, which passes the return value instead of the function.
- Bro demos synchronous callbacks only. A callback is not inherently async; it is just deferred invocation. The async association comes later via timers/fetch, and conflating the two is a common misconception.

**Beneficial gaps (real/React code):**
- The reason callbacks matter today: they compose into Promises and async/await, which is what React actually uses (useEffect, event handlers, data fetching). Callbacks are the primitive under that.
- 'this' inside a plain-function callback is not the object you might expect (it is lost/global in non-strict, undefined in strict) unless it is an arrow function or explicitly bound. This is the #1 callback footgun.
- Node's error-first convention (callback(err, data)) and the concept of 'callback hell' motivate why Promises exist.

**JS vs Java:** Pre-lambda Java had no first-class functions; you passed behavior as an anonymous class implementing an interface (Runnable, Comparator). In JS a function is just a value you pass directly, no interface/type required.

**Variation to build:** Write a tiny calculator: operate(a, b, opCallback) where you pass in add/subtract/multiply as callbacks. Different domain from Bro's greeting/hello example.

---

## #31 forEach()  `[4:18:05]`

**Concept:** Array method that runs a callback once per element for side effects. Callback receives (element, index, array). Returns undefined; you use it for its effects, not a value.

**Bro glosses / gets wrong:**
- You CANNOT break or continue out of forEach. A return inside the callback only skips the current iteration (acts like continue). If you need to stop early, use a for...of or classic for loop.
- forEach does NOT await. Marking the callback async does not pause iteration; all callbacks fire and you get a pile of unhandled promises. Use for...of with await for sequential async.

**Beneficial gaps (real/React code):**
- forEach skips holes in sparse arrays (empty slots), which can surprise you vs a normal for loop.
- In React you rarely use forEach in JSX because it returns nothing to render; map() is the tool there. forEach is for imperative side effects (logging, mutating an external accumulator).

**JS vs Java:** The callback's second parameter is the index. Java's Iterable.forEach(Consumer) gives you the element only, no index, so the extra positional arg trips up Java devs who ignore it.

**Variation to build:** Iterate a playlist array and log each track's title + running cumulative duration, instead of Bro's fruits/numbers list.

---

## #32 map()  `[4:26:07]`

**Concept:** Transforms each element and returns a NEW array of the same length. The canonical immutable transform: original array is untouched.

**Bro glosses / gets wrong:**
- You MUST return a value from the callback. Forgetting return yields an array of undefined. (Arrow with implicit return, x => x*2, avoids this.)
- Do not use map purely for side effects; if you are not using the returned array, you want forEach. Using map for effects is a lint smell.

**Beneficial gaps (real/React code):**
- This is the React list-rendering workhorse: items.map(x => <Li key={x.id}>...). Every mapped element in JSX needs a stable key prop, which Bro's non-React context never mentions.
- map returns a new array (immutability), which is exactly why React state updates use it instead of mutating in place.
- Chains cleanly: arr.filter(...).map(...).

**JS vs Java:** Like Stream.map(), but eager and it returns a real Array immediately. No lazy pipeline, no terminal .collect(Collectors.toList()) step.

**Variation to build:** Map an array of Celsius readings to Fahrenheit, or map product objects to their price-with-tax, instead of Bro's numbers-squared example.

---

## #33 filter()  `[4:33:08]`

**Concept:** Returns a NEW array containing only elements for which the callback returns a truthy value (a predicate). Original array unchanged.

**Bro glosses / gets wrong:**
- The callback must return a boolean/truthy condition, not the element. Returning the element itself 'works' by truthiness but is a bug waiting to happen (0, '', NaN would be dropped).
- Result can be an empty array but is never undefined; always safe to chain or check .length.

**Beneficial gaps (real/React code):**
- Standard React pattern for removing an item from state immutably: setItems(items.filter(i => i.id !== targetId)). This is the everyday use, not the number-filtering demo.
- Chains with map: filter to select, then map to transform.
- filter uses truthiness, so understanding JS falsy values (0, '', null, undefined, NaN, false) matters for correct predicates.

**JS vs Java:** Like Stream.filter(Predicate) but returns a concrete Array directly rather than an intermediate Stream you must collect.

**Variation to build:** Filter a transactions array to only those above a spending threshold, or filter tasks to only the incomplete ones, instead of Bro's even-numbers example.

---

## #34 reduce()  `[4:39:37]`

**Concept:** Folds an array into a single accumulated value. Callback is (accumulator, current, index, array); whatever you return becomes the accumulator for the next iteration.

**Bro glosses / gets wrong:**
- ALWAYS pass the initial value as the second argument: arr.reduce(fn, 0). Without it, element[0] becomes the initial accumulator and iteration starts at index 1, and calling reduce on an empty array with no initial value THROWS a TypeError.
- You must return the accumulator every iteration. Forgetting the return makes the accumulator undefined on the next pass.

**Beneficial gaps (real/React code):**
- reduce is not just for summing numbers. The accumulator can be an object or array, so reduce can group/tally/build a lookup map (e.g. counting occurrences into {}).
- Signature has index and the full array as 3rd/4th args, useful for weighted folds.
- In React, reducers (useReducer / Redux) borrow this exact accumulate-state-from-action mental model.

**JS vs Java:** Argument order is (accumulator, current). Java's Stream.reduce(identity, BinaryOperator) separates the identity/seed as its own parameter and is stricter about types; JS just takes the seed as arg 2.

**Variation to build:** Reduce a shopping cart to a grand total, or reduce an array of votes into a {candidate: count} tally object, instead of Bro's summing example.

---

## #35 Function expressions  `[4:45:07]`

**Concept:** A function defined as a value and assigned to a variable (const greet = function() {...}), often anonymous. Contrasts with a function declaration (function greet() {...}). Treating functions as values is what enables callbacks/HOFs.

**Bro glosses / gets wrong:**
- Function expressions are NOT hoisted like declarations. With const/let the variable is in the temporal dead zone until the assignment line, so calling it earlier throws. Declarations are fully hoisted and callable before their line. Bro rarely stresses this.
- If Bro contrasts arrows here and repeats that an arrow's 'this' is the window: that is imprecise. Arrow 'this' is LEXICAL, inherited from the enclosing scope at definition time. It equals window only when the surrounding scope's this is window (e.g. top-level non-module). Inside a method or class it is whatever that outer this is.

**Beneficial gaps (real/React code):**
- Arrow functions are the terse form of function expressions and are the default in modern/React code, precisely because their lexical this avoids the callback this-loss problem.
- IIFE ((function(){...})()) and named function expressions (for better stack traces / self-reference) are practical extensions.
- Assigning functions to variables/objects is what lets you build strategy tables and pass behavior around.

**JS vs Java:** Java (pre-lambda) has no notion of storing a whole function in a variable; even lambdas must conform to a typed functional interface. In JS a function is a plain first-class value with no interface or type annotation required.

**Variation to build:** Build a strategy map of named function expressions, e.g. const discounts = { student: p => p*0.9, senior: p => p*0.85 } and look up the rule by key, instead of Bro's generic greet/add example.

---

## #36 Arrow functions  `[4:52:39]`

**Concept:** Compact function-expression syntax: (args) => expr. Exists for terse callbacks and, critically, to lexically capture `this` from the surrounding scope instead of rebinding it at call time.

**Bro glosses / gets wrong:**
- Arrow functions have NO own `this`, `arguments`, `super`, or `new.target`, and cannot be called with `new` (not constructors).
- Braceless body = implicit return of the single expression; adding `{}` forces you to write `return` explicitly.
- To implicitly return an object literal you must wrap it in parens: `() => ({x: 1})`, otherwise `{}` is read as a function body.
- Single param can drop the parens, zero or 2+ params require them.

**Beneficial gaps (real/React code):**
- React uses these everywhere: inline handlers `onClick={() => doThing()}` and class-field arrow methods to auto-bind `this`.
- Arrow fns are const-bound expressions, so they are NOT hoisted (unlike `function` declarations) - reference before definition throws.
- No `arguments` object; collect variadic args with rest `(...args) =>` instead.
- Great fit for `.map`/`.filter`/`.reduce` callbacks you will read constantly in React render code.

**JS vs Java:** Java lambdas only satisfy functional (SAM) interfaces and are typed; JS arrows are first-class values assignable to any variable/prop. Both capture enclosing scope, but a JS *regular* function rebinds `this` at the call site - the arrow's whole point is to NOT do that.

**Variation to build:** Bro used a math/greeting example. Build an array of temperature readings and chain arrow-fn `.map` (C to F) then `.filter` (keep above a threshold) to produce a warnings list.

---

## #37 JavaScript Objects  `[5:00:40]`

**Concept:** An object is an ad-hoc bag of key/value pairs (properties + method-valued properties), built with literal `{}` syntax. No class or type declaration required - it is the core data structure of JS.

**Bro glosses / gets wrong:**
- Keys are strings or Symbols; a numeric key is coerced to a string.
- Dot access needs a valid identifier; use bracket access `obj["weird-key"]` or `obj[variable]` for dynamic or invalid-identifier keys.
- `const obj = {}` does NOT make it immutable - you can still mutate/add/delete properties. `const` only locks the binding, not the contents.
- `Object.freeze(obj)` gives only SHALLOW immutability; nested objects stay mutable.

**Beneficial gaps (real/React code):**
- Shorthand `{x}` means `{x: x}`; computed keys `{[k]: v}`; these appear constantly in React.
- Spread `{...a, ...b}` copies/merges (shallow) - this is THE React pattern for immutable state updates: `setState({...state, count: 1})`.
- Destructuring `const {a, b} = obj` and renaming `const {a: x} = obj` - React props are almost always destructured.
- `Object.keys/values/entries` for iteration; objects aren't directly iterable with `for...of`.

**JS vs Java:** No class needed to instantiate an object, and there are no compile-time-declared fields - you add/remove properties at runtime. The closest Java analog is a HashMap, not a POJO. Nothing is private until `#` fields.

**Variation to build:** Bro used a person/car object. Model a `book` object with title/author/pages plus a `getSummary()` method, then build an array of books and destructure each in a loop.

---

## #38 What is THIS  `[5:07:40]`

**Concept:** `this` is a reference to the object that is executing the current function. Its value is decided by HOW the function is called (call site), not where it was written.

**Bro glosses / gets wrong:**
- Bro says an arrow function's `this` is the window object - IMPRECISE. Arrow `this` is LEXICAL: it inherits whatever `this` was in the enclosing scope at definition time. Inside a method or class instance that is the instance, not window.
- A regular function's `this` is dynamic: the object before the dot when method-called, but bare-called it is `undefined` in strict mode (all modules/classes) and only `window` in sloppy mode.
- The classic bug: passing a method as a callback (`setTimeout(obj.method)`) detaches it, so `this` is lost.

**Beneficial gaps (real/React code):**
- `call`/`apply`/`bind` explicitly set `this`; `bind` returns a permanently-bound copy.
- This is exactly WHY React class components do `this.handleClick = this.handleClick.bind(this)` in the constructor, or use arrow class fields to sidestep it.
- Because modules and class bodies are always strict, a lost `this` yields `undefined` (a TypeError on property access), not a silent window reference.

**JS vs Java:** In Java `this` is statically the enclosing instance, always and unambiguously. In JS `this` is late-bound at the call site and can be anything - a detached method call loses its `this` entirely, a failure mode Java simply does not have.

**Variation to build:** Build a `counter` object with an `increment()` method. Demonstrate `this` loss by passing it to `setTimeout`, then fix it two ways: an arrow wrapper and `.bind(counter)`.

---

## #39 Constructors  `[5:12:07]`

**Concept:** A constructor is a regular function invoked with `new` to manufacture objects. Inside it, `this` is a fresh object whose properties you assign; the object is returned implicitly. Convention: capitalize the name.

**Bro glosses / gets wrong:**
- Bro uses constructors without explaining the prototype chain. `new` does four things: creates an empty object, links its internal [[Prototype]] to the function's `.prototype`, binds `this` to it, and returns it.
- Methods assigned INSIDE the constructor create a fresh copy per instance (memory waste); shared methods belong on `Fn.prototype`.
- Forgetting `new` is a silent bug - `this` becomes undefined/window and properties leak or throw.

**Beneficial gaps (real/React code):**
- The prototype chain is the real mechanism: instances delegate failed property lookups up to `.prototype`. Classes just hide this.
- `instanceof` works by walking that chain.
- Modern code uses `class`, but React class components are constructor + prototype under the hood, so recognizing the pattern helps you read them.

**JS vs Java:** A constructor is just a function, not a member of a real class - and objects have no nominal type. Inheritance is prototype delegation at runtime, not a compiled class hierarchy, and there is no constructor overloading.

**Variation to build:** Bro likely used a car/person constructor. Write `Planet(name, radiusKm)` and build an array of solar-system planets, adding a shared `describe()` method on `Planet.prototype`.

---

## #40 Classes  `[5:17:38]`

**Concept:** `class` is syntactic sugar over constructor functions plus prototypes - a cleaner OOP-looking syntax with a `constructor` and method definitions. It changes ergonomics, not the underlying prototype model.

**Bro glosses / gets wrong:**
- Still prototype-based: methods live on the shared prototype, only fields set in the constructor are per-instance.
- Classes are NOT hoisted (unlike `function` declarations) - using one before its definition throws.
- Class bodies are always strict mode.
- No commas between class members (unlike object literals, which require them) - a common paste-error.

**Beneficial gaps (real/React code):**
- Private fields `#x`, `get`/`set` accessors, class fields `x = 5`, and auto-bound arrow methods `handle = () => {}` (the clean React handler pattern - no manual bind).
- You will read React class components: `class App extends React.Component { render() { ... } }` with `this.state` and lifecycle methods.
- Function components + hooks have largely replaced classes in new React, but legacy/class code is everywhere.

**JS vs Java:** Looks like Java but has no method overloading, no access modifiers beyond `#`, no interfaces, everything is public by default, no static typing - and it is still prototypes underneath, not a true class type.

**Variation to build:** Bro likely used a student/animal class. Write `class BankAccount` with `deposit`/`withdraw`, a `#balance` private field, and a `get balance()` accessor that throws on overdraft.

---

## #41 STATIC keyword  `[5:23:47]`

**Concept:** `static` members belong to the class itself, not to instances. Called as `ClassName.method()`. Use for utilities, factory methods, shared constants, and instance counters.

**Bro glosses / gets wrong:**
- A static method has no instance, so it cannot touch instance properties; `this` inside it refers to the CLASS, not an object.
- Instances cannot call static members - `instance.staticMethod()` throws.
- Don't confuse `static field = 0` (one shared value on the class) with an instance field (one per object).

**Beneficial gaps (real/React code):**
- Static fields `static count = 0` and static initialization blocks exist.
- Common real use: factory methods (`static fromJSON(data)`) and named constants.
- In React, statics like `Component.defaultProps` and `static getDerivedStateFromProps()` follow this exact pattern.

**JS vs Java:** Same concept as Java `static`, but `this` inside a JS static method points at the class object itself (usable to call sibling statics or resolve subclasses), whereas in Java you would just name the class. No static nested classes.

**Variation to build:** Bro used a plain example (e.g. counter). Write `class MathUtils` with static `clamp(n, min, max)` and `randomInt(min, max)`, or a `Circle` with a `static fromDiameter(d)` factory returning a new instance.

---

## #42 Inheritance  `[5:31:50]`

**Concept:** `extends` derives a subclass that reuses a parent's fields and methods; `super()` invokes the parent constructor and `super.method()` calls the parent's version. The child's prototype links to the parent's, forming the chain.

**Bro glosses / gets wrong:**
- You MUST call `super()` before touching `this` in a subclass constructor, or you get a ReferenceError.
- Overriding is just redefining the method on the child - no `@Override` annotation, no compiler check that a parent method exists.
- `super.method()` only reaches one level up; there is no multi-level `super.super`.

**Beneficial gaps (real/React code):**
- Mechanism is prototype-chain delegation, not a copy - method lookups walk up the chain until found.
- React explicitly recommends COMPOSITION over inheritance; deep class hierarchies are rare in idiomatic JS/React.
- `instanceof` walks the chain, so a subclass instance is `instanceof` its parent too.

**JS vs Java:** No interfaces, no multiple inheritance, no `abstract` classes or methods (you fake abstract by throwing in the base). Only a single prototype chain, and `super()` must be the first statement before `this` is usable.

**Variation to build:** Bro likely used animal to dog/cat. Build a `Shape` base with an `area()` that throws, then `Rectangle` and `Circle` subclasses that call `super(name)` and override `area()`; loop over a mixed array printing each area.

---

## #43 SUPER keyword  `[5:38:53]`

**Concept:** In a subclass, super() calls the parent constructor and super.method() calls a parent method. Exists to initialize inherited fields and extend (rather than fully replace) parent behavior.

**Bro glosses / gets wrong:**
- If a subclass defines its own constructor, you MUST call super() BEFORE touching `this` — accessing `this` first throws a ReferenceError, it is not merely optional.
- Bro demos classes without ever explaining the prototype chain: `super.method()` is resolved statically against the parent prototype (via the method's [[HomeObject]]), not re-looked-up dynamically off the instance.
- `super` is only valid inside class methods/constructors and object-literal shorthand methods — not in a standalone function.

**Beneficial gaps (real/React code):**
- Arrow functions have no own `super`; they inherit it lexically from the enclosing method — relevant when you nest a callback inside a class method.
- Legacy React class components require `super(props)` before `this.props` works; modern hooks-based React has no super at all, so this is mostly a 'reading old code' skill.
- super only chains constructors/methods — there is no `super.field` field-shadowing story like Java's.

**JS vs Java:** In Java, super() is implicit/optional when the parent has a no-arg constructor. In JS, once you write a subclass constructor you must explicitly call super() before any `this` access or it errors.

**Variation to build:** Media hierarchy: `MediaItem` base (title, durationSec) -> `Podcast extends MediaItem` adding host + episodeNumber, whose constructor calls super() then overrides a describe() via super.describe() + extra text.

---

## #44 Getters & Setters  `[5:48:14]`

**Concept:** `get`/`set` define accessor properties: reading `obj.prop` runs the getter, `obj.prop = x` runs the setter. Used for validation, computed/derived values, and controlled access.

**Bro glosses / gets wrong:**
- The `_name` underscore backing-field convention Bro uses is NOT actual privacy — anyone can still read/write `obj._name`. Real privacy is `#name` (private class fields).
- A getter/setter must NOT share its name with the raw property it wraps, or you get infinite recursion; that is why the `_` backing field exists.
- Accessed with NO parentheses — `obj.prop`, not `obj.prop()` — it looks like a field but executes code every time.

**Beneficial gaps (real/React code):**
- `#privateField` is the modern real encapsulation; pair it with a getter for read-only exposure.
- Getters run on EVERY access — an expensive computation in a getter is a silent perf trap; memoize if needed.
- Object.defineProperty is the lower-level API behind this. In React you almost never use accessors — derived values are just computed in render or via useMemo.

**JS vs Java:** Java getX()/setX() are ordinary methods you invoke with parens: `obj.getX()`. JS accessors are triggered by plain property syntax `obj.x`, so a Java dev's instinct to add () will call the returned value as a function and break.

**Variation to build:** A `Temperature` class storing `_celsius`, exposing get/set `fahrenheit` that converts on the fly — setting fahrenheit updates the underlying celsius. Different domain from Bro's person/name example.

---

## #45 Destructuring  `[6:01:28]`

**Concept:** Unpack array elements or object properties into standalone variables in one statement: `const [a,b] = arr`, `const {x,y} = obj`. Reduces boilerplate for extracting values.

**Bro glosses / gets wrong:**
- Array destructuring is POSITIONAL; object destructuring is BY KEY NAME — mixing up the two is the #1 beginner error.
- Rename while destructuring with `const {x: newName} = obj` (colon is rename, not type annotation).
- Bro likely skips defaults (`const {x = 0} = obj`), the rest pattern (`const [first, ...rest] = arr`), and skipping slots with commas (`const [, second] = arr`).

**Beneficial gaps (real/React code):**
- This is everywhere in React: props are destructured in the param list `function C({ title, onClick })`, and `const [state, setState] = useState()` is array destructuring.
- Swap without a temp: `[a, b] = [b, a]`.
- Nested destructuring `const {user: {name}} = data` and default values combine for safely pulling from API responses.

**JS vs Java:** Java had no destructuring until record pattern matching (very recent); a Java dev has no muscle memory for it and especially trips on position (arrays) vs name (objects) being different rules.

**Variation to build:** Destructure a geocoding result: `const { lat, lng, city = 'unknown' } = geoResponse` — and pull RGB out of an array `const [r, g, b] = pixel`. Weather/geo domain instead of Bro's example.

---

## #46 Nested objects  `[6:10:08]`

**Concept:** Objects whose properties are themselves objects or arrays, accessed by chaining `obj.a.b.c` or bracket notation. Models hierarchical data — this is exactly the shape of JSON.

**Bro glosses / gets wrong:**
- Accessing through a missing intermediate throws `TypeError: Cannot read properties of undefined` — reaching `obj.a.b` when `a` is undefined crashes, it does not return undefined.
- Bro almost certainly won't cover optional chaining `?.`, which is the real-world guard against exactly that crash.

**Beneficial gaps (real/React code):**
- Optional chaining `obj?.a?.b` short-circuits to undefined instead of throwing; pair with nullish coalescing `obj?.a?.b ?? fallback`.
- Nested objects are shared REFERENCES — a shallow copy (`{...obj}`) copies the top level but the inner objects are still shared, a classic bug source.
- React state must be updated immutably: to change a nested field you spread-copy each level (`{...state, addr: {...state.addr, city}}`), never mutate in place.

**JS vs Java:** No compile-time type checking — you can chain to any depth and only find out at runtime it was wrong. Java would force nested POJOs or Map types with static verification.

**Variation to build:** Model a restaurant menu: top object with category objects, each holding an items array of dish objects — then read `menu.desserts.items[0].price`. Org-chart/menu domain instead of Bro's likely person+address.

---

## #47 Arrays of objects  `[6:19:21]`

**Concept:** An array whose every element is an object — the canonical 'list of records' structure. Iterate to read, transform, or filter the collection.

**Bro glosses / gets wrong:**
- Bro tends to iterate with for-of or forEach, which is fine but is NOT the React-relevant toolset.
- Nothing enforces uniform shape — different elements can have different keys, unlike a typed list.

**Beneficial gaps (real/React code):**
- map / filter / find / reduce are the real workhorses: `.filter(p => p.active)`, `.find(p => p.id === 3)`, `.map(p => p.name)`.
- React renders lists by `.map()`-ing an array of objects into JSX and giving each element a stable `key` prop.
- Treat elements as immutable for React state — build a new array with map rather than mutating an object in place.

**JS vs Java:** Conceptually a `List<POJO>`, but with zero type safety per element. Array methods (map/filter/reduce) replace the Java Stream API but operate directly on the array, no `.stream()`/`.collect()` ceremony.

**Variation to build:** A list of GitHub repos `[{ name, stars, lang }]` — filter by lang, sort by stars, map to display strings. Repo/dev-tools domain instead of Bro's example set.

---

## #48 Sorting  `[6:29:21]`

**Concept:** `arr.sort(compareFn)` orders elements. compareFn(a,b) returns negative (a first), 0 (keep), or positive (b first). For numbers use `(a,b) => a - b`; for objects `(a,b) => a.score - b.score`.

**Bro glosses / gets wrong:**
- DEFAULT sort with no compareFn converts elements to STRINGS and sorts lexicographically — so `[10, 1, 2].sort()` yields `[1, 10, 2]`. This is the single biggest gotcha and must be stressed.
- `sort()` MUTATES the original array in place (and also returns it) — it is not a pure copy.
- Descending is just the flipped subtraction `(a,b) => b - a`; strings should use `a.localeCompare(b)` for correct locale/case behavior.

**Beneficial gaps (real/React code):**
- Mutation is a real React bug: sorting a state array in place skips re-render and corrupts state — do `[...arr].sort(...)` or use the newer immutable `arr.toSorted(...)` (ES2023).
- JS sort has been guaranteed STABLE since ES2019, so you can chain sorts for multi-key ordering.

**JS vs Java:** Java's Comparator must return strictly -1/0/1 style ints and default sort follows natural ordering. JS accepts any signed number (so `a - b` works) AND its DEFAULT is lexicographic string order, which blindsides Java devs expecting numeric sorting.

**Variation to build:** Sort a list of cities by population descending, then break ties by name with localeCompare — using a copied array so the original stays intact. City/population domain instead of Bro's example.

---

## #49 Shuffle an array  `[6:36:03]`

**Concept:** Randomize element order. The correct algorithm is Fisher-Yates: walk from the last index down, and swap each element with a randomly chosen element at or before it.

**Bro glosses / gets wrong:**
- The popular one-liner `arr.sort(() => Math.random() - 0.5)` is BIASED — it does not produce a uniform distribution and depends on the engine's sort. Do not use it; use Fisher-Yates.
- If Bro teaches Fisher-Yates, that is genuinely correct — the thing to verify is the index formula `Math.floor(Math.random() * (i + 1))` (must be `i + 1` to allow an element to stay put).
- The shuffle MUTATES in place.

**Beneficial gaps (real/React code):**
- Copy first (`const copy = [...arr]`) before shuffling if you need immutability / React state safety.
- `Math.random()` returns [0, 1) and is NOT cryptographically secure — for anything security-sensitive (tokens, fair gambling) use `crypto.getRandomValues`.

**JS vs Java:** Java gives you `Collections.shuffle()` out of the box. JS has NO built-in shuffle — you must implement Fisher-Yates yourself, and Math.random()'s range is [0,1) not an int API like java.util.Random.nextInt.

**Variation to build:** Shuffle a deck of flashcards before a study round, returning a new randomized array so the master ordered set is preserved. Study/flashcard domain instead of Bro's example.

---

## #50 Dates  `[6:40:08]`

**Concept:** The Date object is JS's built-in for timestamps. `new Date()` = now; `new Date(year, monthIndex, day, h, m, s)` or `new Date('2026-07-11')` for a specific moment. Internally it's just milliseconds since the Unix epoch (Jan 1 1970 UTC). You read parts with getFullYear/getMonth/getDate/getHours etc. and format for display.

**Bro glosses / gets wrong:**
- Month is ZERO-indexed: getMonth() returns 0 for January, 11 for December. Day-of-month (getDate) is 1-indexed. Bro usually mentions this but it's the #1 Date bug.
- getDay() (day of WEEK, 0=Sunday) is NOT getDate() (day of MONTH). Easy to swap.
- Parsing `new Date('2026-07-11')` is treated as UTC midnight, but `new Date('2026/07/11')` or `new Date(2026,6,11)` is treated as LOCAL time. Same-looking dates can be off by your timezone offset.
- Date objects are MUTABLE (setHours, setDate mutate in place). If you store one and later mutate it, every reference changes.

**Beneficial gaps (real/React code):**
- Real code rarely hand-formats dates. Use `date.toLocaleDateString()` / `toLocaleTimeString()` / `Intl.DateTimeFormat` for locale- and timezone-aware output instead of string-concatenating parts.
- `Date.now()` returns the epoch millis number directly, faster than `new Date().getTime()` when you only need elapsed time.
- Dates and timezones are notoriously painful; production apps typically reach for a library (date-fns, Luxon) or the newer Temporal API. Good to know these exist.
- React: never render a raw Date object into JSX (it stringifies inconsistently and can differ server vs client, causing hydration mismatches). Format to a string first.

**JS vs Java:** No LocalDate/LocalDateTime/Instant split like java.time. JS has ONE Date type that is always a UTC instant under the hood, and it's mutable (unlike Java's immutable java.time types). Month zero-indexing exists in legacy java.util.Calendar too, so that part may feel familiar.

**Variation to build:** Build a 'days until next birthday' countdown: user enters a birthdate, compute the difference in whole days to the next occurrence, handle the case where the birthday already passed this year (roll to next year).

---

## #51 Closures  `[6:48:09]`

**Concept:** A closure is a function bundled together with the variables from the scope where it was DEFINED. When an inner function references an outer function's variable, that variable stays alive after the outer function returns because the inner function still holds a reference to it. This is how JS does private state and factory functions.

**Bro glosses / gets wrong:**
- Bro typically demos closures via a counter but glosses the MECHANISM: it's not that the value is copied, the inner function keeps a live reference to the SAME variable binding. Two closures over the same variable see each other's mutations.
- Closure captures the VARIABLE, not the value at definition time. The classic `for (var i...)` + setTimeout bug prints the final i every time because all closures share one `i`. `let` fixes it by creating a fresh binding per iteration. Bro uses let/const so may never show this trap, but you'll hit it reading older code.
- Closures can leak memory: a closure holding a large object keeps it un-garbage-collected as long as the closure is reachable.

**Beneficial gaps (real/React code):**
- Closures are the foundation of the module pattern (private variables via an IIFE) and of nearly every React Hook. `useState`, event handlers, and `useEffect` callbacks are all closures over the component's render-time variables.
- React 'stale closure' bug: an effect or callback captures a variable from an old render and keeps using the old value. This is the single most common Hooks confusion, and it's pure closure behavior. Dependency arrays exist to control which closure you get.
- Closures enable currying / partial application and function factories (a function that returns a preconfigured function).

**JS vs Java:** Java lambdas/anonymous classes can only capture variables that are final or effectively final (read-only). JS closures capture MUTABLE bindings and can reassign them. That freedom is why the loop-variable bug exists in JS but not in Java.

**Variation to build:** Build a `makeRateLimiter(maxPerMinute)` factory that returns a function; each returned limiter keeps its own private call-count in a closure and returns true/false for whether an action is allowed. Different domain (throttling), same private-state pattern.

---

## #52 setTimeout()  `[6:59:07]`

**Concept:** setTimeout(callback, delayMs) schedules a function to run ONCE after at least delayMs milliseconds. It returns a numeric id you can pass to clearTimeout() to cancel before it fires. setInterval() is the repeating sibling, cancelled with clearInterval(). These are how you defer or schedule work without blocking.

**Bro glosses / gets wrong:**
- The delay is a MINIMUM, not a guarantee. setTimeout(fn, 0) does not run immediately; it runs after the current synchronous code finishes and the call stack is clear. The timer is a floor, not a promise of exact timing.
- setTimeout is NOT part of the JS language; it's a browser (and Node) API. The engine hands the timer to the environment, which queues the callback later. This is why understanding the event loop matters here.
- setInterval drifts: it doesn't account for how long your callback takes, so intervals accumulate error over time. For accurate clocks/stopwatches, compute elapsed time from Date.now() rather than counting ticks.
- Always store the id and clear it. Forgetting clearInterval is a classic leak, especially timers that outlive the thing that started them.

**Beneficial gaps (real/React code):**
- Arguments after the delay are passed to the callback: `setTimeout(fn, 1000, arg1, arg2)`. Avoids wrapping in an extra arrow just to pass params.
- React: any setTimeout/setInterval started in useEffect MUST be cleared in the effect's cleanup return, or you get leaks and setState-after-unmount warnings. This is the #1 reason people reach for the cleanup function.
- For animation, requestAnimationFrame is preferred over setTimeout because it syncs to the display refresh and pauses in background tabs.

**JS vs Java:** No Thread.sleep() equivalent, and you would not want one. JS is single-threaded with an event loop, so you never block the thread to wait; you schedule a callback and let execution continue. Blocking the main thread freezes the entire UI.

**Variation to build:** Build an auto-dismissing 'toast' notification: show a message div, setTimeout to fade+remove it after 4s, and if the user clicks it early, clearTimeout and dismiss immediately (exercises the cancel path).

---

## #53 Digital Clock program  `[7:05:20]`

**Concept:** Project section: render the current time into the DOM and refresh it every second. Pattern is an updateClock() function that reads new Date(), formats hours/minutes/seconds with zero-padding, writes it to an element's textContent, wrapped in setInterval(updateClock, 1000). Also calls it once immediately so there's no blank second on load.

**Bro glosses / gets wrong:**
- Zero-padding: Bro usually pads with a manual `String(n).padStart(2,'0')` or a helper. Note padStart is the clean built-in; don't reinvent it with if/else concatenation.
- 12-hour formatting: `hours % 12 || 12` handles the midnight/noon edge (0 must display as 12). A naive `hours % 12` shows 0:xx at midnight. Watch this if you add AM/PM.
- setInterval at 1000ms can visibly skip or double a second because it drifts and isn't frame-aligned. Fine for a demo, but not truly accurate.

**Beneficial gaps (real/React code):**
- Setting text: prefer textContent over innerHTML here. innerHTML reparses HTML and is an XSS vector if any value is user-influenced; textContent is faster and safe.
- `new Date().toLocaleTimeString()` gives you a locale-correct formatted clock in one call, no manual padding needed. The manual approach is a teaching exercise, not what you'd ship.
- React version: this is the canonical useState + useEffect(setInterval) + cleanup example. You'd store time in state, update it in the interval, and clear the interval on unmount. Rendering is declarative instead of textContent assignment.
- Grabbing the DOM node once outside the interval (not re-querying with getElementById every tick) is the tidier structure.

**JS vs Java:** The whole thing is event-loop driven, not a while-loop-plus-sleep on a background thread like you'd write in Java. You register a recurring callback and hand control back to the runtime; there's no thread you manage.

**Variation to build:** Build a countdown timer to a fixed target datetime (e.g., a rocket launch or New Year): compute remaining ms each tick, break into days/hours/mins/secs, and swap the display to 'Liftoff' when it hits zero (clearInterval at the end).

---

## #54 Stopwatch program  `[7:16:07]`

**Concept:** Project section: start/stop/reset stopwatch showing elapsed time. Correct approach records a start timestamp (Date.now()) minus accumulated elapsed, then on each interval tick computes `Date.now() - startTime` and formats it. Start sets the interval, Stop clears it and banks elapsed, Reset zeroes everything.

**Bro glosses / gets wrong:**
- The RIGHT way is to compute elapsed from timestamps, NOT to increment a counter each tick (`seconds++`). Tick-counting drifts and loses/gains time because setInterval isn't exact. If Bro increments a counter, that's the imprecise version; the timestamp-diff approach is accurate.
- Pause/resume needs an accumulator: on stop, save elapsedSoFar; on restart, set startTime = Date.now() - elapsedSoFar so the clock continues instead of restarting from zero.
- Guard the Start button against double-clicks. Clicking Start twice creates a second interval that never gets cleared (the id is overwritten and leaks). Track running state or clear before setting.

**Beneficial gaps (real/React code):**
- Formatting sub-second precision: divide/modulo the millisecond diff into minutes/seconds/centiseconds; padStart each field. This is fiddlier than a whole-second clock.
- performance.now() is the higher-resolution, monotonic alternative to Date.now() for measuring elapsed time; it isn't affected by the system clock being adjusted. Better for a real stopwatch.
- React version: elapsed lives in state, the interval updates it, and you MUST clear the interval on stop AND on unmount. A common React stopwatch bug is a stale-closure interval reading the old elapsed value; you either use the functional setState updater or a ref for startTime.

**JS vs Java:** No System.currentTimeMillis()/System.nanoTime() called on a worker thread; you get Date.now()/performance.now() but the ticking is done by the event loop, not a sleeping thread. State between ticks lives in outer/module variables (closures), not instance fields.

**Variation to build:** Build a lap timer for a workout app: same start/stop/reset, plus a Lap button that snapshots the current elapsed into a list and displays running laps (adds array state on top of the stopwatch core).

---

## #55 ES6 Modules  `[7:34:12]`

**Concept:** Modules let you split code across files and share it explicitly. `export` marks what a file exposes; `import` pulls it into another. Named exports (`export const x`, `import { x }`) can be many per file; a default export (`export default`) is one per file and imported without braces under any name. Each module has its own scope, so no more polluting the global namespace.

**Bro glosses / gets wrong:**
- In the browser you must load the entry file as `<script type="module" src=...>`. Without type="module", import/export throws a syntax error. Bro shows this; it's easy to forget and get a cryptic error.
- Modules are automatically in strict mode and DON'T share global scope. Top-level `const` in a module is NOT global. Variables are private unless exported.
- Named import names must MATCH the export (or be aliased with `as`). Default imports can be named anything, which trips people who think the name is meaningful.
- ES modules load over HTTP with CORS rules, so `type="module"` scripts won't work from a `file://` path; you need a local server. A very common 'why is it broken' moment.
- Import paths in the browser need the extension (`./util.js`), unlike Node/bundler resolution which often lets you omit it.

**Beneficial gaps (real/React code):**
- Imports are HOISTED and the bindings are LIVE and read-only: you import a live view of the exported binding, not a copy, and you cannot reassign an imported name.
- ES modules (import/export) vs CommonJS (require/module.exports) are two different systems; Node historically used CommonJS. React/bundler projects use ES modules, which is what you'll see everywhere in modern code.
- In React you'll read these constantly: `import React from 'react'` (default) alongside `import { useState } from 'react'` (named) in one line. Bundlers (Vite/webpack) also enable tree-shaking, dropping unused named exports from the final build.
- Bare specifiers like `import x from 'react'` (no ./) resolve from node_modules via the bundler, not natively in the browser.

**JS vs Java:** Not like Java packages/imports. There's no package declaration tied to folder structure and no classpath; you import from an explicit relative or resolved FILE path, and you choose what's public per-file with export rather than per-class access modifiers.

**Variation to build:** Refactor a small currency-converter into modules: a `rates.js` exporting a rates table (named exports), a `convert.js` exporting a default convert(amount, from, to) function, and a `main.js` that imports both and wires up the DOM.

---

## #56 Asynchronous code  `[7:40:17]`

**Concept:** JS is single-threaded: one call stack, one thing at a time. Asynchronous code lets long operations (timers, network, file I/O) run without freezing that thread. The runtime offloads the operation, keeps executing your code, and queues a callback to run later when the result is ready. This is the conceptual umbrella over callbacks, Promises, and async/await.

**Bro glosses / gets wrong:**
- 'Asynchronous' does NOT mean multithreaded or parallel. The JS engine still runs one line at a time; the concurrency comes from the environment (browser/Node) doing the waiting off-thread and handing back a callback. Bro often blurs 'async' with 'at the same time' - it's interleaving, not parallelism.
- Order of execution is the whole lesson: synchronous code runs top-to-bottom first, then queued async callbacks run after the stack clears. `console.log('A'); setTimeout(()=>log('B'),0); console.log('C')` prints A, C, B. If this surprises you, you don't yet get the event loop.
- Microtasks (Promise .then/await continuations) run BEFORE macrotasks (setTimeout) even at 0ms delay. This ordering distinction is glossed in most intros but explains real 'why did this log first' bugs.

**Beneficial gaps (real/React code):**
- This section is usually the setup for Promises and async/await (the next topics). Callbacks were the old way; Promises fixed 'callback hell'; async/await is syntactic sugar over Promises that makes async code read top-to-bottom.
- The event loop model: call stack + task queue + microtask queue. Worth internalizing once because it explains almost every async surprise you'll hit.
- For genuine parallelism (CPU-bound work), you need Web Workers - separate threads that message-pass. Async alone won't speed up a heavy computation; it only helps with waiting.
- React relevance: data fetching in useEffect is async, state updates are batched/asynchronous (you don't see the new state on the next line), and event handlers commonly await. Understanding 'the value updates later, not now' prevents a class of React bugs.

**JS vs Java:** No threads, no synchronized, no Future.get() blocking a pool thread. Where Java blocks a worker thread and waits, JS never blocks the single main thread; it registers a continuation and returns control to the event loop. Mentally replace 'spin up a thread' with 'schedule a callback'.

**Variation to build:** Simulate an async data pipeline for a weather widget: a fake fetchWeather(city) that resolves after a random delay, then log start/end markers around it to prove synchronous lines run before the resolved result, demonstrating execution order.

---

## #57 Error handling  `[7:45:04]`

**Concept:** try/catch/finally to intercept runtime exceptions so the script keeps running instead of dying on the line that threw. throw raises an error; catch receives it; finally always runs (cleanup).

**Bro glosses / gets wrong:**
- throw can hurl ANY value (string, number, object), but you should throw `new Error(msg)` (or a subclass) so you get a stack trace and a .message/.name. Bro may throw bare strings.
- finally runs even when try or catch executes a `return` — and a return inside finally overrides earlier returns. Easy to shoot yourself.
- Modern JS allows optional catch binding: `catch { }` with no `(err)` when you don't need the object.

**Beneficial gaps (real/React code):**
- async errors: a try/catch only catches a rejected promise if you `await` it inside the try; otherwise use `.catch()`. A throw inside a non-awaited callback escapes the surrounding try entirely.
- Custom errors: `class ValidationError extends Error {}` then branch with `if (e instanceof ValidationError)` inside one catch.
- React: try/catch works in event handlers and effects, but errors thrown during render must be caught by an Error Boundary (a class component with componentDidCatch / getDerivedStateFromError), not try/catch.

**JS vs Java:** No checked exceptions, no `throws` clause, and no multi-catch by type. There is exactly ONE catch block — you discriminate error types manually with `instanceof` inside it.

**Variation to build:** A temperature converter that throws a custom RangeError when the input is non-numeric or below absolute zero (-273.15C), and prints a friendly message from catch.

---

## #58 Calculator program  `[7:54:06]`

**Concept:** Project section: wire number/operator buttons to a display, accumulate the expression string, and evaluate on '='. Mostly typing narration.

**Bro glosses / gets wrong:**
- Bro's classic calculator uses `eval()` to compute the result. eval executes arbitrary code — it is a security and performance footgun and is never used in production. Real code parses the operands/operator manually or uses a tiny expression parser.
- Everything read from an input or button is a STRING. `"3" + "4"` is "34", not 7. You must Number()/parseFloat() before arithmetic.
- `0.1 + 0.2 === 0.30000000000000004` — IEEE-754 floats bite calculators; round for display with toFixed().

**Beneficial gaps (real/React code):**
- Buttons should be wired with addEventListener, not inline onclick attributes — the real-world / React-adjacent pattern (see #63).
- Event delegation: attach ONE listener to the button grid and read event.target.dataset instead of N listeners.
- React version: the display is state (useState), buttons dispatch updates; you never touch input.value directly — the value is derived from state (controlled component).

**JS vs Java:** input.value is always a String even for `<input type="number">`; there is no auto-unboxing to int/double like Java. Convert explicitly.

**Variation to build:** A restaurant tip calculator: bill amount + tip % + split-by-N people, outputting per-person total, rounded to 2 decimals.

---

## #59 What is the DOM?  `[8:09:26]`

**Concept:** The DOM (Document Object Model) is the live, in-memory tree of objects the browser builds from your HTML. Each tag becomes a node; JS reads and mutates the page through the global `document` object.

**Bro glosses / gets wrong:**
- The DOM is NOT your HTML source file. It's the parsed, normalized, possibly-JS-modified live tree. View-Source shows the original HTML text; the DevTools Elements panel shows the current DOM — they can differ.
- The browser auto-corrects/normalizes malformed HTML while building the DOM, so the tree may have nodes you didn't literally write (e.g. an implicit <tbody>).

**Beneficial gaps (real/React code):**
- Reflow (layout recalculation) and repaint are expensive; touching the DOM in a loop is the classic perf trap — batch changes.
- This is the exact thing React abstracts: React keeps a Virtual DOM (a lightweight JS object tree), diffs it on state change, and applies the minimal set of real-DOM mutations for you. Knowing the real DOM is knowing what React is optimizing away.
- `document` is an ambient global — no import needed — and only exists in a browser, not in Node.

**JS vs Java:** No import/instantiation ceremony — `document` and `window` are just there, globally. Closest mental model is a JavaFX/Swing scene graph, but ambient and singleton.

**Variation to build:** Open any content-heavy site (e.g. a Wikipedia article), then in the console map its tree: log document.body, then .children, and sketch the top 3 levels.

---

## #60 Element selectors  `[8:14:26]`

**Concept:** How to grab element references from the DOM: getElementById, getElementsByClassName/TagName, and the modern querySelector / querySelectorAll (CSS-selector syntax).

**Bro glosses / gets wrong:**
- getElementsBy* return LIVE HTMLCollections — they auto-update as the DOM changes and they do NOT have forEach/map. querySelectorAll returns a STATIC NodeList — a snapshot that DOES have forEach (but still not map/filter).
- querySelector returns only the FIRST match (or null); querySelectorAll returns all. null is what you get on no match — accessing .value on it throws.
- HTMLCollection and NodeList are array-LIKE, not arrays. Convert with `Array.from(...)` or `[...nodes]` before using map/filter/reduce.

**Beneficial gaps (real/React code):**
- querySelector('#id .cls > tag') takes any CSS selector — it's the versatile real-world default; the older getElementBy* methods are mostly legacy.
- React: you almost never select DOM nodes manually. For the rare direct-DOM need (focus, measure, integrate a non-React lib) you use `useRef` + ref.current; reaching for querySelector inside a component fights React's ownership of the DOM.

**JS vs Java:** The returned collections have no .stream()/.map(); they're not List<Element>. You must Array.from() them first to get functional methods.

**Variation to build:** Grab every nav link with querySelectorAll('nav a'), spread into an array, and log each element's href and text.

---

## #61 DOM navigation  `[8:32:04]`

**Concept:** Traverse the tree from one node to relatives: parentElement, children, firstElementChild/lastElementChild, nextElementSibling/previousElementSibling.

**Bro glosses / gets wrong:**
- There are TWO parallel APIs: the Node ones (childNodes, firstChild, nextSibling) include TEXT nodes — and whitespace/newlines between tags count as text nodes, so firstChild is often an empty text node, not your first tag. The Element ones (children, firstElementChild, nextElementSibling) skip text and give you only elements. Use the Element variants.
- parentNode vs parentElement are almost always identical, but parentElement is null at the document root while parentNode isn't.

**Beneficial gaps (real/React code):**
- Understand the Node-vs-Element distinction generally: comments and text are Nodes but not Elements.
- React does none of this — you never walk the DOM to find a sibling. Relationships are expressed by component composition (props, children, lifting state up). Manual navigation is brittle and breaks the moment markup changes.

**JS vs Java:** The whitespace-text-node surprise: a raw childNodes traversal returns non-element nodes you didn't expect, unlike a clean typed tree walk in Java.

**Variation to build:** On a click of any <li> in a list, walk to its parent, then highlight every sibling <li> except the clicked one using nextElementSibling/previousElementSibling.

---

## #62 Add & change HTML  `[8:47:31]`

**Concept:** Imperatively create and mutate DOM: createElement, append/appendChild, textContent, innerHTML, setAttribute, and classList (add/remove/toggle).

**Bro glosses / gets wrong:**
- innerHTML parses its string AS HTML — assigning user-supplied text to innerHTML is a classic XSS hole. Use textContent for plain text; only use innerHTML for trusted markup. Bro tends to reach for innerHTML casually.
- classList.add/remove/toggle/contains is the right tool; manually concatenating the className string clobbers existing classes.
- append() (newer) accepts strings and multiple nodes and returns undefined; appendChild() takes exactly one Node and returns it. Don't mix them up.
- textContent vs innerText: innerText is layout-aware (respects CSS visibility, triggers reflow to compute) and slower; textContent grabs raw text of all nodes and is what you usually want.

**Beneficial gaps (real/React code):**
- Batch inserts with a DocumentFragment (or build detached then append once) to avoid repeated reflow.
- This whole imperative create/append dance is exactly what JSX replaces. In React you describe the markup declaratively and set state; React creates/updates/removes the nodes. Manual DOM building inside a React component is an anti-pattern.

**JS vs Java:** A string is not a node. innerHTML='<b>hi</b>' parses markup into elements; there's no equivalent implicit HTML-parsing assignment in typical Java UI code.

**Variation to build:** A to-do list: read an input, createElement('li'), set its textContent, append it to a <ul>, and give each a toggle-done class via classList.toggle on click.

---

## #63 Mouse events  `[9:03:03]`

**Concept:** React to pointer interaction — click, dblclick, mouseover/mouseout, mousedown/mouseup, mousemove — by registering handlers that receive an event object.

**Bro glosses / gets wrong:**
- Bro favors onclick PROPERTY assignment (element.onclick = fn). That allows only ONE handler — a second assignment overwrites the first. addEventListener('click', fn) is the standard: it stacks multiple handlers and supports capture/once/passive options. Prefer it everywhere.
- `this` inside a REGULAR-function handler is the element the listener is bound to. Inside an ARROW-function handler `this` is lexical — inherited from the enclosing scope (NOT the element, and not automatically window). This is the precise correction to the earlier 'arrow this = window' claim: it's whatever this was where the arrow was defined.
- event.target = the actual node clicked (could be a child); event.currentTarget = the node the listener is attached to. They differ when the click bubbles up from a descendant.

**Beneficial gaps (real/React code):**
- removeEventListener requires the SAME function reference you added — an inline anonymous/arrow function can never be removed. Name it if you need to detach.
- Event delegation: attach one listener to a parent and inspect event.target — the only sane way to handle clicks on dynamically-added children (lists, tables).
- event.preventDefault() (stop default like link nav / form submit) and stopPropagation() (halt bubbling).
- React: it's onClick={handler} — camelCase, you pass a function reference (not a string, not calling it), and it's a SyntheticEvent. React already does delegation at the root, so you rarely need addEventListener yourself; use it (in useEffect, with cleanup) only for window/document or non-React targets.

**JS vs Java:** Handlers take a single event object argument, and there are no listener interfaces to implement (no ActionListener). The `this`-rebinding depending on regular-vs-arrow function has no Java analog and is the main trap.

**Variation to build:** An image-swap gallery: on mouseover a thumbnail swap the main <img> src, on mouseout restore it, and on click set it as the permanent selection — wired with addEventListener via delegation on the thumbnail container.

---

## #64 Key events  `[9:13:33]`

**Concept:** Keyboard events (keydown, keyup) fire when a user presses/releases a key; the event object carries which key it was. Used for shortcuts, games, and text-input reactions.

**Bro glosses / gets wrong:**
- keypress is deprecated - use keydown. Bro may still mention it.
- event.keyCode is deprecated (the old numeric code). Use event.key (the character produced, e.g. 'a', 'Enter') or event.code (the physical key, e.g. 'KeyA') instead.
- event.key IS case/shift sensitive ('a' vs 'A'); event.code is NOT (always 'KeyA'). Pick based on whether you care about the character or the physical key.

**Beneficial gaps (real/React code):**
- addEventListener('keydown', ...) is the real-world/React-adjacent pattern; the onkeydown property only allows ONE handler and gets overwritten.
- Call event.preventDefault() to stop the browser's default (e.g. spacebar/arrows scrolling the page) in games.
- Modifier state comes from event.shiftKey / ctrlKey / altKey / metaKey booleans, not separate events.
- React: onKeyDown={e => ...} synthetic event, still read e.key.

**JS vs Java:** No KeyListener interface or keyPressed() override boilerplate. You compare against strings like 'Enter' or 'Escape', not int constants like KeyEvent.VK_ENTER.

**Variation to build:** Build a Konami-code detector: buffer the last N keys pressed and unlock a hidden message when the sequence matches. Different domain (easter-egg unlocking) but same keydown + event.key core.

---

## #65 Hide/show HTML  `[9:24:49]`

**Concept:** Toggle an element's visibility at runtime, usually by mutating element.style.display between 'none' and a visible value on a button click.

**Bro glosses / gets wrong:**
- element.style.display reads ONLY inline styles, not rules from a CSS file. If the element's initial 'none' came from a stylesheet, element.style.display is '' (empty), so a naive 'if display===none' check misfires on the first click.
- Hardcoding display='block' to re-show clobbers layout if the element was originally flex/grid. Cache the original value or toggle a class instead.
- display:none removes the element from layout entirely; visibility:hidden hides it but keeps its space. They are not interchangeable.

**Beneficial gaps (real/React code):**
- Cleaner pattern: define .hidden{display:none} in CSS and use classList.toggle('hidden') - keeps styling out of JS.
- The HTML hidden attribute (el.hidden = true) is a built-in one-liner for the common case.
- React does NOT toggle display - it conditionally renders: {show && <Panel/>}. The element leaves the DOM entirely rather than being hidden.

**JS vs Java:** The DOM style object is live - assigning to it re-renders immediately. There's no setVisible(boolean) method; you mutate a string CSS property.

**Variation to build:** Build a spoiler/FAQ accordion: each question toggles its answer panel open/closed. Different domain (content disclosure) but identical show/hide mechanic.

---

## #66 NodeLists  `[9:30:00]`

**Concept:** querySelectorAll returns a NodeList - an array-like collection of matched elements - so you can loop over many elements at once (e.g. attach the same handler to every button).

**Bro glosses / gets wrong:**
- A NodeList is NOT a real Array: no map, filter, reduce, or push. It DOES have forEach and .length and index access [i].
- querySelectorAll returns a STATIC NodeList (snapshot). getElementsByClassName/getElementsByTagName return a LIVE HTMLCollection that auto-updates as the DOM changes AND has no forEach - a common trap if Bro mixes them.
- .length not .size().

**Beneficial gaps (real/React code):**
- Convert to a full array with [...nodeList] or Array.from(nodeList) when you need map/filter.
- In React you almost never do this - you map over a data array and let JSX produce the elements, rather than querying the DOM for nodes.

**JS vs Java:** It looks like a List<Node> but isn't - it's array-like with a missing method set. Spread it to get 'real' collection operations.

**Variation to build:** Build a bulk todo-strikethrough: select all list items and, on a 'complete all' button, forEach to add a line-through class. Different domain (task lists) but same NodeList iteration.

---

## #67 classList  `[9:43:21]`

**Concept:** classList is the DOM API for reading/mutating an element's set of CSS classes - add, remove, toggle, contains - without rebuilding the whole className string.

**Bro glosses / gets wrong:**
- classList.toggle('x') RETURNS a boolean (whether the class is now present) - handy for tracking state.
- toggle takes an optional second 'force' argument: toggle('x', true) always adds, toggle('x', false) always removes - lets you drive it from a boolean instead of branching.
- Avoid element.className += ' foo' - it clobbers/duplicates and needs manual string surgery to remove. classList handles this cleanly.

**Beneficial gaps (real/React code):**
- add/remove accept multiple classes at once: add('a','b'). Also useful: replace(old,new) and contains(x).
- React inverts this: you don't imperatively toggle classes - state drives the className string (often via a ternary or the clsx/classnames helper). Learn classList to READ React code, but expect not to write it much.

**JS vs Java:** No Java analog - it's a token-set abstraction over a space-separated string attribute. Treat it like a Set<String> with add/remove/contains.

**Variation to build:** Build a like-button: clicking toggles a 'liked' class that swaps an outlined heart for a filled one via CSS. Different domain (social UI) but pure classList.toggle.

---

## #68 Rock Paper Scissors  `[9:59:20]`

**Concept:** Project section wiring the earlier concepts together: a random computer choice, comparison logic to decide the winner, and DOM updates to show the result.

**Bro glosses / gets wrong:**
- Math.floor(Math.random() * 3) yields 0,1,2. Math.random() returns [0,1) - it never returns exactly 1, so you never overflow the array. This is correct, but worth knowing why.
- This section is mostly typing narration - the logic (chained if/else on string comparisons) is verbose but not wrong.

**Beneficial gaps (real/React code):**
- Win logic collapses with modulo: index the choices ['rock','paper','scissors'] and use (player - cpu + 3) % 3 === 1 to detect a player win - no long if/else ladder.
- Three buttons should use event delegation (one listener on the parent, read event.target) or addEventListener in a loop - not three separate onclick attributes.
- Prefer addEventListener over onclick for real code / React habits.

**JS vs Java:** Math.random() returns a double in [0,1) just like Java's - but there's no Random class to instantiate and no int[] typing; you use an array literal directly.

**Variation to build:** Build a 'Higher or Lower' card game: deal a random value, player guesses if the next is higher or lower, compare and update score. Different domain (card betting) but same random + compare + DOM-update loop.

---

## #69 Image Slider  `[10:18:14]`

**Concept:** Cycle through an array of image sources by tracking an index, wrapping around with modulo, and optionally auto-advancing with setInterval.

**Bro glosses / gets wrong:**
- Forward wrap: (i + 1) % len. Backward wrap MUST add len first: (i - 1 + len) % len - because JS % on a negative returns a negative (-1 % 3 === -1), not a positive remainder.
- setInterval runs forever until you clearInterval - forgetting this leaks timers and stacks up if the slider re-inits.

**Beneficial gaps (real/React code):**
- Preload images (or set them in an array of Image objects) to avoid a flash on first switch.
- This is the canonical React useEffect lesson: index in useState, setInterval created in useEffect, and you MUST return () => clearInterval(id) as cleanup or you get duplicate timers on re-render. Watch for this exact pattern in React code.

**JS vs Java:** JS % follows the sign of the dividend (same as Java, actually) - so a decrementing index can go negative and break array access. Java devs sometimes assume Python-style always-positive modulo; JS does not do that.

**Variation to build:** Build a testimonial/quote carousel: next/prev buttons cycle an array of quote+author objects, with auto-advance every few seconds. Different domain (marketing content) but identical index-wrap + setInterval.

---

## #70 Callback Hell?  `[10:34:03]`

**Concept:** When async operations depend on each other, nesting their callbacks (e.g. setTimeout inside setTimeout) creates a deeply indented 'pyramid of doom' that's hard to read and maintain. This section motivates Promises/async-await.

**Bro glosses / gets wrong:**
- Callback hell is a real maintainability problem, not just ugly indentation: error handling has to be repeated and threaded through every nested level.
- Bro likely demos it only with nested setTimeout - the same shape appears with any real async work (file/network callbacks).

**Beneficial gaps (real/React code):**
- The fixes he's leading toward: Promises flatten nesting into a .then() chain; async/await makes async code read top-to-bottom like synchronous code with try/catch for errors.
- This is THE bridge to React data fetching - fetch() returns a Promise, and you'll consume it with async/await inside effects. Callbacks are still fine for simple event handlers; the problem is only chained dependent async.

**JS vs Java:** JS is single-threaded with an event loop - callbacks are deferred continuations, NOT threads. The Java mental model is Future/CompletableFuture; a JS Promise is the analog, and async/await is roughly its structured-code form.

**Variation to build:** Model a checkout pipeline with artificial delays: validateCart -> processPayment -> sendConfirmationEmail, first as nested callbacks (feel the pain), then rewritten with async/await. Different domain (e-commerce flow) but the same nesting-to-flatten lesson.

---

## #71 Promises  `[10:39:50]`

**Concept:** A Promise is an object standing in for a value that isn't ready yet. Three states: pending -> fulfilled (resolve) or rejected (reject). Built with new Promise((resolve,reject)=>{...}); consumed with .then/.catch/.finally. Exists to flatten callback hell into composable chains.

**Bro glosses / gets wrong:**
- The executor runs EAGERLY the moment you call new Promise(...), not when you attach .then. The promise is already running before anyone listens.
- Each .then returns a NEW promise, which is what makes chaining work; whatever you return inside a .then becomes the next .then's input.
- A promise settles once and is then immutable: a second resolve() or reject() is silently ignored.
- reject(new Error('msg')) not reject('msg') -- an Error carries a stack trace; a bare string doesn't.
- A throw inside a .then is caught by the next .catch downstream, same as a reject. Bro often only shows reject, not thrown errors.

**Beneficial gaps (real/React code):**
- Promise.all (fail-fast), allSettled (wait for all), race, any -- the real concurrency tools; a lone promise is rarely the pattern.
- A promise with no .catch that rejects triggers an unhandledRejection -- silent failures in the browser console.
- .then callbacks run on the microtask queue, which drains BEFORE setTimeout macrotasks. This explains surprising ordering.
- In React these states map directly to loading/data/error UI; understanding pending vs settled is the mental model for every data fetch.

**JS vs Java:** JS resolves promises on one thread via the event-loop microtask queue -- there is NO background thread like Java's CompletableFuture/Future. Concurrency is cooperative, not parallel. Also the promise is eager (already started), unlike a cold Java task you must submit.

**Variation to build:** Model an elevator dispatcher: a Promise that resolves when the car reaches your floor and rejects if the emergency-stop is pressed. Chain three calls to simulate a multi-stop ride.

---

## #72 Async/Await  `[10:52:24]`

**Concept:** Syntactic sugar over promises. Mark a function async and it always returns a promise; inside it, await pauses that function until the awaited promise settles, handing you the unwrapped value. try/catch replaces .catch, so async code reads like synchronous code.

**Bro glosses / gets wrong:**
- await does NOT block the thread. The async function suspends and control returns to the event loop; the rest of the program keeps running. It only looks sequential.
- An async function ALWAYS returns a promise, even if you `return 5`. Callers still must await it or .then it -- you can't read the raw value directly.
- Awaiting promises one line after another runs them SERIALLY. To run independent calls concurrently: `await Promise.all([a(), b()])`. Bro's line-by-line await is often needlessly slow.
- try/catch around await is how you catch a rejection; without it, an awaited rejection throws and propagates as a rejected promise.

**Beneficial gaps (real/React code):**
- await inside a for-loop is serial by design; map to an array of promises + Promise.all when order doesn't matter.
- Top-level await only works in ES modules, not classic scripts.
- React: you cannot make a useEffect callback itself async (it must return cleanup or nothing). Define an inner async function and call it, or the effect breaks.
- Errors surface as rejected promises, so one try/catch per logical concern beats one giant wrapper.

**JS vs Java:** await suspends a coroutine and frees the single thread; Java's blocking I/O parks an actual thread. Same-looking code, opposite runtime cost. And async errors are rejected promises, not `throws` on the method signature -- there's no checked-exception contract.

**Variation to build:** Rewrite a promise chain as async/await for a subway turnstile: await a fare-balance lookup, then await gate-open, wrapping insufficient-balance in try/catch.

---

## #73 JSON files  `[10:57:00]`

**Concept:** JSON is a text format for data interchange, a strict subset of JS object-literal syntax. JSON.stringify(obj) -> string (for storage/transmission); JSON.parse(str) -> object (to use it). It's the wire format for configs, localStorage, and every API.

**Bro glosses / gets wrong:**
- JSON is STRICTER than a JS object literal: keys must be double-quoted, no trailing commas, no comments, no single quotes. Valid JS object != valid JSON.
- JSON.stringify silently drops undefined, functions, and symbols, and converts Date to an ISO string that JSON.parse does NOT turn back into a Date -- you get a string.
- JSON.parse(JSON.stringify(x)) is a popular 'deep clone' but loses Dates, undefined, Map, Set, and breaks on circular refs. Use structuredClone() for a real clone.
- A raw .json file isn't executable; in the browser you fetch() it (next section). Importing JSON needs a bundler or an import assertion.

**Beneficial gaps (real/React code):**
- stringify's 3rd arg pretty-prints (e.g. JSON.stringify(x,null,2)); 2nd arg is a replacer filter.
- parse's 2nd arg is a reviver to transform values on the way in (e.g. rehydrate Dates).
- Two JSON.parse results are always new, non-identical object references -- relevant for React identity/memo checks.

**JS vs Java:** No Jackson/Gson, no POJO binding, no annotations. parse hands back an untyped plain object; there's no compile-time schema. Any shape guarantee is runtime validation you write yourself (or a TS type assertion that the compiler trusts blindly).

**Variation to build:** Serialize a chess game state (board array + move list + a Date-typed clock) to JSON, round-trip it, and observe exactly what the clock becomes after parse.

---

## #74 Fetch data from an API  `[11:07:07]`

**Concept:** fetch(url) returns a promise that resolves to a Response object. Call response.json() (itself a promise) to read the parsed body. It's the modern replacement for XMLHttpRequest and the browser's built-in HTTP client.

**Bro glosses / gets wrong:**
- THE big one Bro glosses: fetch does NOT reject on HTTP errors. A 404 or 500 still resolves successfully. You must check response.ok (or response.status) yourself -- fetch only rejects on network failure.
- response.json() is async (returns a promise) AND the body is a one-shot stream: you can only read it once. Calling .json() twice throws.
- CORS blocks are enforced by the browser, not your code -- a blocked cross-origin response isn't a bug you can fix client-side; the server must send the headers.
- GET is the default; POST needs the 2nd arg with method, headers, and a JSON.stringify'd body. Bro's demo is usually GET-only.

**Beneficial gaps (real/React code):**
- AbortController + signal to cancel a request -- essential in a React useEffect cleanup so a slow response doesn't setState after unmount.
- Wrap in async/await + try/catch AND check res.ok -- two separate failure modes (network vs HTTP status).
- Trigger fetches with addEventListener, not the onclick property Bro leans on early -- addEventListener is the real-world / React-adjacent pattern and allows multiple handlers.
- encodeURIComponent user input before dropping it into a URL. Model the loading/error/data triad from the start.

**JS vs Java:** No HttpClient object, no checked exceptions. Failures arrive as a rejected promise, and crucially HTTP error codes are NOT thrown -- you inspect response.status manually. A Java dev expects a 404 to blow up; in fetch it quietly succeeds.

**Variation to build:** Instead of Bro's Pokemon API, hit the Deck of Cards API: fetch a shuffled deck, draw a card, and render its image and value. Different domain, same fetch->.json->render loop.

---

## #75 Weather App project  `[11:21:22]`

**Concept:** Capstone tying it all together: read a city from an input, fetch OpenWeatherMap, parse the JSON, and write temperature/conditions to the DOM. Combines events + async/await + fetch + DOM manipulation into one flow.

**Bro glosses / gets wrong:**
- The API key sits in plain client-side JS, so it's PUBLIC. Fine for a learning demo, never for production -- real apps proxy the call through a backend so the key stays secret.
- On a bad city name OpenWeather returns 404, which fetch treats as success -- you MUST check response.ok and show a friendly 'city not found' instead of crashing on undefined.
- OpenWeather returns Kelvin by default; add units=metric or units=imperial or you'll render 295 degrees. Easy to miss.
- If the trigger is a form submit, you must call e.preventDefault() or the page reloads and wipes the result. Use addEventListener('submit', ...) rather than a bare button onclick.

**Beneficial gaps (real/React code):**
- Guard empty input; debounce or rate-limit rapid submits.
- AbortController to cancel a stale request when the user retypes fast.
- Separate fetch logic from render logic instead of one giant handler.
- Use textContent, not innerHTML, for API-sourced strings -- innerHTML with remote data is an XSS vector.
- This is the exact app React rebuilds declaratively: useState for city/data/error, a controlled input, an event handler or effect. The querySelector + innerHTML imperative writes here are precisely what React abstracts away.

**JS vs Java:** The whole program is event-driven and single-threaded -- there is no main() loop blocking for input. UI updates happen by mutating the DOM on the event loop when a callback fires, not from a dedicated render/UI thread as in Swing/JavaFX.

**Variation to build:** Build a USGS earthquake tracker: enter a minimum magnitude, fetch the USGS GeoJSON feed, and list recent quakes with location and magnitude. Same event->fetch->render skeleton, different domain than weather.

---
