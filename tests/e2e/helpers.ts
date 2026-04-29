import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await fetch('http://127.0.0.1:4173/test/reset', { method: 'POST' });
    await use(page);
  }
});

export { expect };

export async function setupOwner(page) {
  await page.goto('/auth/setup');
  await page.getByTestId('setup-name').fill('Owner User');
  await page.getByTestId('setup-email').fill('owner@example.com');
  await page.getByTestId('setup-password').fill('password123');
  await page.getByTestId('setup-submit').click();
  await expect(page).toHaveURL(/\/app$/);
}

export async function signIn(page) {
  await page.goto('/auth/sign-in');
  await page.getByTestId('signin-email').fill('owner@example.com');
  await page.getByTestId('signin-password').fill('password123');
  await page.getByTestId('signin-submit').click();
  await expect(page).toHaveURL(/\/app$/);
}
