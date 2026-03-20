# Snake Game

Classic Snake implemented with vanilla HTML/CSS/JS.

## Run locally

1. Start a static server from this repo root:
   - `python3 -m http.server 4173`
2. Open: `http://localhost:4173`

## Controls

- Arrow keys or **WASD**: move
- Space: pause/resume
- Restart button: restart game
- On-screen directional buttons for touch/mobile

## Manual verification checklist

- [ ] Snake moves one grid cell per tick.
- [ ] Eating food grows the snake by 1 and increments score.
- [ ] Hitting wall or own body triggers game-over.
- [ ] Reverse direction is blocked (e.g., Right -> Left instantly).
- [ ] Pause/resume works via Space and button.
- [ ] Restart resets score/state and starts a new game.
