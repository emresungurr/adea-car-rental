import { expect, test } from 'vitest';
import { calculateTotalPrice } from './pricing';

test('calculates correct price for single day', () => {
  const price = calculateTotalPrice('2026-06-01', '2026-06-01', 100);
  expect(price).toBe(100);
});

test('calculates correct price for multiple days', () => {
  const price = calculateTotalPrice('2026-06-01', '2026-06-05', 100);
  expect(price).toBe(400);
});

test('returns 0 for invalid dates', () => {
  const price = calculateTotalPrice('2026-06-05', '2026-06-01', 100);
  expect(price).toBe(0);
});