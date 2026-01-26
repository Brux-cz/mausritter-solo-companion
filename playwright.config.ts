import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright konfigurace pro Mausritter Solo Companion
 *
 * DŮLEŽITÉ NASTAVENÍ:
 * - workers: 1 - localStorage je globální, testy nemohou běžet paralelně
 * - fullyParallel: false - prevence race conditions
 * - webServer - automaticky spustí Python HTTP server
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests sequentially (localStorage is shared) */
  fullyParallel: false,
  workers: 1,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:8081',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* KRITICKÉ: Každý test začíná s prázdným localStorage */
    storageState: undefined,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Mobile testing - používáme Chromium s mobile viewport místo WebKit */
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],  // Chromium-based místo WebKit (iPhone)
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'python -m http.server 8081',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
