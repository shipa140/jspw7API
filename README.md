# API Automation · apichallenges

Набор API-автотестов для учебного сервиса **[API Challenges](https://apichallenges.eviltester.com)**
на **Playwright Test** (встроенный `APIRequestContext`, без браузера).

Проект имитирует боевое тестовое задание Junior QA Automation: покрытие ресурса
`/todos`, служебного `/heartbeat`, сессии `/challenger` и прогресса `/challenges`
позитивными и негативными сценариями с бизнес-валидацией ответов.

## Архитектура и паттерны

```
lib/
  config.js                     базовый URL и имя заголовка сессии
  controllers/                  паттерн Controller — по одному на ресурс
    base.controller.js          общая логика (заголовки, сборка URL)
    session.controller.js       POST /challenger
    progress.controller.js      GET  /challenges
    task.controller.js          весь CRUD /todos + форматы + OPTIONS
    status.controller.js        /heartbeat
  client/
    api-client.js               паттерн Facade — единая точка входа ApiClient
  builders/
    task.builder.js             паттерн Builder — фабрика тестовых данных задачи
  fixtures/
    app.fixture.ts              фикстура-фасад: прокидывает ApiClient как `app`
tests/
  session.spec.js               сессия и прогресс
  tasks-read.spec.js            чтение задач + OPTIONS
  tasks-write.spec.js           создание / обновление / удаление
  tasks-content.spec.js         согласование форматов XML ⇄ JSON
  tasks-negative.spec.js        валидация ошибок (400 / 404 / 413 / 415)
  status.spec.js                heartbeat (204 / 405 / 500)
```

- **Controller** — каждый контроллер инкапсулирует HTTP-запросы одного ресурса.
- **Facade** — `ApiClient` собирает контроллеры и отдаётся в тесты через фикстуру.
- **Builder** — `TaskBuilder` флюентно собирает тело задачи, в т.ч. невалидное.

## Покрытие (32 теста)

| Метод   | Тестов | Тег         |
|---------|:------:|-------------|
| GET     |   9    | `@GET`      |
| POST    |   15   | `@POST`     |
| PUT     |   3    | `@PUT`      |
| PATCH   |   1    | `@PATCH`    |
| DELETE  |   3    | `@DELETE`   |
| OPTIONS |   1    | `@OPTIONS`  |

Каждый тест проверяет бизнес-логику: значения полей ответа, коды статусов и
тексты сообщений об ошибках.

## Запуск

```bash
npm install
npx playwright install            # разово, ставит служебные бинарники Playwright
npm test                          # весь набор
npm run test:get                  # только @GET (аналогично post/put/patch/delete/options)
npm run test:report               # открыть HTML-отчёт
```

Базовый адрес можно переопределить переменной окружения `API_BASE_URL`.
