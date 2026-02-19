import { type Page, type Locator } from '@playwright/test';
import { PriceData, extractPrice } from '../utils/price.utils';

export class SearchResultsPage {
  readonly page: Page;
  readonly resultItems: Locator;
  readonly searchInput: Locator;
  readonly noResultsMessage: Locator;
  readonly correctedQueryText: Locator;
  readonly sortDropdown: Locator;
  readonly nextPageButton: Locator;
  readonly paginationStrip: Locator;
  readonly resultCountText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultItems = page.locator(
      '[data-component-type="s-search-result"]'
    );
    this.searchInput = page.locator('#twotabsearchtextbox');
    this.noResultsMessage = page.locator(
      '.s-no-outline, [data-component-type="s-no-results"]'
    );
    this.correctedQueryText = page.locator(
      '.a-span-last .a-color-state'
    );
    this.sortDropdown = page.locator('#s-result-sort-select');
    this.nextPageButton = page.locator(
      'a.s-pagination-next:not(.s-pagination-disabled)'
    );
    this.paginationStrip = page.locator('.s-pagination-strip');
    this.resultCountText = page.locator(
      '[data-component-type="s-result-info-bar"] .sg-col-inner span:first-of-type'
    );
  }

  async waitForResults(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');

    await this.page
      .locator('[data-component-type="s-search-result"], .s-no-outline')
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .catch(() => {
      });
  }

  async getResultCount(): Promise<number> {
    return await this.resultItems.count();
  }

  async hasResults(): Promise<boolean> {
    return (await this.getResultCount()) > 0;
  }

  async getResultTitles(): Promise<string[]> {
    const titles: string[] = [];
    const items = await this.resultItems.all();
    for (const item of items) {
      try {
        const titleEl = item.locator('h2');
        const count = await titleEl.count();
        if (count === 0) continue;
        const text = await titleEl.first().textContent({ timeout: 3_000 });
        if (text && text.trim().length > 0) {
          titles.push(text.trim());
        }
      } catch {

        continue;
      }
    }
    return titles;
  }

  async getProductPrices(): Promise<PriceData[]> {
    const prices: PriceData[] = [];
    const items = await this.resultItems.all();

    for (const item of items) {
      const priceWholeLocator = item.locator('span.a-price span.a-offscreen').first();
      const priceText = await priceWholeLocator.textContent().catch(() => null);

      if (priceText) {
        const parsed = extractPrice(priceText);
        if (parsed !== null) {
          prices.push({ raw: priceText.trim(), value: parsed });
        }
      }
    }

    return prices;
  }

  async getProductPricesBulk(): Promise<{ totalProducts: number; prices: PriceData[] }> {
    const rawData = await this.page.evaluate(() => {
      const results = document.querySelectorAll('[data-component-type="s-search-result"]');
      const priceTexts: string[] = [];
      results.forEach((result) => {
        const priceEl = result.querySelector('span.a-price span.a-offscreen');
        if (priceEl && priceEl.textContent) {
          priceTexts.push(priceEl.textContent.trim());
        }
      });
      
      return { totalProducts: results.length, priceTexts };
    });

    const prices: PriceData[] = [];
    for (const raw of rawData.priceTexts) {
      const value = extractPrice(raw);
      if (value !== null) {
        prices.push({ raw, value });
      }
    }

    return { totalProducts: rawData.totalProducts, prices };
  }

  async searchViaUrl(term: string, page: number = 1): Promise<void> {
    const url = `/s?k=${encodeURIComponent(term)}&page=${page}`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.waitForResults();
  }

  async goToPage(pageNumber: number): Promise<boolean> {
    const currentUrl = new URL(this.page.url());
    currentUrl.searchParams.set('page', String(pageNumber));
    await this.page.goto(currentUrl.toString(), { waitUntil: 'domcontentloaded' });
    await this.waitForResults();

    return await this.hasResults();
  }

  async goToNextPage(): Promise<boolean> {
    const selectors = [
      'a.s-pagination-next:not(.s-pagination-disabled)',
      '.s-pagination-next:not(.s-pagination-disabled)',
    ];

    for (const selector of selectors) {
      const btn = this.page.locator(selector).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        await this.waitForResults();
        return true;
      }
    }

    const currentUrl = new URL(this.page.url());
    const currentPage = parseInt(currentUrl.searchParams.get('page') || '1', 10);
    return await this.goToPage(currentPage + 1);
  }

  async getCurrentPageNumber(): Promise<number> {
    const selectedPage = this.page.locator(
      '.s-pagination-selected'
    );
    const text = await selectedPage.textContent().catch(() => '1');
    return parseInt(text || '1', 10);
  }

  async getSearchQueryFromInput(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  async sortBy(value: string): Promise<void> {
    await this.sortDropdown.selectOption(value);
    await this.waitForResults();
  }

  async getNthResultTitle(index: number): Promise<string | null> {
    const item = this.resultItems.nth(index);
    if (!(await item.isVisible().catch(() => false))) return null;
    const titleEl = item.locator('h2 a span, h2 span.a-text-normal');

    return await titleEl.first().textContent().catch(() => null);
  }

  async getNthResultPrice(index: number): Promise<string | null> {
    const item = this.resultItems.nth(index);
    if (!(await item.isVisible().catch(() => false))) return null;
    const priceEl = item.locator('span.a-price span.a-offscreen').first();

    return await priceEl.textContent().catch(() => null);
  }

  async isSponsored(index: number): Promise<boolean> {
    const item = this.resultItems.nth(index);
    const sponsored = item.locator(
      '.puis-label-popover, .s-label-popover-default'
    );

    return await sponsored.isVisible().catch(() => false);
  }
}