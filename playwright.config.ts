import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.e2e.{ts,js}',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173'
  },
  webServer: {
    command: 'bun run preview',
    port: 4173,
    reuseExistingServer: true,
    timeout: 120000
  }
});
