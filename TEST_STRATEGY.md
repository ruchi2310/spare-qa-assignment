# Product Hunt — QA Test Strategy

## Objective
Ensure the Product Hunt website and GraphQL API provide reliable, correct, and secure product discovery.

## Testing Priorities
1. **Core user journeys:** Verify homepage loading, search visibility, and product listings.
2. **API correctness:** Validate HTTP status codes, JSON structure, product IDs and names, GraphQL errors, and pagination limits.
3. **Authentication:** Verify that requests without credentials are rejected and that tokens are never committed to source control.
4. **Regression testing:** Run Playwright tests in headless mode and Bun API tests in CI.
5. **Exploratory testing:** Investigate search behavior, empty results, loading failures, responsive layouts, and accessibility.

## Approach
Use Playwright with TypeScript for browser end-to-end tests and Bun with TypeScript for GraphQL API tests. Use explicit assertions, environment variables for credentials, and avoid arbitrary fixed waits.

## Risks
The public website and API may change or experience rate limits and network delays. Distinguish external service failures from product defects. Perform only authorized, non-destructive security testing.

## Success Criteria
Priority scenarios pass consistently, API responses meet expectations, authentication failures are handled correctly, and findings include reproducible evidence and impact.
