import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, Direction, placeFood, setDirection, tick } from './snake.js';

test('snake moves one cell per tick in current direction', () => {
  const initial = createInitialState(10);
  const next = tick(initial, () => 0);
  assert.equal(next.snake[0].x, initial.snake[0].x + 1);
  assert.equal(next.snake[0].y, initial.snake[0].y);
  assert.equal(next.score, 0);
});

test('snake grows and score increments when food is eaten', () => {
  const initial = createInitialState(10);
  const foodAhead = { x: initial.snake[0].x + 1, y: initial.snake[0].y };
  const withFood = { ...initial, food: foodAhead };
  const next = tick(withFood, () => 0);

  assert.equal(next.score, 1);
  assert.equal(next.snake.length, withFood.snake.length + 1);
});

test('wall collision sets game over', () => {
  const state = {
    ...createInitialState(4),
    snake: [{ x: 3, y: 0 }, { x: 2, y: 0 }],
    direction: Direction.Right,
    pendingDirection: Direction.Right,
    food: { x: 0, y: 0 },
  };

  const next = tick(state, () => 0);
  assert.equal(next.gameOver, true);
});

test('self collision sets game over', () => {
  const state = {
    ...createInitialState(6),
    snake: [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
    ],
    direction: Direction.Left,
    pendingDirection: Direction.Down,
    food: { x: 5, y: 5 },
  };

  const next = tick(state, () => 0);
  assert.equal(next.gameOver, true);
});

test('reverse direction while length > 1 is ignored', () => {
  const state = createInitialState(10);
  const next = setDirection(state, Direction.Left);
  assert.equal(next.pendingDirection, Direction.Right);
});

test('food placement avoids snake cells', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];

  const food = placeFood(snake, 3, () => 0);
  assert.deepEqual(food, { x: 0, y: 1 });
});
