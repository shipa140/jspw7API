import { test as base } from '@playwright/test';

import { ApiClient } from '../client/api-client';

// Fixture-фасад: прокидывает в тесты готовый ApiClient как `app`.
type AppFixtures = {
  app: ApiClient;
};

export const test = base.extend<AppFixtures>({
  app: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
});

export { expect } from '@playwright/test';
