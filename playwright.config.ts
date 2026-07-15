import { defineConfig } from '@playwright/test';

/**
 * Конфигурация Playwright для API-набора против apichallenges.eviltester.com.
 * Браузер не нужен — работаем через встроенный APIRequestContext,
 * поэтому projects/devices намеренно не объявляем.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
  },
});
