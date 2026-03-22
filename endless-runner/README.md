# Nature Runner (Canvas Endless Runner)

A classic 2D endless runner built with pure HTML, CSS, and JavaScript.
All visuals are generated in code using HTML5 canvas drawing commands.

## Project Structure

- `index.html` - Game canvas and HUD overlay
- `style.css` - Layout and HUD styles
- `js/main.js` - Entry point
- `js/Game.js` - Main game state, update loop, rendering pipeline
- `js/InputHandler.js` - Keyboard input queueing for jump and restart
- `js/Player.js` - Player physics (gravity, jump velocity, smooth movement)
- `js/TerrainGenerator.js` - Chunk-based procedural terrain and obstacle spawning
- `js/Obstacle.js` - Obstacle model and collision bounds
- `js/BackgroundLayer.js` - Parallax layer element generation
- `js/draw.js` - Reusable drawing utilities (player, terrain, trees, clouds, rocks, logs, mountains)
- `js/utils.js` - Random helpers and math utilities

## How to Run Locally

Because this project uses ES modules, run it through a local web server.

Option 1: VS Code Live Server extension
1. Open the `endless-runner` folder in VS Code.
2. Right-click `index.html` and choose "Open with Live Server".

Option 2: Python simple server
1. Open a terminal in the `endless-runner` folder.
2. Run: `python -m http.server 5500`
3. Visit: `http://localhost:5500`

## Controls

- Jump: Space, Up Arrow, or W
- Restart after death: R, Enter, or Space

## Implemented Systems

- Auto-running player
- Jumping with gravity and acceleration
- One-hit death on obstacle collision or pit fall
- Distance-based score
- High score persistence in localStorage
- Progressive difficulty:
  - Scroll speed ramps up
  - Obstacle density increases
  - Pit chance and width increase within fair-jump limits
  - Terrain slope variation increases
- Procedural terrain chunks:
  - Gentle height variation
  - Random pits
  - Random rocks/logs/bushes
- Multi-layer parallax background:
  - Clouds
  - Mountains
  - Trees
  - Foreground bushes

## Expansion Ideas

- Add collectible leaves that affect score or power meter
- Add crouch or double-jump as unlockable abilities
- Add day-night cycle and weather states
- Add mobile touch controls
