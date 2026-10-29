
import { test, expect } from '@playwright/test';

test.describe('Product Hunt Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.producthunt.com/');
  });

  test('HP-01: Homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Product Hunt/i);
  });

 test('HP-02: Search control is visible', async ({ page }) => {
  const searchControl = page.getByRole('button', {
    name: /search/i,
  });

  await expect(searchControl.first()).toBeVisible();
});

  test('HP-03: Product listings are displayed', async ({ page }) => {
    await expect(
      page.getByText('Top Products Launching Today')
    ).toBeVisible();

    await expect(
      page.getByText('Recall for Mac')
    ).toBeVisible();
  });
});
