# Anime Tracker - TODO

Mini DOM+events application exercise. Goal: lock in querySelector, createElement/append,
textContent, classList, event delegation, event.target, and stopPropagation from
today's Gray ch21-22 (DOM + Event Listeners). Not the real Odin capstone -- throwaway
scope, small on purpose. See [[JS-Fullstack-MOC]] node 3.5.

Branch: `projects/anime-tracker`

## Phases

- [x] Scaffold HTML shell (nav, main, add-anime form: label/input/button)
- [x] Design tokens + dark theme CSS (Material M2 dark theme, `:root` tokens)
- [ ] Add-anime: input -> `createElement` -> `.append()` onto the list
      - commit: `wire up add-anime -> createElement/append`
- [ ] Event delegation wiring, isolated -- one listener on the parent list,
      body is just `console.log(event.target)` to confirm targets before any
      real logic sits on top of it
      - commit: `verify event delegation targets correctly`
- [ ] Status-cycle logic on card click (Plan to Watch -> Watching -> Completed -> loop)
      - `classList` swap per status using `.status-watching` / `.status-completed` / `.status-plan`
      - commit: `implement status cycle on card click`
- [ ] "+1 Episode" button inside each card -- build it, click it, LET the
      propagation bug happen first (it'll also fire the card's status-cycle
      click, since nothing stops it yet). Confirm you understand why before fixing.
      - commit: `add episode counter (has propagation bug)`
- [ ] Fix: `stopPropagation()` on the episode button's click handler
      - commit: `fix: stop episode-button click from bubbling to card`
- [ ] Delete button per card, same delegated listener, `.remove()`
      - commit: `add delete via delegation`

## Stretch (optional, only if core feels too easy)

- [ ] Genre tag or star rating, click-to-set

## When done

```bash
git switch main
git merge projects/anime-tracker
git branch -d projects/anime-tracker
```
