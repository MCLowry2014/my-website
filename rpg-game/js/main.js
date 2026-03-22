import { Game } from "./Game.js";

const game = new Game({
  canvas: document.getElementById("game-canvas"),
  hpBar: document.getElementById("hp-bar"),
  hpText: document.getElementById("hp-text"),
  mpBar: document.getElementById("mp-bar"),
  mpText: document.getElementById("mp-text"),
  xpBar: document.getElementById("xp-bar"),
  xpText: document.getElementById("xp-text"),
  statsList: document.getElementById("stats-list"),
  minimapCanvas: document.getElementById("minimap-canvas"),
  inventoryGrid: document.getElementById("inventory-grid"),
  equipmentGrid: document.getElementById("equipment-slots"),
  questList: document.getElementById("quest-list"),
  eventLog: document.getElementById("event-log"),
  dialogueBox: document.getElementById("dialogue-box"),
  combatBox: document.getElementById("combat-box"),
  shopBox: document.getElementById("shop-box"),
  saveButton: document.getElementById("save-btn"),
  loadButton: document.getElementById("load-btn")
});

game.start();
