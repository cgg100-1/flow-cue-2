# Flow Cue 2

A vertically scrolling yoga teaching script powered by a canonical JSON flow model.

## Structure

- `data/flow.json` — canonical flow data: sequence, Sanskrit name, English name and approved spoken cue.
- `app.js` — renders the data into reusable sequence and pose structures.
- `styles.css` — visual system and responsive layout.
- `index.html` — semantic page shell.

## Design principles

1. Content is canonical; presentation is replaceable.
2. One fact has one home.
3. Model the yoga domain, not the current screen.
4. Reuse rendering patterns instead of bespoke pose markup.
5. Keep design values centralised as CSS variables/tokens.
6. Visual hierarchy must encode meaning.
7. Prefer restraint over UI decoration.
8. Use native, semantic web behaviour first.
9. Progressive enhancement: the script remains fundamentally readable.
10. New features should survive a second-use test rather than becoming one-off exceptions.

## Visual direction

The interface takes broad inspiration from the editorial colour, typography and simple geometric organisation of Good Tuesday calendars, while remaining an original design. It is intentionally a continuous vertical reading experience rather than a card carousel or paginated reader.

Pose names act as subtle visual dividers so the current posture remains legible while the spoken cue is being read. Sequence colours are navigational accents rather than decorative themes.
