
import { test, expect } from '@playwright/test';

test.describe('Product Hunt Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.producthunt.com/');
  });

  test('HP-01: Homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Product Hunt/i);
  });

test('HP-02: Search control is visible', async ({ page }) => {
  const searchControl = page.locator(
    '[data-test*="search" i], input[placeholder*="search" i], button[aria-label*="search" i]'
  ).first();

  await expect(searchControl).toBeVisible();
});

test('HP-03: Product listings are displayed', async ({ page }) => {
  const todaySection = page.locator(
    '[data-test="homepage-section-today"]'
  );

  await expect(
    todaySection.locator('[data-test="homepage-tagline"]')
  ).toHaveText('Top Products Launching Today');

  const productLinks = todaySection.locator(
    'a[href^="/products/"]'
  );

  await expect(productLinks.first()).toBeVisible();
});
});
