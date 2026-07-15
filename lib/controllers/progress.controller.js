import { test } from '@playwright/test';

import { BaseController } from './base.controller';

/**
 * Контроллер прогресса челленджей: GET /challenges.
 */
export class ProgressController extends BaseController {
  async list(sessionId) {
    return test.step('GET /challenges — список челленджей', async () => {
      const response = await this.request.get(this.endpoint('/challenges'), {
        headers: this.sessionHeaders(sessionId),
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }
}
