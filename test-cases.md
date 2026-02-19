# Test Cases — Amazon Product Search

> **Testing Efficiency Note**:
The test suites are prioritized to cover **high-risk areas first** (Core search, Data extraction, Input security). This risk-based approach ensures early detection of critical faults.

## Legend

| Priority | Description |
|---|---|
| **P0** | Critical |
| **P1** | High |
| **P2** | Medium |
| **P3** | Low |

---
**Base URL** - *https://www.amazon.com*

## Manual Test Suite  
**PDP** - *Product Detail Page*

| Test Case ID | Priority | Title | Preconditions | Steps | Expected Result | Type |
|--------------|---------|-------|---------------|-------|----------------|------|
| MTC-001 | P0 | Visual presence and placement of search bar | User on homepage | Inspect the top section of the page (header) | Search bar is prominently displayed, centered or easily accessible, and visually distinguishable | UI/UX |
| MTC-002 | P1 | Search input placeholder clarity | User on homepage | Observe the search bar before typing | Search bar contains a clear instructional placeholder (e.g., "Search Amazon") | UI/UX |
| MTC-003 | P0 | Search button visual presence and contrast | User on homepage | Observe the right side of the search bar | Search button (magnifying glass icon) is clearly visible and has distinct contrast against the search bar | UI/UX |
| MTC-004 | P0 | Search submission via search button click | User on homepage | 1. Type "monitor" in search bar <br> 2. Click the search button | Search is triggered and results page loads correctly | Functional |
| MTC-005 | P0 | Keyboard accessibility - Enter key trigger | User on homepage | 1. Type "monitor" in search bar<br>2. Press 'Enter' key on keyboard | Search is triggered and results page loads (identical to clicking search button) | Functional |
| MTC-006 | P2 | Visual feedback on search input focus | User on homepage | Click inside the search input field | Visual indicator appears (e.g., border glow or color change) to show the input is active | UI/UX |
| MTC-007 | P0 | Valid keyword search returns keyword-matching results | User on homepage | 1. Enter “laptop” in search bar<br>2. Submit search | Majority of first page results contain keyword “laptop” (case-insensitive) in title | Positive |
| MTC-008 | P1 | Search query persists in URL | User on homepage | 1. Enter “monitor” in search bar<br>2. Submit search<br>3. Verify URL contains encoded query parameter (e.g., k=monitor)<br>4. Refresh the page<br>5. Verify URL still contains same query parameter | URL retains the same encoded query parameter after refresh | Positive |
| MTC-009 | P2 | Empty search query handling | User on homepage | Submit empty search | Default results page loads without system error | Negative |
| MTC-010 | P1 | Autocomplete suggestions appear | User on homepage | Type “iph”  in search bar | Suggestion dropdown containing *"iphone"* appears <br>Suggestions clickable | Positive |
| MTC-011 | P1 | Typo in search query triggers correction suggestion | User on homepage | 1. Enter search term with common typo, e.g., “iphnoe” in search bar<br>2. Submit search | Suggested corrected term displayed with clickable option to use original term *"Search instead for iphnoe"*; search results are relevant to corrected term by default | Data |
| MTC-012 | P1 | Pagination loads next result page | User has performed a product search;<br>Search results loaded & user located at page 1 | Navigate to page 2 | Page number indicator updates<br>New results rendered<br>No duplicated first-page products | Positive |
| MTC-013 | P0 | Back navigation preserves search state and scroll position | User has performed a product search;<br>Search results loaded | 1. Click a product link<br>2. Use browser Back button | User returns to the same search results page with the same results and scroll position maintained | Edge |
| MTC-014 | P1 | Page loads without broken UI elements | User has performed a product search;<br>Search results loaded | Inspect organic product cards on first 3 pages | Each product card displays:<br>- Product title<br>- Price (if present)<br>- Star rating / number of reviews (if present)<br>- Add to Cart button is visible and clickable | Data |
| MTC-015 | P0 | Product card displays formatted price | User has performed a product search;<br>Search results loaded | Inspect organic items displayed on first page | Price format matches pattern: currency symbol + numeric value (supports thousands separator & decimals) | Data |
| MTC-016 | P1 | Missing price does not break layout | User has performed a product search;<br>Search results loaded | Identify product without price | Layout remains intact | Edge |
| MTC-017 | P1 | Discounted products show original and discounted price | User has performed a product search;<br>Search results loaded | Inspect discounted item | Original price visually distinguishable (e.g., strikethrough)<br>Discounted price lower than original | Data |
| MTC-018 | P0 | Price consistency between Search and PDP | User has performed a product search;<br>Search results loaded | 1. Observe product price on search card<br>2. Open PDP<br>3. Observe PDP price | PDP price equals search card price OR difference explained by variant selection | Data |
| MTC-019 | P1 | Title consistency between Search and PDP | User has performed a product search;<br>Search results loaded | 1. Observe product title on search card<br>2. Open PDP<br>3. Observe PDP title | PDP title contains search result title without contradiction | Data |
| MTC-020 | P2 | Rating consistency between Search and PDP | User has performed a product search;<br>Search results loaded | 1. Observe rating value on search card<br>2. Open PDP<br>3. Observe PDP rating value | PDP rating equals search rating (allow minor rounding difference) | Data |
| MTC-021 | P0 | Availability consistency between Search and PDP | User has performed a product search;<br>Search results loaded | 1. Observe availability label on search card<br>2. Open PDP<br>3. Observe PDP availability | PDP availability matches PDP state | Data |

