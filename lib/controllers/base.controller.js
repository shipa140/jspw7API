import { SESSION_HEADER, BASE_URL } from '../config';

/**
 * Базовый контроллер (паттерн Controller).
 * Хранит APIRequestContext и собирает служебные заголовки/URL,
 * чтобы конкретные ресурсные контроллеры не повторяли эту логику.
 */
export class BaseController {
  constructor(request) {
    this.request = request;
    this.baseUrl = BASE_URL;
  }

  // Заголовок сессии + произвольные дополнительные заголовки конкретного запроса.
  sessionHeaders(sessionId, extra = {}) {
    return { [SESSION_HEADER]: sessionId, ...extra };
  }

  // Склейка полного адреса эндпоинта.
  endpoint(path) {
    return `${this.baseUrl}${path}`;
  }
}
