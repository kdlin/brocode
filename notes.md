HTML
- Link stylesheet and index js file 
- open in live server preview
- HTML elements should be above the SCRIPT ( In case there are errors) 

Changing text content 
1) Select via document.getElementById or by className or Name 
2) .textContent and assign it 
3) Full -> document.selectById("myP") = "text content" ; 


### How to accept User Input

assignment 1) get the h1 and username ( myText input); 



Type Conversion
1) get pokemon hp as text then convert into Number and subtract from it 

2) Typecasting strings to Number(); 

Notes
 - NaN Not a Number 
 - Number type casting on 
 - String to Boolean is True ( as long as there is a value );  

DataType conversion for user input is quite important

Boolean for "is user input completed" 

### Const vs Let 
Assignment to typeError

Accept User Input via text box 


### Math object
- Rounding negatives actually rounds towards 0

---

### Switch Statements
- Uses strict `===` comparison, no type coercion. `case 1` will NOT match string `"1"`.

### Ternary Operators
- Chaining: every `?` needs exactly one matching `:`. Miscounting = SyntaxError (parser dies near the end of the expression, not where the mistake is).
- Convention (Prettier): `?`/`:` LEAD their own line, value shares that line, nested ternaries indent one level deeper per nesting.
- Multi-line "waterfall" chains are fine (Gray does this) — the anti-pattern is cramming a *nested* ternary onto one line, not chaining itself.

### Nullish Coalescing (`??`) vs `||`
- `??` only triggers on `null`/`undefined`.
- `||` triggers on ANY falsy value (`0`, `""`, `false`, `NaN` too) — bug risk when `0` is valid data (e.g. cart quantity).
- `prompt()` cancel → `null`. Empty OK → `""`. `??` catches null but NOT empty string — still need `.length`/`.trim()` for real validation.

### User Input (confirm/prompt/alert)
- SYNCHRONOUS — blocks the whole page until the user responds. Different from `addEventListener` (async, registers a callback, code keeps running).
- The message string is just display text. Zero effect on return value. OK → `true`/value, Cancel/Esc → `false`/`null`, always, regardless of what the message says.
- Never chain string methods directly onto a call that might return null: `prompt(...).trim()` throws if cancelled. Grab the raw result, null-check, THEN chain.

### Naming Gotchas (TDZ + redeclaration)
- `let confirm = confirm(...)` breaks — naming a `let`/`const` the same as a builtin shadows it via TDZ before the line finishes executing. Rename instead.
- `const`/`let` CANNOT be redeclared in the same scope (unlike `var`). Duplicate name = SyntaxError, kills the whole file at parse time (nothing runs, not even earlier lines).
- Calling a method without its object prefix (`indexOf("@")` instead of `email.indexOf("@")`) → ReferenceError, not a method call.

### Loops: break vs continue
- `break` exits the loop entirely.
- `continue` in a `for` loop → jumps to the increment step (still runs automatically), then rechecks condition.
- `continue` in a `while`/`do-while` → jumps STRAIGHT to the condition check, skipping everything else in the block, including a manual increment written after it. Increment placed after `continue` never runs → infinite loop risk.

### Functions: `this` binding (arrow vs regular)
- Regular/anonymous functions get their OWN `this`, decided by HOW they're called (`obj.method()` → `this` = `obj`).
- Arrow functions have no own `this` — permanently borrow `this` from the scope where they were WRITTEN, decided once at creation. Calling them differently later doesn't change it.
- Java parallel: anonymous inner class = own `this` (need `Outer.this` to escape). Java lambda = borrows enclosing `this`, same as JS arrow function.
- Risk: wrong `this` usually doesn't crash — it silently reads the wrong object and returns a plausible-looking wrong value.

### Arrays: return value vs mutation
- `push`/`unshift` → mutate (add), RETURN the new length (a number).
- `pop`/`shift` → mutate (remove), RETURN the removed element (whatever type it was).
- Trap: assuming the return value IS the array. It's not — it's a length or an element.

### Arrays: delete vs splice
- `delete arr[i]` leaves `undefined` in that slot. Does NOT shrink the array, `.length` stays the same. Avoid.
- `splice(start, count)` actually removes AND shifts everything down — array actually shrinks.

### Arrays: reverse / join / split / spread
- `reverse()` mutates in place, no new array created.
- `join(delimiter)` lives on the ARRAY, returns a STRING. `split(delimiter)` lives on the STRING, returns an ARRAY — mirror image.
- JS keeps the delimiter as the ARGUMENT for both, never the object you call on. Python's `join` breaks this pattern (delimiter IS the owner: `", ".join(list)`), inconsistent with its own `split()`. JS is internally consistent here, Python isn't.
- Spread (`...`) flattens one level: `[...a, ...b]` merges elements. Without spread, `[a, b]` is 2 nested arrays, not a merge. Matters for React state updates: `setItems(prev => [...prev, newItem])`. 