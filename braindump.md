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

A closure is a function that **remembers the variables from the scope it was
defined in, and keeps them alive even after that outer scope has returned.**

```js
function makeCounter() {
  let count = 0;             // lives in makeCounter's scope
  return function () {       // this inner fn closes over `count`
    count += 1;
    return count;
  };
}

const next = makeCounter();
next();  // 1
next();  // 2   <- `count` survived, even though makeCounter already returned
```

> Correction to my first pass: I described it as the inner function "sharing the
> scope." Sharing isn't the interesting part -- **persistence** is. Normally a
> function's locals are garbage collected when it returns. A closure keeps a live
> reference, so the variable outlives its own function call.

Two counters made this way don't share state -- each call to `makeCounter` creates
a fresh `count`. That's the basis for private state in JS without classes:
factories, module patterns, event handlers holding onto their setup data, and
React hooks all run on this.

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

> **INCOMPLETE -- to finish.** I started this one and blanked on the reasoning.

The claim I was reaching for: the data layer stays **plain vanilla JavaScript**,
not React. React handles rendering and UI state; the storage module, the merge
logic, the composite-key lookups, the filter/sort/pick pipeline -- all of that is
framework-agnostic JS with no hooks and no components in it.

TODO: write out *why* that separation pays off. (Testability without a renderer?
Portability if the UI framework changes? Same Dependency Inversion argument as
section 13, applied one layer up?) Come back and finish properly.