---

## Automation Test Suite  

| Test Case ID | Priority | Title | Preconditions | Steps | Expected Result | Automation |
|--------------|---------|-------|---------------|-------|----------------|-----------|
| ATC-01 | P0 | Successful keyword search | Base URL is loaded and search bar is visible | 1. Type "wireless headphones" in search bar<br>2. Click the search button | Search results page loads with listings relevant to "wireless headphones" | located in: `product-search.spec.ts` |
| ATC-02 | P1 | Search query persistence in input field | Base URL is loaded and search bar is visible | 1. Type "mechanical keyboard" in search bar<br>2. Click search | After results load, the search input still contains "mechanical keyboard" | located in: `product-search.spec.ts` |
| ATC-03 | P1 | Relevant product titles in results | Base URL is loaded and search bar is visible | 1. Search for "laptop stand" (if not already searched)<br>2. Read product titles | At least some product titles contain "laptop" or "stand" | located in: `product-search.spec.ts` |
| ATC-04 | P0 | Valid price presence in search results | Base URL is loaded and search bar is visible | 1. Search for "usb cable"<br>2. Inspect product prices | At least some results display a valid price (positive number in USD format) | located in: `product-search.spec.ts` |
| ATC-05 | P0 | Successive searches with different keywords | Initial search performed and results visible | 1. Search for "warhammer miniature"<br>2. Note the results<br>3. Search for "coffee maker" | Results change to show products relevant to "coffee maker" | located in: `product-search.spec.ts` |
| ATC-06 | P2 | Handling of empty search query | Base URL is loaded and search input is empty | 1. Click the search button without typing | Page handles query — no crash, no server error. | located in: `product-search.spec.ts` |
| ATC-07 | P2 | Handling of non-existent product search | Base URL is loaded | 1. Search for "xyzqwerty12345babuncina" | Page loads without error. May show no results message or suggestions | located in: `product-search.spec.ts` |
| ATC-08 | P1 | Security - XSS script sanitization in search | Base URL is loaded | 1. Search for `<script>alert("xss")</script>` | No script execution. Page loads normally. Input is sanitized | located in: `product-search.spec.ts` |
| ATC-09 | P2 | Handling of extremely long search queries | Base URL is loaded | 1. Search for a query of ~300 characters | Page handles query — no crash | located in: `product-search.spec.ts` |
| ATC-10 | P2 | Handling of whitespace-only search query | Base URL is loaded | 1. Type spaces only ("   ") in search<br>2. Click search | Page handles query — no crash | located in: `product-search.spec.ts` |
| ATC-11 | P1 | Presence of product titles for all results | Search results are displayed on the page | 1. Search for "bluetooth speaker"<br>2. Check all result items for a title element | Every product listing has a non-empty title | located in: `product-search.spec.ts` |
| ATC-12 | P1 | Reasonable price range validation | Search results are displayed on the page | 1. Search for "phone charger"<br>2. Extract and validate all prices | All displayed prices are positive numbers less than $100,000 | located in: `product-search.spec.ts` |
| ATC-13 | P0 | Pagination navigation to second results page | Search results are displayed with pagination available | 1. Search for "books"<br>2. Click "Next" page button | Page 2 of results loads, pagination indicator shows page 2 | located in: `product-search.spec.ts` |
| ATC-14 | P0 | Price data extraction across multiple pages | Initial search performed; results span at least 3 pages | 1. Search for "wireless headphones"<br>2. Extract prices from page 1, 2 and 3<br>3. Calculate average per page | Prices extracted from all 3 pages. Average printed per page. | located in: `price-data-processing.spec.ts` |
| ATC-15 | P1 | Unit test - Successful price extraction | Utility function `extractPrice` is available | Pass "$29.99", "$1,299.00" to `extractPrice()` | Returns 29.99 and 1299.00 respectively | located in: `price-utils.spec.ts` |
| ATC-16 | P1 | Unit test - Handling invalid price inputs | Utility function `extractPrice` is available | Pass "abc", "$", null to `extractPrice()` | Returns null for all invalid inputs | located in: `price-utils.spec.ts` |
| ATC-17 | P1 | Unit test - Average price calculation logic | Utility function `calculateAverage` is available | Pass [10, 20, 30] and [] to `calculateAverage()` | Returns 20 and null respectively | located in: `price-utils.spec.ts` |