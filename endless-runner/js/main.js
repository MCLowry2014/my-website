import { Game } from "./Game.js";

const canvas = document.getElementById("gameCanvas");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const overlayEl = document.getElementById("overlay");

const game = new Game({
  canvas,
  scoreEl,
  highScoreEl,
  overlayEl
});

game.start();
