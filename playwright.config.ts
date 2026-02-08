import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:8081',
    locale: 'cs-CZ',
  },
  webServer: {
    command: 'npx vite --port 8081',
    url: 'http://localhost:8081',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
  ],
});
