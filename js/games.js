document.getElementById('game-select').addEventListener('change', function(e) {
  showGame(e.target.value);
});
// Game selector logic for Gaming page
document.getElementById('game-select').addEventListener('change', function(e) {
  showGame(e.target.value);
});

let lastGame = null;
function showGame(game) {
  const gameContainer = document.getElementById('game-container');
  // Clean up previous game listeners if needed
  if (lastGame === '2048') {
    document.removeEventListener('keydown', handle2048Key);
  }
  if (game === 'memory') {
    gameContainer.innerHTML = `
      <div class="restart-btn-container"><button class="restart-btn" id="restart-memory">Restart</button></div>
      <div class="memory-game"></div>
      <p id="memory-message"></p>
      <div id="leaderboard-container" style="margin-top:32px;">
        <h2 style="font-size:1.2em; color:#3944BC;">Leaderboard (Fewest Moves)</h2>
        <ol id="leaderboard"></ol>
      </div>
    `;
    loadMemoryGame();
    if (window.memoryLeaderboard) window.memoryLeaderboard.renderLeaderboard();
    document.getElementById('restart-memory').onclick = () => loadMemoryGame();
  } else if (game === '2048') {
    gameContainer.innerHTML = `
      <div class="restart-btn-container"><button class="restart-btn" id="restart-2048">Restart</button></div>
      <div id="game-2048"></div>
      <div id="leaderboard-2048-container" style="margin-top:32px;">
        <h2 style="font-size:1.2em; color:#3944BC;">Leaderboard (High Score)</h2>
        <ol id="leaderboard-2048"></ol>
      </div>
    `;
    if (window.init2048) window.init2048();
    if (window.leaderboard2048) window.leaderboard2048.renderLeaderboard2048();
    document.getElementById('restart-2048').onclick = () => {
      if (window.init2048) window.init2048();
    };
  }
  lastGame = game;
}

// Memory game logic with leaderboard
function loadMemoryGame() {
  const cardsArray = ['🍎', '🍌', '🍒', '🍎', '🍌', '🍒'];
  let shuffled = cardsArray
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  const gameContainer = document.querySelector('.memory-game');
  const message = document.getElementById('memory-message');
  let firstCard = null;
  let secondCard = null;
  let lock = false;
  let matches = 0;
  let moves = 0;

  function createBoard() {
    gameContainer.innerHTML = '';
    shuffled.forEach((symbol, i) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.symbol = symbol;
      card.dataset.index = i;
      card.innerHTML = '<span class="hidden">' + symbol + '</span>';
      card.addEventListener('click', flipCard);
      gameContainer.appendChild(card);
    });
    moves = 0;
    if (message) message.textContent = '';
  }

  function flipCard(e) {
    if (lock) return;
    const card = e.currentTarget;
    if (card.classList.contains('matched') || card === firstCard) return;
    card.querySelector('span').classList.remove('hidden');
    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      lock = true;
      moves++;
      setTimeout(checkMatch, 700);
    }
  }

  function checkMatch() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matches++;
      if (matches === 3) {
        message.textContent = `You found all pairs in ${moves} moves! 🎉`;
        if (window.memoryLeaderboard) {
          window.memoryLeaderboard.addScore(moves);
          window.memoryLeaderboard.renderLeaderboard();
        }
      }
    } else {
      firstCard.querySelector('span').classList.add('hidden');
      secondCard.querySelector('span').classList.add('hidden');
    }
    firstCard = null;
    secondCard = null;
    lock = false;
  }

  createBoard();
}

// Show the default game on load
showGame('memory');
