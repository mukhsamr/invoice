import { expect, test, setupOwner, signIn } from './helpers';

async function createCustomer(page, name: string, company = 'Demo Client', email = 'billing@demo.test') {
  await page.getByTestId('customer-name').fill(name);
  await page.getByTestId('customer-company').fill(company);
  await page.getByTestId('customer-email').fill(email);
  await page.getByTestId('customer-save').click();
  await expect(page.getByText(name)).toBeVisible();
}

async function createService(page, name: string, price: string, description = 'UI exploration and revisions') {
  await page.getByTestId('service-name').fill(name);
  await page.getByTestId('service-description').fill(description);
  await page.getByTestId('service-price').fill(price);
  await page.getByTestId('service-save').click();
  await expect(page.getByText(name)).toBeVisible();
}

test.describe('Invoice Studio full CRUD flows', () => {
  test('seed demo fails before owner setup and is idempotent after setup', async ({ page }) => {
    const beforeSetup = await page.request.post('http://127.0.0.1:4173/test/seed-demo');
    expect(beforeSetup.status()).toBe(400);

    await setupOwner(page);

    const firstSeed = await page.request.post('http://127.0.0.1:4173/test/seed-demo');
    expect(firstSeed.ok()).toBeTruthy();
    await expect(page.getByText('Welcome back, keep billing simple.')).toBeVisible();

    const secondSeed = await page.request.post('http://127.0.0.1:4173/test/seed-demo');
    expect(secondSeed.ok()).toBeTruthy();
    const secondSeedBody = await secondSeed.json();
    expect(secondSeedBody.seeded).toBe(false);
    expect(secondSeedBody.reason).toContain('already exists');
  });

  test('seed demo populates workspace after owner setup', async ({ page }) => {
    await setupOwner(page);

    await page.request.post('http://127.0.0.1:4173/test/seed-demo');

    await page.goto('/app');
    await expect(page.getByText('Acme Creative').first()).toBeVisible();

    await page.goto('/app/customers');
    await expect(page.getByText('Acme Creative').first()).toBeVisible();

    await page.goto('/app/services');
    await expect(page.getByText('Website Design Sprint')).toBeVisible();

    await page.goto('/app/invoices');
    await expect(page.getByText('Acme Creative').first()).toBeVisible();
    await expect(page.getByText('Issued', { exact: true })).toBeVisible();
  });

  test('setup owner redirects to dashboard and protects /app', async ({ page }) => {
    await page.goto('/app');
    await expect(page).toHaveURL(/\/auth\/(sign-in|setup)$/);

    await page.goto('/auth/setup');
    await page.getByTestId('setup-name').fill('Owner User');
    await page.getByTestId('setup-email').fill('owner@example.com');
    await page.getByTestId('setup-password').fill('password123');
    await page.getByTestId('setup-submit').click();

    await expect(page).toHaveURL(/\/app$/);
    await expect(page.getByText('Welcome back, keep billing simple.')).toBeVisible();
  });

  test('setup owner shows validation on invalid payload', async ({ page }) => {
    await page.goto('/auth/setup');
    await page.getByTestId('setup-name').fill('Owner User');
    await page.getByTestId('setup-email').fill('owner@example.com');
    await page.getByTestId('setup-password').fill('short');
    await page.getByTestId('setup-submit').click();

    await expect(page.getByText('Name, email, and an 8-character password are required.')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/setup$/);
  });

  test('sign in and sign out works', async ({ page }) => {
    await setupOwner(page);
    await page.goto('/auth/sign-out');
    await expect(page).toHaveURL(/\/auth\/(sign-in|setup)$/);
    await signIn(page);
    await page.goto('/auth/sign-out');
    await expect(page).toHaveURL(/\/auth\/(sign-in|setup)$/);
  });

  test('sign in rejects invalid credentials', async ({ page }) => {
    await setupOwner(page);
    await page.goto('/auth/sign-out');

    await page.goto('/auth/sign-in');
    await page.getByTestId('signin-email').fill('owner@example.com');
    await page.getByTestId('signin-password').fill('wrong-password');
    await page.getByTestId('signin-submit').click();

    await expect(page.getByText('Invalid email or password.')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/sign-in$/);
  });

  test('customer create update archive flows work', async ({ page }) => {
    await setupOwner(page);

    await page.goto('/app/customers');
    await expect(page.getByTestId('customers-empty-state')).toBeVisible();

    await createCustomer(page, 'PT Demo Client', 'Demo Client', 'billing@demo.test');

    const updateForm = page.locator('form[action="?/update"]').first();
    await updateForm.locator('input[name="company"]').fill('Demo Client Updated');
    await updateForm.getByRole('button', { name: 'Update' }).click();
    await expect(page.getByText('Demo Client Updated')).toBeVisible();

    await page.locator('form[action="?/archive"]').first().getByRole('button', { name: 'Archive' }).click();
    await expect(page.getByTestId('customers-empty-state')).toBeVisible();

    await page.goto('/app/customers?archived=1');
    await expect(page.getByText('PT Demo Client')).toBeVisible();
  });

  test('service create update delete flows work', async ({ page }) => {
    await setupOwner(page);

    await page.goto('/app/services');
    await expect(page.getByTestId('services-empty-state')).toBeVisible();

    await createService(page, 'Design Sprint', '1500000');

    const updateForm = page.locator('form[action="?/update"]').first();
    await updateForm.locator('input[name="unitPrice"]').fill('1750000');
    await updateForm.getByRole('button', { name: 'Update' }).click();
    await expect(updateForm.locator('input[name="unitPrice"]')).toHaveValue('1750000');

    await page.locator('form[action="?/delete"]').first().getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByTestId('services-empty-state')).toBeVisible();
  });

  test('invoice create update print duplicate filter and delete flows work', async ({ page, context }) => {
    await setupOwner(page);

    await page.goto('/app/customers');
    await createCustomer(page, 'PT Demo Client');

    await page.goto('/app/services');
    await createService(page, 'Design Sprint', '2000000');

    await page.goto('/app/invoices');
    await page.getByTestId('invoice-create').click();
    await expect(page).toHaveURL(/\/app\/invoices\/.+/);

    await page.getByTestId('invoice-item-name-0').fill('Design Sprint');
    await page.getByTestId('invoice-item-qty-0').fill('2');
    await page.getByTestId('invoice-item-price-0').fill('2000000');
    await page.getByTestId('invoice-status').selectOption('issued');
    await page.getByTestId('invoice-tax').fill('11');
    await page.getByTestId('invoice-notes').fill('Full CRUD E2E note');
    const invoiceNumber = await page.getByTestId('invoice-number').inputValue();
    await page.getByTestId('invoice-save').click();

    await expect(page.getByTestId('invoice-subtotal')).toContainText('4');
    await expect(page.getByTestId('invoice-total')).toContainText('4');

    const [printPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByTestId('invoice-print-link').click()
    ]);
    await printPage.waitForLoadState('domcontentloaded');
    await expect(printPage.getByTestId('print-invoice-header')).toBeVisible();
    await expect(printPage.getByTestId('print-total-due')).toBeVisible();
    await expect(printPage.getByText('Design Sprint')).toBeVisible();

    await page.goto('/app/invoices');
    await expect(page.getByText(invoiceNumber)).toBeVisible();
    await expect(page.getByText('Issued', { exact: true })).toBeVisible();

    await page.locator('input[name="q"]').fill(invoiceNumber);
    await page.getByRole('button', { name: 'Filter' }).click();
    await expect(page.getByText(invoiceNumber)).toBeVisible();

    const duplicatePromise = page.waitForURL(/\/app\/invoices\/.+/);
    await page.locator('form[action="?/duplicate"]').first().getByRole('button', { name: 'Duplicate' }).click();
    await duplicatePromise;
    const duplicateNumber = await page.getByTestId('invoice-number').inputValue();
    await expect(page.getByTestId('invoice-status')).toHaveValue('draft');
    await expect(duplicateNumber).not.toBe(invoiceNumber);

    await page.goto('/app/invoices');
    await expect(page.getByText(invoiceNumber)).toBeVisible();
    await expect(page.getByText(duplicateNumber)).toBeVisible();

    await page.locator('input[name="q"]').fill(duplicateNumber);
    await page.getByRole('button', { name: 'Filter' }).click();
    await page.locator('form[action="?/delete"]').first().getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText(duplicateNumber)).toHaveCount(0);

    await page.locator('input[name="q"]').fill(invoiceNumber);
    await page.getByRole('button', { name: 'Filter' }).click();
    await page.locator('form[action="?/delete"]').first().getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText(invoiceNumber)).toHaveCount(0);
    await page.locator('input[name="q"]').fill('');
    await page.getByRole('button', { name: 'Filter' }).click();
    await expect(page.getByText('No invoices yet. Create one to start billing.')).toBeVisible();
  });
});



