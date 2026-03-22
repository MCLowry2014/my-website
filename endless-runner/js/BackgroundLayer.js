import { randRange } from "./utils.js";

export class BackgroundLayer {
  constructor({ speedFactor, minY, maxY, minSize, maxSize, minGap, maxGap, kind }) {
    this.speedFactor = speedFactor;
    this.minY = minY;
    this.maxY = maxY;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.minGap = minGap;
    this.maxGap = maxGap;
    this.kind = kind;

    this.items = [];
    this.nextX = 0;
  }

  generateUntil(targetX) {
    while (this.nextX < targetX) {
      this.items.push({
        x: this.nextX,
        y: randRange(this.minY, this.maxY),
        size: randRange(this.minSize, this.maxSize)
      });
      this.nextX += randRange(this.minGap, this.maxGap);
    }
  }

  prune(beforeX) {
    this.items = this.items.filter((item) => item.x >= beforeX);
  }
}
