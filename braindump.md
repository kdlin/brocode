# Braindump

Feynman-technique notes. Each section is me explaining a concept back in my own
words, with corrections folded in where I got it wrong.

---

## 1. Stored vs derived data (seed data + upsert merge)

In the dashboard's data model, not every value lives in the same place. Two
categories:

**Stored / static (seed data)**
- Hardcoded in the source: goal name, goal target, goal description.
- These effectively never change.
- Exactly one live copy at a time.
- An admin can override them through a modal, which performs an **upsert**: the
  admin's edits get written to localStorage and then **merged over** the seed
  data at read time. Seed is the base layer; the override is a patch on top.

**Derived**
- Anything computed from other data rather than authored directly.
- Example: a goal's current status is not stored as one field. It's derived by
  walking the status history and pulling the most recent entry.

The mental split: *seed data is what the thing IS, derived data is what the thing
CURRENTLY LOOKS LIKE given everything that's happened to it.*

---

## 2. History log vs overwrite (the composite key)

Users update the status of a metric goal over time. The naive design overwrites a
single `status` field. That destroys the past. Instead, every update writes into a
**status history**.

Shape of an entry:

```js
{
  reportingMonth: "2026-03",
  status: "At Risk"   // | "Significant Risk" | "On Track"
}
```

Keyed by a **composite key**: the goal ID and the reporting month joined by a
`~` delimiter so it can be split back apart later.

```
"1~2026-03"
"1.1~2026-03"
"1.2~2026-04"
```

The invariant: **one entry per (goal, month) pair.** A new update for goal `1.1`
in `2026-03` overwrites *only* that key. Every other month is untouched.

The bank-account analogy:
- Overwrite model = your account balance. One number, the running total, no past.
- History model = your transaction ledger. Every event preserved, and the balance
  is *derived* from it.

The history model buys us **snapshots**: pick any reporting month and ask "what
did this goal look like as of then?"

---

## 3. Resolving the latest status (filter, sort, take index 0)

Given the flat history, getting "the current status of goal X" is a three-step
pipeline:

1. **Filter** to entries belonging to that goal (and at or before the target
   month, if resolving a snapshot).
2. **Sort** by reporting month, descending.
3. **Take index `[0]`** -- the most recent surviving entry.

```js
function getLatestStatus(history, goalId) {
  return history
    .filter(entry => entry.goalId === goalId)
    .sort((a, b) => b.reportingMonth.localeCompare(a.reportingMonth))[0];
}
```

Because it's filter -> sort -> pick, the same function answers both "what is it
now" and "what was it in March" -- the only difference is one extra clause in the
filter. That's the payoff for storing history instead of a single value.

---

## 4. What happens to TypeScript types at runtime

TypeScript types exist **only at compile time**. `tsc` type-checks, then **erases**
the types and emits plain JavaScript. Nothing about the types survives into the
running program.

The rocket analogy: the type system is the booster stage. It does its job on the
way up, then falls away. What reaches orbit is just JavaScript.

Runtime consequences:
- Types are **not** runtime guards. A type error does not stop your app.
- By default `tsc` still **emits JS even when it reports type errors** -- you can
  ship a program the compiler complained about. (`noEmitOnError: true` changes
  this.)
- So type safety is only as real as your process. Teams enforce it in **CI**:
  typecheck must pass green before merge.
- Anything that must be enforced at runtime (API responses, user input, parsed
  JSON) needs an actual runtime validation step. The type annotation is a promise,
  not a check.

---

## 5. `===` vs `==`

`===` is **strict equality**: compares type *and* value, no conversion.
`==` is **loose equality**: coerces the operands to a common type first, then
compares. That coercion produces results that look absurd out of context:

```js
0 == ""         // true   (both coerce to 0)
0 == "0"        // true
0 == false      // true
null == undefined  // true
"" === 0        // false  <- strict says no
```

Rule: **always use `===`.** The one idiomatic exception is `x == null`, which is a
deliberate shorthand for "x is null OR undefined."

---

## 6. `?.` -- optional chaining

Guards against reading a property or calling a method on something that isn't
there.

```js
user?.profile?.name
user.getName?.()
list?.[0]
```

How it works: if the value on the **left** is `null` **or** `undefined`, the whole
expression **short-circuits and evaluates to `undefined`** instead of throwing
`Cannot read properties of undefined`.

> Correction to my first pass: I said it checks for `undefined`. It checks for
> **both `null` and `undefined`** -- same set as `??` and `== null`.

Use it where the value genuinely might be absent (optional API fields, a lookup
that can miss, a DOM query). Do **not** sprinkle it everywhere -- if a value should
always exist, `?.` hides the bug instead of surfacing it.

---

