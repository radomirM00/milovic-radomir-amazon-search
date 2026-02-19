import { test, expect } from '@playwright/test';
import { extractPrice, calculateAverage } from '../utils/price.utils';

test.describe('Price Utility - extractPrice', () => {
  test('should extract standard US price format', () => {
    expect(extractPrice('$29.99')).toBe(29.99);
    expect(extractPrice('$1,299.00')).toBe(1299.0);
    expect(extractPrice('$0.99')).toBe(0.99);
  });

  test('should handle price with spaces', () => {
    expect(extractPrice('$ 29.99')).toBe(29.99);
    expect(extractPrice(' $29.99 ')).toBe(29.99);
  });

  test('should handle price without cents', () => {
    expect(extractPrice('$100')).toBe(100);
    expect(extractPrice('$1,000')).toBe(1000);
  });

  test('should handle large prices with multiple commas', () => {
    expect(extractPrice('$1,234,567.89')).toBe(1234567.89);
  });

  test('should handle European decimal format', () => {
    expect(extractPrice('€29,99')).toBe(29.99);
  });

  test('should return null for empty or invalid input', () => {
    expect(extractPrice('')).toBeNull();
    expect(extractPrice('   ')).toBeNull();
    expect(extractPrice('abc')).toBeNull();
    expect(extractPrice('$')).toBeNull();
  });

  test('should return null for null/undefined-like inputs', () => {
    expect(extractPrice(null as unknown as string)).toBeNull();
    expect(extractPrice(undefined as unknown as string)).toBeNull();
  });

  test('should return null for negative prices', () => {
    const result = extractPrice('-$29.99');

    expect(result).toBe(29.99);
  });
});

test.describe('Price Utility - calculateAverage', () => {
  test('should calculate average of prices', () => {
    expect(calculateAverage([10, 20, 30])).toBe(20);
    expect(calculateAverage([99.99, 49.99])).toBe(74.99);
  });

  test('should return null for empty array', () => {
    expect(calculateAverage([])).toBeNull();
  });

  test('should handle single price', () => {
    expect(calculateAverage([42.5])).toBe(42.5);
  });

  test('should round to two decimal places', () => {
    expect(calculateAverage([10, 10, 10, 1])).toBe(7.75);
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});