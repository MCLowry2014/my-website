(function () {
  const COLS = 10;
  const ROWS = 20;
  const BLOCK = 24;

  const SHAPES = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]]
  };

  const COLORS = {
    I: "#39c1ff",
    O: "#ffd54f",
    T: "#b388ff",
    S: "#66bb6a",
    Z: "#ef5350",
    J: "#5c6bc0",
    L: "#ff9800"
  };

  let board = [];
  let current = null;
  let score = 0;
  let timerId = null;
  let canvas = null;
  let ctx = null;
  let scoreEl = null;
  let activeContainerId = "tetris-game";

  function createEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  function randomPiece() {
    const keys = Object.keys(SHAPES);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return {
      key,
      matrix: SHAPES[key].map((row) => row.slice()),
      x: Math.floor((COLS - SHAPES[key][0].length) / 2),
      y: 0
    };
  }

  function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK - 1, BLOCK - 1);
  }

  function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = board[y][x];
        if (cell) drawCell(x, y, cell);
      }
    }

    if (!current) return;
    current.matrix.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (!value) return;
        drawCell(current.x + dx, current.y + dy, COLORS[current.key]);
      });
    });
  }

  function collides(piece, offsetX, offsetY, matrix) {
    const testMatrix = matrix || piece.matrix;
    for (let y = 0; y < testMatrix.length; y++) {
      for (let x = 0; x < testMatrix[y].length; x++) {
        if (!testMatrix[y][x]) continue;
        const nx = piece.x + x + offsetX;
        const ny = piece.y + y + offsetY;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
    }
    return false;
  }

  function mergePiece() {
    current.matrix.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (!value) return;
        const x = current.x + dx;
        const y = current.y + dy;
        if (y >= 0) board[y][x] = COLORS[current.key];
      });
    });
  }

  function clearLines() {
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (board[y].every(Boolean)) {
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(0));
        cleared += 1;
        y += 1;
      }
    }
    if (cleared > 0) {
      score += cleared * 100;
      scoreEl.textContent = `Score: ${score}`;
    }
  }

  function rotateMatrix(matrix) {
    const rotated = matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());
    return rotated;
  }

  function spawnPiece() {
    current = randomPiece();
    if (collides(current, 0, 0)) {
      endGame();
    }
  }

  function tick() {
    if (!current) return;
    if (!collides(current, 0, 1)) {
      current.y += 1;
    } else {
      mergePiece();
      clearLines();
      spawnPiece();
    }
    drawBoard();
  }

  function move(dx) {
    if (!current || collides(current, dx, 0)) return;
    current.x += dx;
    drawBoard();
  }

  function softDrop() {
    if (!current) return;
    if (!collides(current, 0, 1)) {
      current.y += 1;
      drawBoard();
    } else {
      tick();
    }
  }

  function hardDrop() {
    if (!current) return;
    while (!collides(current, 0, 1)) {
      current.y += 1;
    }
    tick();
  }

  function rotate() {
    if (!current) return;
    const rotated = rotateMatrix(current.matrix);
    if (!collides(current, 0, 0, rotated)) {
      current.matrix = rotated;
      drawBoard();
    }
  }

  function onKeyDown(e) {
    if (!["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key)) return;
    e.preventDefault();
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
    if (e.key === "ArrowDown") softDrop();
    if (e.key === "ArrowUp") rotate();
    if (e.key === " ") hardDrop();
  }

  function endGame() {
    clearInterval(timerId);
    timerId = null;
    document.removeEventListener("keydown", onKeyDown);
    const status = document.getElementById(`${activeContainerId}-status`);
    if (status) status.textContent = "Game over. Press Restart to play again.";
  }

  function destroyTetris() {
    clearInterval(timerId);
    timerId = null;
    document.removeEventListener("keydown", onKeyDown);
  }

  function initTetris(containerId) {
    destroyTetris();
    activeContainerId = containerId || "tetris-game";
    const container = document.getElementById(activeContainerId);
    if (!container) return;

    container.innerHTML = `
      <div class="tetris-wrap">
        <div class="tetris-meta">
          <p id="${activeContainerId}-score" class="tetris-score">Score: 0</p>
          <p class="tetris-help">Controls: Arrow keys to move, Up to rotate, Space to drop.</p>
        </div>
        <canvas id="${activeContainerId}-canvas" class="tetris-canvas" width="${COLS * BLOCK}" height="${ROWS * BLOCK}"></canvas>
        <p id="${activeContainerId}-status" class="tetris-status" aria-live="polite"></p>
      </div>
    `;

    canvas = document.getElementById(`${activeContainerId}-canvas`);
    ctx = canvas.getContext("2d");
    scoreEl = document.getElementById(`${activeContainerId}-score`);
    score = 0;
    board = createEmptyBoard();

    spawnPiece();
    drawBoard();

    document.addEventListener("keydown", onKeyDown);
    timerId = setInterval(tick, 500);
  }

  window.initTetris = initTetris;
  window.destroyTetris = destroyTetris;
})();
