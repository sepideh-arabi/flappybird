# Flappy Bird – Movement Plan

## High-level plan (3–5 bullets)

- The bird starts at **(45, 320)** and has a vertical velocity `vy` that changes over time.
- Gravity pulls the bird down every frame by **0.5 px/frame²**.
- When the player taps/clicks/presses space, apply an instant upward velocity of **-8 px/frame**.
- Cap the maximum fall speed at **+12 px/frame** to keep motion readable.
- Each frame: update velocity → update position → draw bird.

## Functions I think I'll need

- `init()` — set starting position/velocity and hook up input listeners.
- `update(dt)` — advance physics: apply gravity, apply drag/limits, update position.
- `draw(ctx)` — clear canvas and draw the bird at its current position.
- `onInput()` — when user taps/presses, set `vy = -8` (a negative “flap”).
- `clampSpeed()` — keep `vy` between **-12** and **+12** (optional helper).

## One-line step-by-step descriptions

- `init()` → set `x=45, y=320, vy=0`, set constants (`gravity=0.5`, `flapStrength=8`), add event listeners.
- `update(dt)` → `vy += gravity` → `clampSpeed()` → `y += vy` → check floor/ceiling.
- `draw(ctx)` → `clearRect()` → draw background (later) → draw bird at `(x, y)`.
- `onInput()` → set `vy = -flapStrength` (instant kick upward; here `-8`).
- `clampSpeed()` → limit `vy` to `[-12, +12]`.

## Constants (tweak later)

- `gravity = 0.5` // px/frame²
- `flapStrength = 8` // px/frame (applied as negative)
- `maxFallSpeed = 12` // px/frame
- `startX = 45`, `startY = 320`
