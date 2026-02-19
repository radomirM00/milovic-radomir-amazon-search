# Test Plan — Amazon Product Search

## 1. Scope

This test plan covers the **Product Search** functionality on [amazon.com](https://www.amazon.com), aligned with the assignment requirements.

### In Scope
- **Search input and submission** — entering queries, triggering search, and input sanitization.
- **Search results page** — displaying results, product data relevance, and pagination.
- **Product data consistency** — titles, prices, formatting integrity across multiple pages.
- **Technical data processing** — automated extraction and averaging of price data.

### Out of Scope / Trade-offs

| Area | Reason / Justification |
|---|---|
| Login & Checkout | Requires user authentication and personal data; unrelated to core search objectives. |
| Account Management | Session-dependent flows that expand scope significantly without contributing to search goals. |
| Search Ranking Logic | Amazon’s algorithms are proprietary and dynamic; presence is to be validated, not "correctness" of rank. |
| Mobile Responsiveness | Explicitly limited to Desktop Chrome (1280×720) for focus and time efficiency. |
| Performance / Load Testing | Live production testing carries operational/legal risks; requires controlled environments. |
| Sponsored Content Logic | Non-deterministic placement influenced by bidding/personalization; automated validation has low ROI. |

## 2. Assumptions

- **Accessibility**: Amazon.com is accessible and not geo-blocked during execution.
- **Stable DOM**: While Amazon uses A/B testing, the core selectors for search remain relatively stable for the en-US locale.
- **Deterministic Scenarios**: Automated tests focus on repeatable results (e.g., "wireless headphones").
- **Currency**: Prices are displayed in USD format (`$XX.XX`).
- **Data Handling**: Missing prices (e.g., "See price in cart") are handled and excluded from average calculations.

## 3. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **A/B Testing & Dynamic UI** | High | High | Use resilient selectors (POM architecture); implement retries on failure. |
| **Bot Detection / CAPTCHA** | Medium | High | Use realistic viewports/user-agents; maintain reasonable delays between navigations. |
| **Flaky Network** | Medium | Medium | Configure timeouts and automatic retries. |
| **DOM Structure Changes** | High | High | Abstract locators into Page Object Model for single-point maintenance. |
| **Dynamic Pricing** | Medium | Low | Handle missing/malformed data in helper functions to prevent test crashes. |

## 4. Test Strategy

### 4.1 Manual Testing (Usability & UX)
- **Visual Smoke Tests**: Verification of search bar placement, button contrast, and placeholder clarity.
- **UX nuances**: Layout consistency, focus indicators, and keyboard accessibility (Enter key trigger).
- **Subjective judgment**: Judging the readability and clarity of results which is better handled by humans.

### 4.2 Automated Testing (Functional & Data)
- **Functional E2E**: Core search flow (Input → Submit → Results) and pagination across 3 pages.
- **Negative/Edge Cases**: Handling of empty queries, whitespace, gibberish, and XSS payload sanitization.
- **Data Integrity**: Ensuring every listing has a title and a validly formatted price.

### 4.3 Unit Testing
- **Logic Validation**: Isolated testing of utility functions to ensure correct data processing without browser dependency.

## 5. Test Environment

| Parameter | Value |
|---|---|
| **Browser** | Chromium (Desktop Chrome profile) |
| **Viewport** | 1280 × 720 |
| **Locale / Timezone** | en-US / America/New_York |
| **Framework** | Playwright + TypeScript (POM Architecture) |
| **Runner** | `@playwright/test` |

## 6. Scalability & Maintainability
- **Page Object Model (POM)**: Isolates UI changes from test logic.
- **Centralized Utilities**: Reusable logic for price parsing and mathematical calculations.
- **TypeScript**: Strict compiler enabled to ensure type safety and reduce runtime errors during data extraction.

## 7. Entry / Exit Criteria

- **Entry**: amazon.com is accessible; Test environment (Node.js, Playwright) is initialized.
- **Exit**: All automated tests pass; price extraction for 3 pages completes; manual UX observations are documented.