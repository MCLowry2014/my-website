import { Obstacle } from "./Obstacle.js";
import { clamp, chance, randInt, randRange } from "./utils.js";

export class TerrainGenerator {
  constructor(baseGroundY) {
    this.baseGroundY = baseGroundY;
    this.currentY = baseGroundY;
    this.nextX = -200;

    this.segments = [];
    this.obstacles = [];

    this.seed = Math.random() * 1000;
  }

  reset(baseGroundY) {
    this.baseGroundY = baseGroundY;
    this.currentY = baseGroundY;
    this.nextX = -200;
    this.segments = [];
    this.obstacles = [];
  }

  generateUntil(targetX, difficulty, maxFairPitWidth) {
    while (this.nextX < targetX) {
      const groundWidth = randRange(180, 320 - difficulty * 70);
      const yDelta = randRange(-18 - difficulty * 8, 18 + difficulty * 8);
      this.currentY = clamp(this.currentY + yDelta, this.baseGroundY - 90, this.baseGroundY + 70);

      const groundSegment = {
        type: "ground",
        x: this.nextX,
        width: groundWidth,
        y: this.currentY,
        seed: this.seed + this.nextX * 0.015
      };
      this.segments.push(groundSegment);

      this.addObstaclesForSegment(groundSegment, difficulty);

      this.nextX += groundWidth;

      const pitProbability = 0.08 + difficulty * 0.24;
      if (chance(pitProbability)) {
        const rawPitWidth = randRange(70, 120 + difficulty * 110);
        const pitWidth = Math.min(rawPitWidth, maxFairPitWidth);

        this.segments.push({
          type: "pit",
          x: this.nextX,
          width: pitWidth,
          y: null,
          seed: this.seed + this.nextX * 0.009
        });

        this.nextX += pitWidth;

        // Guarantee some safe landing platform after each pit.
        const landingWidth = randRange(180, 280);
        this.currentY = clamp(
          this.currentY + randRange(-12, 12),
          this.baseGroundY - 70,
          this.baseGroundY + 60
        );

        const landingSegment = {
          type: "ground",
          x: this.nextX,
          width: landingWidth,
          y: this.currentY,
          seed: this.seed + this.nextX * 0.02
        };
        this.segments.push(landingSegment);
        this.addObstaclesForSegment(landingSegment, difficulty * 0.85);
        this.nextX += landingWidth;
      }
    }
  }

  addObstaclesForSegment(segment, difficulty) {
    if (segment.type !== "ground") return;

    const density = 0.22 + difficulty * 0.32;
    if (!chance(density)) return;

    const maxCount = difficulty > 0.65 ? 2 : 1;
    const count = randInt(1, maxCount);

    for (let i = 0; i < count; i++) {
      const margin = 55;
      if (segment.width < margin * 2 + 30) continue;

      const x = randRange(segment.x + margin, segment.x + segment.width - margin);
      const pick = Math.random();

      let type = "rock";
      let width = 34;
      let height = 28;

      if (pick > 0.35 && pick <= 0.7) {
        type = "log";
        width = 54;
        height = 22;
      } else if (pick > 0.7) {
        type = "bush";
        width = 44;
        height = 28;
      }

      this.obstacles.push(
        new Obstacle({
          x,
          y: segment.y,
          width,
          height,
          type
        })
      );
    }
  }

  getGroundYAt(worldX) {
    const segment = this.segments.find(
      (s) => worldX >= s.x && worldX < s.x + s.width
    );

    if (!segment || segment.type === "pit") return null;
    return segment.y;
  }

  getVisibleSegments(startX, endX) {
    return this.segments.filter((s) => s.x + s.width > startX && s.x < endX);
  }

  getVisibleObstacles(startX, endX) {
    return this.obstacles.filter((o) => o.x + o.width > startX && o.x < endX);
  }

  prune(beforeX) {
    this.segments = this.segments.filter((s) => s.x + s.width >= beforeX);
    this.obstacles = this.obstacles.filter((o) => o.x + o.width >= beforeX);
  }
}
