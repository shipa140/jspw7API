import { test } from '@playwright/test';

import { SESSION_HEADER } from '../config';
import { BaseController } from './base.controller';

/**
 * Контроллер сессии челленджа: POST /challenger.
 * Возвращает идентификатор сессии (x-challenger), который используется дальше.
 */
export class SessionController extends BaseController {
  async start() {
    return test.step('POST /challenger — открыть новую сессию', async () => {
      const response = await this.request.post(this.endpoint('/challenger'));
      const headers = response.headers();
      return {
        sessionId: headers[SESSION_HEADER],
        status: response.status(),
        headers,
      };
    });
  }
}