## 7. `??` -- nullish coalescing (and why it isn't `||`)

`a ?? b` returns `b` **only when `a` is `null` or `undefined`.**
`a || b` returns `b` whenever `a` is **falsy** -- which includes `0`, `""`, `NaN`,
and `false`.

```js
const count = 0;
count ?? 10   // 0   <- 0 is a real value, keep it
count || 10   // 10  <- bug: a legitimate zero got replaced

const label = "";
label ?? "N/A"  // ""
label || "N/A"  // "N/A"
```

This matters constantly in a metrics dashboard: `0` progress, an empty note, and
`false` for a boolean flag are all **valid data**. `||` silently eats them.

Rule of thumb: reach for `??` when supplying a default for something numeric,
string-y, or boolean. `||` is only correct when "empty" and "missing" genuinely
mean the same thing.

---

## 8. `?:` -- the optional property marker (TypeScript)

Different thing entirely from `?.` and `??` -- this one is **type syntax**, not a
runtime operator.

```ts
interface Goal {
  id: string;
  description?: string;   // string | undefined
}
```

`description?: string` means the property may be **absent or `undefined`**. It is
a signal to every consumer: *narrow this before you use it.*

```ts
goal.description.trim()        // TS error: possibly undefined
goal.description?.trim()       // fine
(goal.description ?? "").trim()  // fine, with a default
```

Note the pairing: `?:` is the **declaration** that a value might be missing; `?.`
and `??` are the **runtime tools** for handling that. The type tells you the
hazard exists; it does nothing to protect you at runtime (see section 4).

---

## 9. Closures

**One-line definition:** a closure is a function bundled together with the
variables from the scope it was *defined* in -- and it keeps a **live reference**
to those variables, so they stay alive even after that outer function has
returned.

The load-bearing word is **reference**. The closure does not copy the value at the
moment it's created. It holds onto the variable itself. Everything surprising
about closures falls out of that one fact.

### The baseline

```js
function makeCounter() {
  let count = 0;             // normally dies when makeCounter returns
  return function () {       // ...but this fn closes over `count`
    count += 1;
    return count;
  };
}

const next = makeCounter();
next();  // 1
next();  // 2   <- `count` survived; makeCounter finished running long ago
```

`makeCounter` returned on line `const next = ...`. Its stack frame is gone. But
`count` isn't garbage collected, because the returned function still points at it.

### Each call makes a fresh, independent variable

```js
const a = makeCounter();
const b = makeCounter();
a(); a(); a();  // 3
b();            // 1   <- b has its own `count`, not a's
```

Every invocation of `makeCounter` creates a new binding. Closures over *different*
calls are isolated.

### But closures over the SAME call share one variable

```js
function makeAccount(balance) {
  return {
    deposit: amount => { balance += amount; },
    getBalance: () => balance,          // reads the same `balance`
  };
}

const acct = makeAccount(100);
acct.deposit(50);
acct.getBalance();   // 150
```

Two separate functions, one shared `balance`. `getBalance` sees `deposit`'s write
because both hold a reference to the same variable -- not to a copy of `100`.

Note what this gives you: `balance` is genuinely **private**. There is no
`acct.balance`. The only way to touch it is through the two functions that closed
over it. That's encapsulation with no `class` and no `#private` field.

### The classic bug (live reference, proven)

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3   <- NOT 0, 1, 2
```

`var` is function-scoped, so all three callbacks closed over **the same single
`i`**. By the time the timeouts fire, the loop has finished and that one `i` holds
`3`. If closures captured values, this would print `0, 1, 2`. It doesn't -- proof
that the capture is by reference.

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2
```

`let` is block-scoped: the loop creates a **new `i` binding per iteration**, so
each callback closes over its own. Same code, different scoping rule, opposite
result.

### Where this shows up in real work

- **Factories / the module pattern** -- private state, as in `makeAccount` above.
- **Event handlers** -- a click handler created inside a setup function still has
  the config, the element, and the id it was built with, long after setup returned.
- **React hooks** -- `useState` works because the setter closes over which slot in
  the component's state it owns. The infamous "stale closure" bug is a handler that
  captured an old render's variable and never saw the newer one.
- **Callbacks generally** -- any function you pass somewhere to be run later drags
  its defining scope along with it.

> Correction to my first pass: I described it as the inner function "sharing the
> scope." Sharing isn't the interesting part -- **persistence by reference** is.
> Normally a function's locals are collected when it returns; a closure keeps a
> live pointer, so the variable outlives its own call, and every closure over that
> same call sees the same value.

---

## 10. Why JS leans on plain objects where Java leans on classes

In Java, a class is **mandatory** -- there is no top-level function, every piece of
code lives inside a class, so classes are the unit of everything.

