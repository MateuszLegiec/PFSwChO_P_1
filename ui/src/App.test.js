import {fibonacci} from './App';

test('Fibonacci 1', () => {
  expect(fibonacci(1)).toEqual(1);
});

test('Fibonacci 2', () => {
  expect(fibonacci(2)).toEqual(1);
});

test('Fibonacci 3', () => {
  expect(fibonacci(3)).toEqual(2);
});

test('Fibonacci 4', () => {
  expect(fibonacci(4)).toEqual(3);
});

test('Fibonacci 5', () => {
  expect(fibonacci(5)).toEqual(5);
});
