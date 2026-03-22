export class InputHandler {
  constructor() {
    this.jumpQueued = false;
    this.restartQueued = false;
    this.held = new Set();

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  onKeyDown(event) {
    const code = event.code;

    if (["Space", "ArrowUp", "KeyW"].includes(code)) {
      if (!this.held.has(code)) {
        this.jumpQueued = true;
      }
      this.held.add(code);
      event.preventDefault();
    }

    if (["Enter", "KeyR"].includes(code)) {
      this.restartQueued = true;
      event.preventDefault();
    }
  }

  onKeyUp(event) {
    this.held.delete(event.code);
  }

  consumeJump() {
    const value = this.jumpQueued;
    this.jumpQueued = false;
    return value;
  }

  consumeRestart() {
    const value = this.restartQueued;
    this.restartQueued = false;
    return value;
  }
}
