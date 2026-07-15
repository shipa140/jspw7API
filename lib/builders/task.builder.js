import { faker } from '@faker-js/faker';

/**
 * Builder тестовых данных для задачи (todo).
 * Флюентный интерфейс: withXxx(...).build() — собираем ровно те поля,
 * которые нужны конкретному сценарию (в т.ч. заведомо невалидные).
 */
export class TaskBuilder {
  constructor() {
    this.payload = {};
  }

  withId(id) {
    this.payload.id = id;
    return this;
  }

  withTitle(words = 2) {
    this.payload.title = faker.lorem.words(words);
    return this;
  }

  // Явно задать заголовок нужной длины (например, для проверки лимита в 50 символов).
  withTitleOfLength(length) {
    this.payload.title = 'x'.repeat(length);
    return this;
  }

  withDescription(words = 3) {
    this.payload.description = faker.lorem.words(words);
    return this;
  }

  // Строка заданной длины — для проверок лимита описания / размера тела (413).
  withDescriptionOfLength(length) {
    this.payload.description = 'y'.repeat(length);
    return this;
  }

  withDone(done = true) {
    this.payload.doneStatus = done;
    return this;
  }

  // Позволяет намеренно подложить любое значение в doneStatus (для негативных кейсов).
  withRawDone(value) {
    this.payload.doneStatus = value;
    return this;
  }

  // Добавить произвольное «лишнее» поле — для сценария с неизвестным полем.
  withExtraField(name, value) {
    this.payload[name] = value;
    return this;
  }

  build() {
    return { ...this.payload };
  }
}
