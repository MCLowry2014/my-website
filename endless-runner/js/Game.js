import { Player } from "./Player.js";
import { TerrainGenerator } from "./TerrainGenerator.js";
import { BackgroundLayer } from "./BackgroundLayer.js";
import { InputHandler } from "./InputHandler.js";
import {
  drawPlayer,
  drawGround,
  drawMountain,
  drawTree,
  drawCloud,
  drawBush,
  drawSky,
  drawCollectible
} from "./draw.js";

export class Game {
  constructor({ canvas, scoreEl, highScoreEl, overlayEl }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.scoreEl = scoreEl;
    this.highScoreEl = highScoreEl;
    this.overlayEl = overlayEl;

    this.input = new InputHandler();

    this.lastTime = 0;
    this.elapsedTime = 0;

    this.cameraX = 0;
    this.distance = 0;
    this.score = 0;
    this.highScore = Number(localStorage.getItem("natureRunnerHighScore") || 0);

    this.baseGroundY = this.canvas.height * 0.74;
    this.player = new Player(this.canvas.width * 0.28, this.baseGroundY);
    this.terrain = new TerrainGenerator(this.baseGroundY);

    this.layers = [
      new BackgroundLayer({
        kind: "cloud",
        speedFactor: 0.12,
        minY: 42,
        maxY: 180,
        minSize: 70,
        maxSize: 135,
        minGap: 130,
        maxGap: 240
      }),
      new BackgroundLayer({
        kind: "mountain",
        speedFactor: 0.2,
        minY: this.canvas.height * 0.58,
        maxY: this.canvas.height * 0.7,
        minSize: 140,
        maxSize: 280,
        minGap: 100,
        maxGap: 190
      }),
      new BackgroundLayer({
        kind: "tree",
        speedFactor: 0.45,
        minY: this.canvas.height * 0.64,
        maxY: this.canvas.height * 0.78,
        minSize: 56,
        maxSize: 120,
        minGap: 70,
        maxGap: 135
      }),
      new BackgroundLayer({
        kind: "bush",
        speedFactor: 0.68,
        minY: this.canvas.height * 0.72,
        maxY: this.canvas.height * 0.82,
        minSize: 28,
        maxSize: 58,
        minGap: 36,
        maxGap: 88
      })
    ];

    this.gameOver = false;

    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);
    this.onResize();

