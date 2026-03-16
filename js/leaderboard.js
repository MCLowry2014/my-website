// Leaderboard logic for Memory Game (localStorage, fewest moves)
const LEADERBOARD_KEY = 'memory_leaderboard';

function getLeaderboard() {
  return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
}

function saveLeaderboard(scores) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scores));
}

function addScore(moves) {
  let scores = getLeaderboard();
  scores.push({ moves, date: new Date().toLocaleString() });
  scores = scores.sort((a, b) => a.moves - b.moves).slice(0, 5); // Keep top 5
  saveLeaderboard(scores);
}

function renderLeaderboard() {
  const scores = getLeaderboard();
  const list = document.getElementById('leaderboard');
  if (!list) return;
  list.innerHTML = '';
  if (scores.length === 0) {
    list.innerHTML = '<li>No scores yet. Play to set a record!</li>';
    return;
  }
  scores.forEach((entry, i) => {
    const li = document.createElement('li');
    li.textContent = `#${i+1}: ${entry.moves} moves (${entry.date})`;
    list.appendChild(li);
  });
}

// Export for use in games.js
window.memoryLeaderboard = { addScore, renderLeaderboard };
