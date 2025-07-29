const gameBoard = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const flipElement = document.getElementById('flips');
let cards = ['🍎', '🍌', '🍇', '🍓', '🍎', '🍌', '🍇', '🍓', '🤩', '🤝', '🤩', '🤝'];
let flippedCards = [];
let matchedPairs = 0;
let flipCount = 0;
let timer = 0;
let intervalId;
const TIME_LIMIT = 60;
const flipSound = new Audio('mixkit-camera-shutter-click-1133.wav');
const matchSound = new Audio('mixkit-correct-answer-tone-2870.wav');
const mismatchSound = new Audio('mixkit-wrong-answer-fail-notification-946.wav');
const winSound = new Audio('mixkit-video-game-win-2016.wav');
const loseSound = new Audio('mixkit-wrong-answer-fail-notification-946.wav'); 
function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}
function startTimer() {
  timer = TIME_LIMIT;
  timerElement.textContent = timer;
  intervalId = setInterval(() => {
    timer--;
    timerElement.textContent = timer;
    if (timer <= 0) {
      stopTimer();
      endGame(false);
    }
  }, 1000);
}
function stopTimer() {
  clearInterval(intervalId);
}
function createBoard() {
  gameBoard.innerHTML = '';
  messageElement.textContent = '';
  scoreElement.textContent = 0;
  flipElement.textContent = 0;
  matchedPairs = 0;
  flipCount = 0;
  flippedCards = [];
  cards = shuffle(cards);
  startTimer();
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.textContent = '';
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}
function flipCard(e) {
  const card = e.target;
  if (card.classList.contains('flipped') || flippedCards.length === 2) return;
  flipSound.play(); 
  card.textContent = card.dataset.emoji;
  card.classList.add('flipped');
  flippedCards.push(card);
  flipCount++;
  flipElement.textContent = flipCount;
  if (flippedCards.length === 2) {
    checkMatch();
  }
}
function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    matchedPairs++;
    matchSound.play(); 
    scoreElement.textContent = matchedPairs;
    flippedCards = [];
    if (matchedPairs === cards.length / 2) {
      stopTimer();
      setTimeout(() => winSound.play(), 500); 
      endGame(true);
    }
  } else {
    mismatchSound.play(); 
    setTimeout(() => {
      card1.textContent = '';
      card2.textContent = '';
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 800);
  }
}
function endGame(won) {
  if (won) {
    messageElement.textContent = `🎉 Congratulations! You matched ${matchedPairs} pairs in ${TIME_LIMIT - timer} seconds using ${flipCount} flips.`;
  } else {
    loseSound.play(); 
    messageElement.textContent = `⏰ Time's up! You matched ${matchedPairs} pairs using ${flipCount} flips.`;
  }
}
function resetGame() {
  stopTimer();
  createBoard();
}
createBoard();
