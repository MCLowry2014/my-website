// Leaderboard logic for 2048 (localStorage, highest score)
const LEADERBOARD_2048_KEY = 'game_2048_leaderboard';

function getLeaderboard2048() {
  return JSON.parse(localStorage.getItem(LEADERBOARD_2048_KEY) || '[]');
}

function saveLeaderboard2048(scores) {
  localStorage.setItem(LEADERBOARD_2048_KEY, JSON.stringify(scores));
}

function addScore2048(score) {
  let scores = getLeaderboard2048();
  scores.push({ score, date: new Date().toLocaleString() });
  scores = scores.sort((a, b) => b.score - a.score).slice(0, 5); // Top 5
  saveLeaderboard2048(scores);
}

function renderLeaderboard2048() {
  const scores = getLeaderboard2048();
  const list = document.getElementById('leaderboard-2048');
  if (!list) return;
  list.innerHTML = '';
  if (scores.length === 0) {
    list.innerHTML = '<li>No scores yet. Play to set a record!</li>';
    return;
  }
  scores.forEach((entry, i) => {
    const li = document.createElement('li');
    li.textContent = `#${i+1}: ${entry.score} points (${entry.date})`;
    list.appendChild(li);
  });
}

window.leaderboard2048 = { addScore2048, renderLeaderboard2048 };
