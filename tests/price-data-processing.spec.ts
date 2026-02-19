import { test, expect } from '../utils/test.fixtures';
import {
  calculateAverage,
  formatPageSummary,
  type PagePriceSummary,
} from '../utils/price.utils';

const SEARCH_TERM = 'wireless headphones';
const PAGES_TO_SCRAPE = 3;

test.describe('Data Processing - Price Extraction & Averaging', () => {
  test('should extract prices from first three pages and calculate averages', async ({
    searchResultsPage,
  }) => {
    test.setTimeout(120_000);

    const pageSummaries: PagePriceSummary[] = [];

    for (let pageNum = 1; pageNum <= PAGES_TO_SCRAPE; pageNum++) {
      
      await searchResultsPage.searchViaUrl(SEARCH_TERM, pageNum);

      const { totalProducts, prices } =
        await searchResultsPage.getProductPricesBulk();
      const priceValues = prices.map((p) => p.value);
      const average = calculateAverage(priceValues);

      const summary: PagePriceSummary = {
        pageNumber: pageNum,
        totalProducts,
        productsWithPrice: prices.length,
        productsWithoutPrice: totalProducts - prices.length,
        prices: priceValues,
        averagePrice: average,
      };

      pageSummaries.push(summary);

      console.log(formatPageSummary(summary));
    }

    console.log('\n=== Overall Summary ===');
    console.log(`Search term: "${SEARCH_TERM}"`);
    console.log(`Pages scraped: ${PAGES_TO_SCRAPE}`);

    const allPrices = pageSummaries.flatMap((s) => s.prices);
    const overallAverage = calculateAverage(allPrices);
    console.log(`Total products with prices: ${allPrices.length}`);
    console.log(
      `Overall average price: ${overallAverage !== null ? `$${overallAverage.toFixed(2)}` : 'N/A'}`
    );
    console.log('========================\n');

    expect(pageSummaries).toHaveLength(PAGES_TO_SCRAPE);

    for (const summary of pageSummaries) {
      expect(summary.totalProducts).toBeGreaterThan(1);
      expect(summary.productsWithPrice).toBeGreaterThan(1);
      expect(summary.averagePrice).not.toBeNull();
      expect(summary.averagePrice!).toBeGreaterThan(0);
    }
  });
});