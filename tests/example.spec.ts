
import { test, expect } from '@playwright/test';

test.describe('Product Hunt Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.producthunt.com/');
  });

 test('HP-01: Homepage loads successfully', async ({ page }) => {
  await page.goto('https://www.producthunt.com/');

  const title = await page.title();

  expect(
    title,
    `Expected Product Hunt homepage, but received title: "${title}". CI may be blocked by a browser challenge.`
  ).toMatch(/Product Hunt/i);
});

  test('HP-02: Search control is present', async ({ page }) => {
    const searchControl = page.getByRole('button', {
      name: /search/i,
    }).or(
      page.locator('input[placeholder*="search" i]')
    ).first();

    await expect(searchControl).toBeVisible();
  });

  test('HP-03: Product listings are displayed', async ({ page }) => {
  const heading = page.locator('#top-products-launching-today');

  await expect(heading).toHaveText('Top Products Launching Today');

  const productLink = page.locator('a[href="/products/voxel51"]');

  await expect(productLink).toBeVisible();
  await expect(productLink).toContainText('Voxel51 Multimodal');
});
});
