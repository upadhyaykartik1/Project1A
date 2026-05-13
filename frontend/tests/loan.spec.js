import { test, expect } from '@playwright/test';

test('full loan application flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Personal Loan');
  await page.click('text=Next');
  await page.fill('input[placeholder*="Full Name"]', 'John Doe');
  await page.fill('input[placeholder*="PAN"]', 'ABCDE1234F');
  await page.click('button:has-text("Verify PAN")');
  await expect(page.locator('text=verified')).toBeVisible();
  // ... continue through all steps
  await page.click('text=Submit');
  await expect(page.locator('text=Pre‑approved')).toBeVisible();
});