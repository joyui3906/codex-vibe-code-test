import { createInitialState, Direction, setDirection, tick, togglePause } from './snake.js';

const CELL_SIZE = 18;
const TICK_MS = 130;

const board = document.getElementById('board');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');
const controls = document.querySelector('[data-controls]');

let state = createInitialState();
let intervalId = null;

function setupBoard() {
  board.style.gridTemplateColumns = `repeat(${state.gridSize}, ${CELL_SIZE}px)`;
  board.style.gridTemplateRows = `repeat(${state.gridSize}, ${CELL_SIZE}px)`;
  board.style.width = `${state.gridSize * CELL_SIZE}px`;
  board.style.height = `${state.gridSize * CELL_SIZE}px`;
}

function render() {
  board.innerHTML = '';

  for (let y = 0; y < state.gridSize; y += 1) {
    for (let x = 0; x < state.gridSize; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      board.appendChild(cell);
    }
  }

  for (const segment of state.snake) {
    const idx = segment.y * state.gridSize + segment.x;
    board.children[idx].classList.add('snake');
  }

  if (state.food) {
    const foodIdx = state.food.y * state.gridSize + state.food.x;
    board.children[foodIdx].classList.add('food');
  }

  scoreEl.textContent = `${state.score}`;

  if (state.gameOver) {
    statusEl.textContent = 'Game over';
  } else if (state.paused) {
    statusEl.textContent = 'Paused';
  } else {
    statusEl.textContent = 'Running';
  }
}

function gameTick() {
  state = tick(state);
  render();
  if (state.gameOver && intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function restart() {
  state = createInitialState();
  setupBoard();
  render();
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(gameTick, TICK_MS);
}

function handleKey(event) {
  const keyMap = {
    ArrowUp: Direction.Up,
    ArrowDown: Direction.Down,
    ArrowLeft: Direction.Left,
    ArrowRight: Direction.Right,
    w: Direction.Up,
    W: Direction.Up,
    s: Direction.Down,
    S: Direction.Down,
    a: Direction.Left,
    A: Direction.Left,
    d: Direction.Right,
    D: Direction.Right,
  };

  if (event.key === ' ') {
    state = togglePause(state);
    render();
    return;
  }

  const direction = keyMap[event.key];
  if (!direction) return;
  event.preventDefault();
  state = setDirection(state, direction);
}

function handleControlClick(event) {
  const direction = event.target.getAttribute('data-direction');
  if (!direction) return;

  const map = {
    up: Direction.Up,
    down: Direction.Down,
    left: Direction.Left,
    right: Direction.Right,
  };

  state = setDirection(state, map[direction]);
}

restartBtn.addEventListener('click', restart);
pauseBtn.addEventListener('click', () => {
  state = togglePause(state);
  render();
});
window.addEventListener('keydown', handleKey);
controls.addEventListener('click', handleControlClick);

restart();
