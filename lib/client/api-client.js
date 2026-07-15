import {
  ProgressController,
  SessionController,
  StatusController,
  TaskController,
} from '../controllers';

/**
 * Facade поверх контроллеров: единая точка входа к API.
 * Тесты работают с client.session / client.progress / client.tasks / client.status
 * и не знают о деталях построения HTTP-запросов.
 */
export class ApiClient {
  constructor(request) {
    this.request = request;
    this.session = new SessionController(request);
    this.progress = new ProgressController(request);
    this.tasks = new TaskController(request);
    this.status = new StatusController(request);
  }

  // Удобный шорткат: открыть сессию и сразу вернуть её идентификатор.
  async openSession() {
    const { sessionId } = await this.session.start();
    return sessionId;
  }
}
