# Canvas RPG Starter

A modular 2D top-down RPG starter built with HTML, CSS, and JavaScript (ES modules).

## Included Systems

- Tile-based overworld movement (WASD / Arrow keys)
- Player stats, XP curve, leveling, and ability unlocks
- Inventory with stackable items and equipment slots
- Turn-based combat (Attack, Defend, Magic, Items)
- Procedural enemies with status effects
- NPC dialogue with typing effect and branching options
- Shop buy/sell UI
- Procedural map decoration and enemy spawning
- Save/load via localStorage
- Canvas-generated art only (no external images)

## Project Structure

- index.html
- style.css
- js/main.js
- js/Game.js
- js/Player.js
- js/Inventory.js
- js/Items.js
- js/Combat.js
- js/Enemy.js
- js/Map.js
- js/Dialogue.js
- js/UI.js
- js/Art.js

## How To Run Locally

Use a local web server because the project uses ES modules.

Option 1 (recommended):
1. Open the workspace in VS Code.
2. Open rpg-game/index.html with Live Server.

Option 2 (Python):
1. In terminal, go to the repository root.
2. Run: python -m http.server 5500
3. Open: http://localhost:5500/rpg-game/

## Integrating in Main Website

The game is also integrated in the main Games page:
- Open gaming.html
- Choose "Canvas RPG" from the game selector

## Expand Ideas

- Add quest journal UI and quest chains
- Add skill trees and mana regeneration
- Add more enemy AI patterns and boss phases
- Add map regions and fast travel
- Add crafted items and recipes
