# Amazon Product Search Validation
> **End-to-End Automation & Data Integrity Suite**
---
This project demonstrates a comprehensive testing approach for the Amazon product search flow, combining **E2E functional testing**, **UI/UX manual observations**, and **unit-tested data processing logic**.

## Project Structure

```
/radomir-milovic-amazon-search
├── manual-screenshots/                     # Screenshots and evidence for bug reports
├── pages/                                  # Page Object Model (POM) classes
│   ├── home.page.ts                        # Amazon homepage elements and actions
│   └── search-results.page.ts              # Search results page elements and actions
├── tests/                                  # Playwright test specifications
│   ├── product-search.spec.ts              # Core search and UI functionality
│   ├── price-data-processing.spec.ts       # Multi-page price extraction task
│   └── price-utils.spec.ts                 # Unit tests for utility functions
├── utils/                                  # Shared helper functions and logic
│   ├── price.utils.ts                      # Logic for price parsing and averaging
│   └── test.fixtures.ts                    # Custom Playwright fixtures
├── .gitignore                              # Rules for excluding local/temp files
├── .nvmrc                                  # Node.js version configuration
├── bug-report.md                           # Documented findings and visual evidence
├── package-lock.json                       # Lockfile for consistent dependency versions
├── package.json                            # Project metadata, scripts, and dependencies
├── playwright.config.ts                    # Global Playwright configuration
├── README.md                               # Main project documentation
├── test-cases.md                           # Detailed manual and automated test scenarios
├── test-plan.md                            # QA strategy, scope, and risk management
└── tsconfig.json                           # TypeScript compiler configuration
```

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers (Chromium)
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests
npm test

# Run only core search tests
npm run test:search

# Run only the data processing / price extraction test
npm run test:prices

# Run only unit tests (price utilities)
npm run test:unit

# Run tests in headed mode
npm run test:headed

# To run single test file in headed mode
  add suffix " -- --headed" to the npm run command e.g., npm run test:search -- --headed

# Run all tests with Playwright UI mode
npm run test:ui  

# To run only one test file with Playwright UI mode
  add suffix " -- --ui" to the npm run command e.g., npm run test:search -- --ui
```

## Test Reports

After running tests, an HTML report is generated:

```bash
npm run report
```

## Architecture Decisions

- **Page Object Model (POM):** All page interactions are encapsulated in page classes (`pages/`), isolating selector changes to a single location.
- **Custom Fixtures:** Playwright fixtures (`utils/test.fixtures.ts`) inject page objects into tests, reducing boilerplate.
- **Price Utilities:** Price parsing and averaging logic is extracted into pure functions (`utils/price.utils.ts`) with dedicated unit tests.
- **No Hard-Coded Waits:** All waits use Playwright's built-in auto-waiting, `waitForLoadState`, or explicit condition-based waits.
- **Sequential Execution:** Tests run with `workers: 1` to avoid rate limiting and bot detection on Amazon.

## Assumptions

- Amazon.com is accessible and not geo-blocked.
- DOM selectors for search input, results, and prices are stable (Amazon may A/B test).
- Product prices are displayed in USD.
- Some products may not display a visible price.

## Limitations

- **Bot Detection:** Amazon may present CAPTCHAs or block automated browsers. If this occurs, try running in headed mode (`npm run test:headed`).
- **A/B Testing:** Amazon runs multiple UI variants. Selectors are based on the most common variant observed.
- **Geo-dependence:** Results and prices may vary by region. Tests assume US locale.
- **Price Ranges:** Products with variant-based pricing may show a range; only the first visible price is extracted.

## Technical Task Output

The `price-data-processing.spec.ts` test prints average prices per page to the console:

```
--- Page 1 ---
  Total products found: 48
  Products with price: 40
  Products without price: 8
  Average price: $45.67

--- Page 2 ---
  ...

=== Overall Summary ===
Search term: "wireless headphones"
Pages scraped: 3
Total products with prices: 115
Overall average price: $42.33
========================
```