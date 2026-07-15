import { test } from '@playwright/test';

import { BaseController } from './base.controller';

/**
 * Контроллер ресурса /todos (в терминах проекта — «задачи», tasks).
 * Инкапсулирует все HTTP-операции над задачами: создание в разных
 * форматах, чтение, обновление, удаление и негативные сценарии.
 */
export class TaskController extends BaseController {
  // --- Создание ---

  async create(sessionId, payload) {
    return test.step('POST /todos — создать задачу', async () => {
      const response = await this.request.post(this.endpoint('/todos'), {
        headers: this.sessionHeaders(sessionId),
        data: payload,
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async createAsJson(sessionId, payload) {
    return test.step('POST /todos — создать (Content-Type/Accept: JSON)', async () => {
      const response = await this.request.post(this.endpoint('/todos'), {
        headers: this.sessionHeaders(sessionId, {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        data: payload,
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async createAsXml(sessionId, xmlBody) {
    return test.step('POST /todos — создать из XML', async () => {
      const response = await this.request.post(this.endpoint('/todos'), {
        headers: this.sessionHeaders(sessionId, {
          'Content-Type': 'application/xml',
          Accept: 'application/xml',
        }),
        data: xmlBody,
      });
      return {
        body: await response.text(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async createFromXmlReturnJson(sessionId, xmlBody) {
    return test.step('POST /todos — тело XML, ответ JSON', async () => {
      const response = await this.request.post(this.endpoint('/todos'), {
        headers: this.sessionHeaders(sessionId, {
          'Content-Type': 'application/xml',
          Accept: 'application/json',
        }),
        data: xmlBody,
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async createFromJsonReturnXml(sessionId, payload) {
    return test.step('POST /todos — тело JSON, ответ XML', async () => {
      const response = await this.request.post(this.endpoint('/todos'), {
        headers: this.sessionHeaders(sessionId, {
          'Content-Type': 'application/json',
          Accept: 'application/xml',
        }),
        data: payload,
      });
      return {
        body: await response.text(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async createWithPlainText(sessionId, textBody) {
    return test.step('POST /todos — неподдерживаемый text/plain', async () => {
      const response = await this.request.post(this.endpoint('/todos'), {
        headers: this.sessionHeaders(sessionId, { 'Content-Type': 'text/plain' }),
        data: textBody,
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  // --- Чтение ---

  async list(sessionId) {
    return test.step('GET /todos — все задачи', async () => {
      const response = await this.request.get(this.endpoint('/todos'), {
        headers: this.sessionHeaders(sessionId),
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async listAsXml(sessionId) {
    return test.step('GET /todos — ответ в XML', async () => {
      const response = await this.request.get(this.endpoint('/todos'), {
        headers: this.sessionHeaders(sessionId, { Accept: 'application/xml' }),
      });
      return {
        body: await response.text(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async listAsJson(sessionId) {
    return test.step('GET /todos — ответ в JSON', async () => {
      const response = await this.request.get(this.endpoint('/todos'), {
        headers: this.sessionHeaders(sessionId, { Accept: 'application/json' }),
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async listWithUnsupportedAccept(sessionId) {
    return test.step('GET /todos — неподдерживаемый Accept', async () => {
      const response = await this.request.get(this.endpoint('/todos'), {
        headers: this.sessionHeaders(sessionId, { Accept: 'application/gzip' }),
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async listByDoneStatus(sessionId, done) {
    return test.step(`GET /todos?doneStatus=${done} — фильтр по статусу`, async () => {
      const response = await this.request.get(
        this.endpoint(`/todos?doneStatus=${done}`),
        { headers: this.sessionHeaders(sessionId) },
      );
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async fetchById(sessionId, id) {
    return test.step(`GET /todos/${id} — задача по id`, async () => {
      const response = await this.request.get(this.endpoint(`/todos/${id}`), {
        headers: this.sessionHeaders(sessionId),
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async listFromWrongPath(sessionId) {
    return test.step('GET /todo — заведомо неверный путь', async () => {
      const response = await this.request.get(this.endpoint('/todo'), {
        headers: this.sessionHeaders(sessionId),
      });
      return { status: response.status() };
    });
  }

  async options(sessionId) {
    return test.step('OPTIONS /todos — допустимые методы', async () => {
      const response = await this.request.fetch(this.endpoint('/todos'), {
        method: 'OPTIONS',
        headers: this.sessionHeaders(sessionId),
      });
      return {
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  // --- Обновление ---

  async amendById(sessionId, id, payload) {
    return test.step(`POST /todos/${id} — частичное обновление`, async () => {
      const response = await this.request.post(this.endpoint(`/todos/${id}`), {
        headers: this.sessionHeaders(sessionId),
        data: payload,
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  async replaceById(sessionId, id, payload) {
    return test.step(`PUT /todos/${id} — полная замена`, async () => {
      const response = await this.request.put(this.endpoint(`/todos/${id}`), {
        headers: this.sessionHeaders(sessionId),
        data: payload,
      });
      return {
        body: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    });
  }

  // --- Удаление ---

  async removeById(sessionId, id) {
    return test.step(`DELETE /todos/${id} — удалить задачу`, async () => {
      const response = await this.request.delete(this.endpoint(`/todos/${id}`), {
        headers: this.sessionHeaders(sessionId),
      });
      return { status: response.status() };
    });
  }

  // Служебная очистка: снести все задачи текущей сессии (для afterAll).
  async purge(sessionId) {
    return test.step('DELETE /todos/* — очистка всех задач сессии', async () => {
      const { body } = await this.list(sessionId);
      for (const { id } of body.todos ?? []) {
        await this.request.delete(this.endpoint(`/todos/${id}`), {
          headers: this.sessionHeaders(sessionId),
        });
      }
    });
  }
}