    this.reset();
  }

  reset() {
    this.gameOver = false;
    this.overlayEl.classList.add("hidden");

    this.distance = 0;
    this.score = 0;
    this.cameraX = 0;
    this.elapsedTime = 0;

    this.baseGroundY = this.canvas.height * 0.74;

    this.player.screenX = this.canvas.width * 0.28;
    this.player.reset(this.baseGroundY);

    this.terrain.reset(this.baseGroundY);

    for (const layer of this.layers) {
      layer.items = [];
      layer.nextX = 0;
    }

    this.updateHUD();
  }

  onResize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.baseGroundY = rect.height * 0.74;
    this.player.screenX = rect.width * 0.28;
  }

  getCurrentSpeed() {
    return Math.min(260 + this.distance * 0.015, 620);
  }

  getDifficulty() {
    return Math.min(1, this.distance / 5000);
  }

  getFairPitWidth(speed) {
    const airTime = (2 * Math.abs(this.player.jumpVelocity)) / this.player.gravity;
    const conservativeReach = speed * airTime * 0.72;
    return Math.max(75, Math.min(210, conservativeReach));
  }

  die() {
    this.gameOver = true;
    this.overlayEl.classList.remove("hidden");

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("natureRunnerHighScore", String(this.highScore));
    }

    this.updateHUD();
  }

  updateHUD() {
    this.scoreEl.textContent = `Score: ${this.score}`;
    this.highScoreEl.textContent = `High Score: ${this.highScore}`;
  }

  update(dt) {
    if (this.gameOver) {
      if (this.input.consumeRestart() || this.input.consumeJump()) {
        this.reset();
      }
      return;
    }

    const speed = this.getCurrentSpeed();
    const difficulty = this.getDifficulty();

    this.distance += speed * dt;
    this.cameraX = this.distance;

    const maxFairPitWidth = this.getFairPitWidth(speed);
    const viewAhead = this.cameraX + this.canvas.clientWidth * 2.1;

    this.terrain.generateUntil(viewAhead, difficulty, maxFairPitWidth);
    this.terrain.prune(this.cameraX - 300);

    // Generate each parallax layer in its own world-space scale.
    for (const layer of this.layers) {
      const layerCam = this.cameraX * layer.speedFactor;
      layer.generateUntil(layerCam + this.canvas.clientWidth * 1.8);
      layer.prune(layerCam - 200);
    }

    const playerWorldX = this.cameraX + this.player.screenX;
    const groundY = this.terrain.getGroundYAt(playerWorldX);
    this.player.update(dt, groundY, this.input);

    // Collision checks against nearby obstacles.
    const playerBox = this.player.getWorldHitbox(playerWorldX);
    const nearby = this.terrain.getVisibleObstacles(playerWorldX - 80, playerWorldX + 120);
    for (const obstacle of nearby) {
      if (obstacle.collides(playerBox)) {
        this.die();
        return;
      }
    }

    // Falling too low means player missed terrain and died.
    if (this.player.y - this.player.height > this.canvas.clientHeight + 40) {
      this.die();
      return;
    }

    this.score = Math.floor(this.distance / 12);
    this.updateHUD();
  }

  renderLayer(layer) {
    const camera = this.cameraX * layer.speedFactor;

    for (const item of layer.items) {
      const x = item.x - camera;
      if (x < -350 || x > this.canvas.clientWidth + 350) continue;

      if (layer.kind === "cloud") {
        drawCloud(this.ctx, x, item.y, item.size, "rgba(255,255,255,0.88)");
      } else if (layer.kind === "mountain") {
        drawMountain(this.ctx, x, item.y, item.size, item.size * 0.7, "#7d9ab8");
      } else if (layer.kind === "tree") {
        drawTree(this.ctx, x, item.y, item.size, "#1e5c37");
      } else if (layer.kind === "bush") {
        drawBush(this.ctx, x, item.y, item.size, "#2e7d32");
      }
    }
  }

  render() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    drawSky(this.ctx, width, height);

    // Back-to-front parallax drawing order.
    this.renderLayer(this.layers[0]);
    this.renderLayer(this.layers[1]);
    this.renderLayer(this.layers[2]);

    const segments = this.terrain.getVisibleSegments(this.cameraX - 40, this.cameraX + width + 80);
    for (const segment of segments) {
      if (segment.type === "ground") {
        drawGround(
          this.ctx,
          {
            x: segment.x - this.cameraX,
            y: segment.y,
            width: segment.width,
            seed: segment.seed
          },
          height,
          this.elapsedTime
        );
      }
    }

    // Foreground bushes pass.
    this.renderLayer(this.layers[3]);

    const obstacles = this.terrain.getVisibleObstacles(this.cameraX - 50, this.cameraX + width + 50);
    for (const obstacle of obstacles) {
      obstacle.draw(this.ctx, this.cameraX);
    }

    // Small optional collectible-like glow, purely decorative.
    const pulse = 0.5 + Math.sin(this.elapsedTime * 4.2) * 0.5;
    drawCollectible(this.ctx, width - 90, 80, 8, pulse);

    drawPlayer(this.ctx, this.player, this.elapsedTime);
  }

  frame = (time) => {
    if (!this.lastTime) this.lastTime = time;
    const dt = Math.min((time - this.lastTime) / 1000, 0.033);
    this.lastTime = time;

    this.elapsedTime += dt;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.frame);
  };

  start() {
    requestAnimationFrame(this.frame);
  }
}
