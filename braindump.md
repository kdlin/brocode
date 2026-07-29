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
