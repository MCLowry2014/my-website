import { drawRock, drawLog, drawBush } from "./draw.js";

export class Obstacle {
  constructor({ x, y, width, height, type }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y - this.height,
      width: this.width,
      height: this.height
    };
  }

  collides(playerBox) {
    const b = this.getBounds();
    return (
      playerBox.x < b.x + b.width &&
      playerBox.x + playerBox.width > b.x &&
      playerBox.y < b.y + b.height &&
      playerBox.y + playerBox.height > b.y
    );
  }

  draw(ctx, cameraX) {
    const sx = this.x - cameraX;
    if (this.type === "rock") {
      drawRock(ctx, sx, this.y, this.width, this.height);
      return;
    }
    if (this.type === "log") {
      drawLog(ctx, sx, this.y, this.width, this.height);
      return;
    }
    drawBush(ctx, sx, this.y, this.width, "#2e7d32");
  }
}
