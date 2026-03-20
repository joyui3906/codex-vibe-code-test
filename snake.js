export const GRID_SIZE = 20;

export const Direction = Object.freeze({
  Up: { x: 0, y: -1, name: 'up' },
  Down: { x: 0, y: 1, name: 'down' },
  Left: { x: -1, y: 0, name: 'left' },
  Right: { x: 1, y: 0, name: 'right' },
});

const OPPOSITES = new Map([
  [Direction.Up, Direction.Down],
  [Direction.Down, Direction.Up],
  [Direction.Left, Direction.Right],
  [Direction.Right, Direction.Left],
]);

export function createInitialState(gridSize = GRID_SIZE) {
  const center = Math.floor(gridSize / 2);
  const snake = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];

  return {
    gridSize,
    snake,
    direction: Direction.Right,
    pendingDirection: Direction.Right,
    food: placeFood(snake, gridSize),
    score: 0,
    gameOver: false,
    paused: false,
  };
}

export function setDirection(state, nextDirection) {
  if (!nextDirection || state.gameOver) return state;
  const blocked = OPPOSITES.get(state.direction) === nextDirection;
  if (blocked && state.snake.length > 1) return state;
  return { ...state, pendingDirection: nextDirection };
}

export function togglePause(state) {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}

export function tick(state, rng = Math.random) {
  if (state.gameOver || state.paused) return state;

  const direction = state.pendingDirection;
  const nextHead = {
    x: state.snake[0].x + direction.x,
    y: state.snake[0].y + direction.y,
  };

  if (isOutOfBounds(nextHead, state.gridSize)) {
    return { ...state, direction, gameOver: true };
  }

  const ateFood = nextHead.x === state.food.x && nextHead.y === state.food.y;
  const bodyToCheck = ateFood ? state.snake : state.snake.slice(0, -1);

  if (bodyToCheck.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)) {
    return { ...state, direction, gameOver: true };
  }

  const movedSnake = [nextHead, ...state.snake];
  if (!ateFood) movedSnake.pop();

  const nextFood = ateFood ? placeFood(movedSnake, state.gridSize, rng) : state.food;

  return {
    ...state,
    direction,
    snake: movedSnake,
    food: nextFood,
    score: ateFood ? state.score + 1 : state.score,
  };
}

export function placeFood(snake, gridSize, rng = Math.random) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const freeCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) freeCells.push({ x, y });
    }
  }

  if (freeCells.length === 0) return null;

  const idx = Math.floor(rng() * freeCells.length);
  return freeCells[idx];
}

function isOutOfBounds(position, gridSize) {
  return position.x < 0 || position.y < 0 || position.x >= gridSize || position.y >= gridSize;
}