In JavaScript, functions and object literals are first-class. You can build most
things out of plain objects and functions composed together, which is lighter than
declaring a type hierarchy for it.

> Correction to my first pass: JS **does** have classes -- the `class` keyword has
> existed since ES6. They're syntactic sugar over the prototype system. The real
> difference isn't that JS lacks classes, it's that JS doesn't **require** them.

```js
// JS: this is a complete, legitimate "model"
const goal = { id: "1.1", name: "Reduce latency", target: 200 };
const isAtRisk = g => g.current > g.target;
```

Classes still earn their place in JS when you need many instances with shared
behavior and their own state (a `Chart`, a `Connection`). For data shapes and
pure transformations, an object plus a function is usually clearer.

---

## 11. Higher-order functions: `map`, `filter`, `reduce`

All three take a callback, and **none of them mutate the original array** -- they
each return a new one. That's the shared contract.

**`.map`** -- transform. Same length in, same length out. Only the contents change.

```js
[1, 2, 3].map(n => n * 2);        // [2, 4, 6]
goals.map(g => g.name);           // 3 goals in, 3 names out
```

**`.filter`** -- select. Runs a predicate per item; keeps it if the predicate is
truthy, drops it otherwise. Length can only shrink or stay equal. Contents
unchanged.

```js
goals.filter(g => g.status === "At Risk");
```

**`.reduce`** -- collapse. Start with an accumulator, visit every item, fold it in,
end with **exactly one value**. That value doesn't have to be a number -- it can be
an object, array, string, Map, whatever.

```js
history.reduce((acc, entry) => {
  acc[`${entry.goalId}~${entry.month}`] = entry.status;
  return acc;
}, {});   // array -> lookup object keyed by composite key
```

**Why not always reduce?** `reduce` can express `map` and `filter` -- it's the
general case. But general means opaque: a reader has to trace the accumulator to
learn what you're doing. `map` announces "transforming, length preserved" in one
word. `filter` announces "selecting."

So: **use the most specific tool that fits.** Chain them when it reads clearly
(`.filter(...).map(...)`), and reach for `reduce` only when the result isn't a
one-to-one transform or a subset -- i.e. when you're genuinely collapsing to a
different shape.

---

## 12. `slice` vs `splice`

> **INCOMPLETE -- to finish.** Cut off mid-explanation. Stub below is what I got
> to; the contrast (non-mutating vs mutating) still needs writing out properly.

**`.slice(start, end)`** -- non-mutating. Returns a **copy** of the section from
`start` up to but **not including** `end`. The original array is untouched.

```js
[10, 20, 30, 40, 50].slice(0, 4);  // [10, 20, 30, 40]  (indices 0,1,2,3)
```

**`.splice(...)`** -- TODO: mutating counterpart. Removes and/or inserts in place,
returns the removed elements. Write out the argument shape and a worked example.

---

## 13. The one-door storage abstraction

**The rule:** a component never talks to the backend directly. It talks to one
storage module, and that module talks to the backend.

Bad -- the fetch lives in the component:

```jsx
function GoalList() {
  useEffect(() => {
    fetch("https://api.example.com/goals")   // component now knows the backend
      .then(r => r.json())
      .then(setGoals);
  }, []);
}
```

Good -- the component makes an **abstract request**:

```ts
// storage.ts  <- the one door
export async function getGoals(): Promise<Goal[]> { ... }
export async function saveGoal(goal: Goal): Promise<void> { ... }
```

```jsx
function GoalList() {
  useEffect(() => { getGoals().then(setGoals); }, []);
}
```

The component says **"I need this data"** or **"here's this data."** It does not
know or care where the data lives. All the contextualization -- URL building,
auth headers, request shaping, response parsing, the localStorage-over-seed merge
from section 1 -- happens behind the door.

**The payoff:** swap localStorage for a REST API, or REST for Supabase, and you
edit **one file**. Zero components change, because none of them ever knew.

**The restaurant analogy:**
- Dining room = the components. Customers state what they want.
- Waiters = the storage module's exported functions. They carry requests in and
  plates out.
- Kitchen / chefs / pantry = the database and backend.

Customers never walk into the kitchen to grab food off the pan. The kitchen can be
completely rebuilt overnight and the dining room never notices, because the only
thing that ever crossed the boundary was an order and a plate.

> Correction to my first pass: I filed this under SOLID's **L**. L is **Liskov
> Substitution** (a subtype must work anywhere its parent does). What this actually
> is: **D -- Dependency Inversion.** High-level modules (components) shouldn't
> depend on low-level modules (the database); both should depend on an
> abstraction. There's a dose of **S -- Single Responsibility** in it too: the
> component renders, the storage module persists, neither does both.

