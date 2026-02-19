export interface PriceData {
  raw: string;
  value: number;
}

export interface PagePriceSummary {
  pageNumber: number;
  totalProducts: number;
  productsWithPrice: number;
  productsWithoutPrice: number;
  prices: number[];
  averagePrice: number | null;
}

export function extractPrice(raw: string): number | null {
  if (!raw || typeof raw !== 'string') return null;

  const cleaned = raw.replace(/[^\d.,]/g, '').trim();

  if (!cleaned) return null;

  let normalized: string;

  if (cleaned.includes(',') && cleaned.includes('.')) {
    normalized = cleaned.replace(/,/g, '');

  } else if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    const lastPart = parts[parts.length - 1];

    if (lastPart.length === 3 && parts.length > 1) {
      normalized = cleaned.replace(/,/g, '');

    } else if (lastPart.length === 2) {
      normalized = cleaned.replace(',', '.');
      
    } else {
      normalized = cleaned.replace(/,/g, '');
    }
  } else {
    normalized = cleaned;
  }

  const value = parseFloat(normalized);
  return isNaN(value) || value < 0 ? null : value;
}

export function calculateAverage(prices: number[]): number | null {
  if (!prices.length) return null;
  const sum = prices.reduce((acc, price) => acc + price, 0);
  return Math.round((sum / prices.length) * 100) / 100;
}

export function formatPageSummary(summary: PagePriceSummary): string {
  const lines = [
    `--- Page ${summary.pageNumber} ---`,
    `  Total products found: ${summary.totalProducts}`,
    `  Products with price: ${summary.productsWithPrice}`,
    `  Products without price: ${summary.productsWithoutPrice}`,
    `  Average price: ${summary.averagePrice !== null ? `$${summary.averagePrice.toFixed(2)}` : 'N/A (no prices found)'}`,
  ];
  return lines.join('\n');
}