import { test } from '@playwright/test';

import { BaseController } from './base.controller';

/**
 * Контроллер служебного эндпоинта /heartbeat — проверка «жив ли сервис»
 * и поведение на недопустимых методах.
 */
export class StatusController extends BaseController {
  async ping(sessionId) {
    return test.step('GET /heartbeat — сервис жив (204)', async () => {
      const response = await this.request.get(this.endpoint('/heartbeat'), {
        headers: this.sessionHeaders(sessionId),
      });
      return { status: response.status() };
    });
  }

  async remove(sessionId) {
    return test.step('DELETE /heartbeat — метод запрещён', async () => {
      const response = await this.request.delete(this.endpoint('/heartbeat'), {
        headers: this.sessionHeaders(sessionId),
      });
      return { status: response.status() };
    });
  }

  async patch(sessionId) {
    return test.step('PATCH /heartbeat — внутренняя ошибка', async () => {
      const response = await this.request.patch(this.endpoint('/heartbeat'), {
        headers: this.sessionHeaders(sessionId),
      });
      return { status: response.status() };
    });
  }

  async overrideAsDelete(sessionId) {
    return test.step('POST /heartbeat + override DELETE', async () => {
      const response = await this.request.post(this.endpoint('/heartbeat'), {
        headers: this.sessionHeaders(sessionId, { 'X-HTTP-Method-Override': 'DELETE' }),
      });
      return { status: response.status() };
    });
  }
}
