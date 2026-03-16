// Simple 3x2 Memory Game
const cardsArray = [
  '🍎', '🍌', '🍒', '🍎', '🍌', '🍒'
];

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
    setTimeout(checkMatch, 700);
  }
}

function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matches++;
    if (matches === 3) {
      message.textContent = 'You found all pairs! 🎉';
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
