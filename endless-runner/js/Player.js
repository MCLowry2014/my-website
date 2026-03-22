export class Player {
  constructor(screenX, startY) {
    this.screenX = screenX;
    this.width = 44;
    this.height = 58;

    this.y = startY;
    this.vy = 0;

    this.gravity = 2200;
    this.jumpVelocity = -820;

    this.onGround = true;
    this.runFrame = 0;
    this.animTimer = 0;
  }

  reset(startY) {
    this.y = startY;
    this.vy = 0;
    this.onGround = true;
    this.runFrame = 0;
    this.animTimer = 0;
  }

  update(dt, groundY, input) {
    const wantsJump = input.consumeJump();

    if (this.onGround && wantsJump) {
      this.vy = this.jumpVelocity;
      this.onGround = false;
    }

    // If terrain vanished under the player (pit), they begin falling immediately.
    if (this.onGround && groundY === null) {
      this.onGround = false;
    }

    this.vy += this.gravity * dt;
    this.y += this.vy * dt;

    if (groundY !== null && this.vy >= 0 && this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.onGround = true;
    }

    // Keep feet glued to gentle slopes while grounded.
    if (this.onGround && groundY !== null && Math.abs(this.y - groundY) < 16) {
      this.y = groundY;
    }

    this.animTimer += dt;
    if (this.onGround && this.animTimer >= 0.1) {
      this.animTimer = 0;
      this.runFrame = (this.runFrame + 1) % 4;
    }
  }

  getWorldHitbox(worldX) {
    return {
      x: worldX - this.width * 0.32,
      y: this.y - this.height,
      width: this.width * 0.64,
      height: this.height
    };
  }
}
