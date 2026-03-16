// Simple 2048 Game (4x4 grid)
// Minimal implementation for demo purposes

const SIZE = 4;
let board, score;

function init2048() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  score = 0;
  addRandomTile();
  addRandomTile();
  render2048();
  document.addEventListener('keydown', handle2048Key);
}

function addRandomTile() {
  const empty = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (board[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function render2048() {
  const container = document.getElementById('game-2048');
  if (!container) return;
  let html = `<div id="score-2048">Score: ${score}</div><div class="grid-2048">`;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const val = board[r][c];
      html += `<div class="tile-2048 t${val}">${val ? val : ''}</div>`;
    }
  }
  html += '</div>';
  container.innerHTML = html;
}

function handle2048Key(e) {
  const key = e.key;
  let moved = false;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    moved = move2048(key);
    if (moved) {
      addRandomTile();
      render2048();
      if (isGameOver()) {
        setTimeout(() => {
          alert('Game Over!');
          if (window.leaderboard2048) window.leaderboard2048.addScore2048(score);
          if (window.leaderboard2048) window.leaderboard2048.renderLeaderboard2048();
          document.removeEventListener('keydown', handle2048Key);
        }, 100);
      }
    }
    e.preventDefault();
  }
}

function move2048(dir) {
  let moved = false;
  let old = board.map(row => row.slice());
  for (let i = 0; i < SIZE; i++) {
    let line = getLine(i, dir);
    let merged = mergeLine(line);
    setLine(i, dir, merged);
  }
  moved = !old.every((row, r) => row.every((v, c) => v === board[r][c]));
  return moved;
}

function getLine(i, dir) {
  let arr = [];
  for (let j = 0; j < SIZE; j++) {
    if (dir === 'ArrowLeft') arr.push(board[i][j]);
    if (dir === 'ArrowRight') arr.push(board[i][SIZE - 1 - j]);
    if (dir === 'ArrowUp') arr.push(board[j][i]);
    if (dir === 'ArrowDown') arr.push(board[SIZE - 1 - j][i]);
  }
  return arr;
}

function setLine(i, dir, arr) {
  for (let j = 0; j < SIZE; j++) {
    if (dir === 'ArrowLeft') board[i][j] = arr[j];
    if (dir === 'ArrowRight') board[i][SIZE - 1 - j] = arr[j];
    if (dir === 'ArrowUp') board[j][i] = arr[j];
    if (dir === 'ArrowDown') board[SIZE - 1 - j][i] = arr[j];
  }
}

function mergeLine(line) {
  let arr = line.filter(x => x);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(x => x);
  while (arr.length < SIZE) arr.push(0);
  return arr;
}

function isGameOver() {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (board[r][c] === 0) return false;
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE - 1; c++) if (board[r][c] === board[r][c + 1]) return false;
  for (let c = 0; c < SIZE; c++) for (let r = 0; r < SIZE - 1; r++) if (board[r][c] === board[r + 1][c]) return false;
  return true;
}

window.init2048 = init2048;
