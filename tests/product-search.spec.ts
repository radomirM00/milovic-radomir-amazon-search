import { test, expect } from '../utils/test.fixtures';

test.describe('Product Search - Core Functionality', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('should display search results for a valid query', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search('wireless headphones');
    await searchResultsPage.waitForResults();

    const resultCount = await searchResultsPage.getResultCount();
    expect(resultCount).toBeGreaterThan(0);
  });

  test('should preserve search term in the input after search', async ({
    homePage,
    searchResultsPage,
  }) => {
    const searchTerm = 'mechanical keyboard';
    await homePage.search(searchTerm);
    await searchResultsPage.waitForResults();

    const inputValue = await searchResultsPage.getSearchQueryFromInput();
    expect(inputValue).toBe(searchTerm);
  });

  test('should display relevant product titles in results', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search('laptop stand');
    await searchResultsPage.waitForResults();

    const titles = await searchResultsPage.getResultTitles();
    expect(titles.length).toBeGreaterThan(0);

    const relevantTitles = titles.filter(
      (title) =>
        title.toLowerCase().includes('laptop') ||
        title.toLowerCase().includes('stand')
    );
    expect(relevantTitles.length).toBeGreaterThan(0);
  });

  test('should display prices for at least some products', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search('usb cable');
    await searchResultsPage.waitForResults();

    const prices = await searchResultsPage.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);

    for (const price of prices) {
      expect(price.value).toBeGreaterThan(0);
    }
  });

  test('should update results when performing a new search', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search('warhammer miniature');
    await searchResultsPage.waitForResults();
    const firstTitles = await searchResultsPage.getResultTitles();

    await homePage.search('coffee maker');
    await searchResultsPage.waitForResults();
    const secondTitles = await searchResultsPage.getResultTitles();

    expect(secondTitles).not.toEqual(firstTitles);
  });
});

test.describe('Product Search - Edge Cases & Negative Scenarios', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('should handle empty search', async ({
    homePage,
    page,
  }) => {

    await homePage.clearSearchInput();
    await homePage.searchButton.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(homePage.searchInput).toBeVisible();
  });

  test('should handle gibberish search term', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search('xyzqwerty12345babuncina');
    await searchResultsPage.waitForResults();

    const hasResults = await searchResultsPage.hasResults();
    if (!hasResults) {

      const bodyText = await searchResultsPage.page
        .locator('body')
        .textContent();
      expect(bodyText).toBeTruthy();
    }
  });

  test('should handle special characters in search', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search('<script>alert("xss")</script>');
    await searchResultsPage.waitForResults();

    await expect(searchResultsPage.searchInput).toBeVisible();
  });

  test('should handle very long search query', async ({
    homePage,
    searchResultsPage,
  }) => {
    const longQuery = 'wireless bluetooth headphones '.repeat(10).trim();
    await homePage.search(longQuery);
    await searchResultsPage.waitForResults();

    await expect(searchResultsPage.searchInput).toBeVisible();
  });

  test('should handle search with only whitespace', async ({
    homePage,
    page,
  }) => {
    await homePage.search('   ');
    await page.waitForLoadState('domcontentloaded');

    await expect(homePage.searchInput).toBeVisible();
  });
});

test.describe('Search Results Page - Data Consistency', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('each result item should have a title', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search('bluetooth speaker');
    await searchResultsPage.waitForResults();

    const titles = await searchResultsPage.getResultTitles();
    const resultCount = await searchResultsPage.getResultCount();

    expect(titles.length).toBeGreaterThan(0);
    for (const title of titles) {
      expect(title.trim().length).toBeGreaterThan(0);
    }
  });

  test('prices should be valid positive numbers', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search('phone charger');
    await searchResultsPage.waitForResults();

    const prices = await searchResultsPage.getProductPrices();

    for (const price of prices) {
      expect(price.value).toBeGreaterThan(0);
      expect(price.value).toBeLessThan(100_000);
      expect(price.raw).toBeTruthy();
    }
  });

  test('should support pagination to the next page', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search('books');
    await searchResultsPage.waitForResults();

    const navigated = await searchResultsPage.goToNextPage();
    if (navigated) {
      const currentPage = await searchResultsPage.getCurrentPageNumber();
      expect(currentPage).toBe(2);
    }
  });
});