---

## 14. Vanilla JS vs React for data management

The data layer stays **plain vanilla JavaScript**, not React. The storage module,
the seed/override merge, the composite-key lookups, the filter -> sort -> pick
pipeline -- all framework-agnostic JS, no hooks, no components.

**The one-line reason: React is a rendering library, and logic isn't rendering.**
Everything below follows from that.

### 1. Testability

A pure function tests with no machinery at all:

```js
expect(getLatestStatus(history, "1.1"))
  .toEqual({ month: "2026-03", status: "At Risk" });
```

The identical logic inside a hook needs a component harness, a renderer, `act()`,
and async wrappers to assert the same thing. Slower, and the test now breaks when
the UI changes shape -- even though the logic didn't.

### 2. Reusability -- the hard constraint

The Rules of Hooks are enforced, not stylistic. Logic living in a hook can **only**
be called from inside a React component. Not conditionally, not in a loop, not
inside `try/catch`, not from a Node script, a migration, or a server route.

A plain function has none of those restrictions -- callable from a hook, a CLI, a
test, a seed script, or the backend. So burying logic in a hook doesn't just add a
dependency, it **deletes call sites.**

### 3. Fewer failure modes

A pure function's entire surface is: inputs, output. Move it into a component and
it inherits render timing, dependency arrays, stale closures (section 9), effects
double-firing under StrictMode, and re-render churn. None of those are your logic
being *wrong* -- they're your logic being entangled with a lifecycle it never
needed.

### 4. Portability

The section 13 argument, one layer up. React is a dependency and frameworks churn.
If the merge logic and status resolution are plain JS, moving to Svelte or to
server components is a **UI rewrite, not a logic rewrite.**

### The dividing line

Ask: **does this concept survive if you delete the screen?**

| Belongs in React (UI state) | Belongs in vanilla JS (domain logic) |
|---|---|
| Is the modal open | Merging seed data with admin overrides |
| Which tab is active | Parsing `goal~month` composite keys |
| Is the form dirty | Resolving the latest status for a month |
| Current input value | Deciding if a goal is at risk |

Left column is meaningless without a screen. Right column is still true if the
dashboard becomes a CSV export or a nightly cron job. "What was goal 1.1's status
as of March" is a **fact about the data** -- React's only job is to put it on
screen.

---

## 15. Generics

A generic is a **type passed as an argument**. Same idea as a normal parameter,
except the thing flowing in is a type rather than a value. Written with **angle
brackets `<>`**.

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

first<string>(["a", "b"]);   // returns string | undefined
first([1, 2, 3]);            // T inferred as number
```

Without generics you'd either write one copy per type or fall back to `any` and
lose all safety. The generic lets the function stay one implementation while the
caller decides the type.

**On containers**, this is exactly the Java pattern:

```ts
const scores: Record<string, number> = { alice: 10 };   // string keys, number values
const ids: Array<string> = ["a", "b"];
const cache: Map<string, Goal> = new Map();
```

```java
// Java equivalent
HashMap<String, Integer> scores = new HashMap<>();
List<String> ids = new ArrayList<>();
```

`Record<string, number>` reads the same way `HashMap<String, Integer>` does: the
first type parameter is the key, the second is the value. Declaring the pair up
front is what lets the compiler catch `scores.alice = "ten"` before it ships.

---

## 16. Modules: import / export

Unlike Python, where importing a file gives you access to everything defined in
it, **ES modules are private by default.** A function or variable in `utils.js` is
invisible to every other file unless it's explicitly exported. Exporting is what
makes something public.

**Two ways to declare exports.** Inline, on the declaration:

```js
export function getGoals() { ... }
export const DEFAULT_STATUS = "On Track";
```

Or collected in a bracketed list at the bottom of the file:

```js
function getGoals() { ... }
const DEFAULT_STATUS = "On Track";

export { getGoals, DEFAULT_STATUS };
```

Same result. The bottom-of-file list gives you one place to see the module's whole
public surface; the inline form keeps the marker next to the thing it describes.

**Default vs named.** A module can have at most **one** default export, plus any
number of named ones -- they coexist fine.

```js
export default function StorageClient() { ... }
export function getGoals() { ... }
```

```js
import StorageClient from "./storage.js";        // default: name it whatever
import { getGoals } from "./storage.js";         // named: name must match
import StorageClient, { getGoals } from "./storage.js";  // both at once
```

The named import must match the exported name exactly (unless you rename with
`as`); the default import is just whatever you call it at the import site.

This privacy-by-default is the enforcement mechanism behind section 13. The
storage module can hold all the messy internals -- URL builders, merge helpers,
cache -- and export only `getGoals` and `saveGoal`. The narrow public surface
*is* the door.
