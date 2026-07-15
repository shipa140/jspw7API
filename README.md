# API Tests Project — Playwright

Финальное задание **QA.GURU** | JS + Playwright
API: https://apichallenges.eviltester.com

## Что сделано

32 теста на API https://apichallenges.eviltester.com.

### Список тестов

1. Создание сессии
2. Получение списка челленджей
3. Создание задачи POST /todos (201)
4. Получение всех задач GET /todos (200)
5. Ошибка 404 в GET /todo(s)
6. Получение задачи по id GET /todos/{id} (200)
7. Получение сделанных задач по статусу GET /todos?filter (200)
8. Обновление заголовка задачи по id POST /todos/{id} (200)
9. Полное обновление задачи PUT /todos/{id} (200)
10. Удаление задачи DELETE /todos/{id} (200)
11. Ошибка 400 в POST /todos, если параметр doneStatus не типа boolean
12. Ошибка 400 в POST /todos, если параметр title превышает лимит
13. Ошибка 400 в POST /todos, если параметр description превышает лимит
14. Ошибка 413 в POST /todos, если тело запроса превышает лимит
15. Ошибка 400 в POST /todos, если передан незаявленный параметр
16. Ошибка 404 в POST /todos/{id}, если задача с таким id не существует
17. Создание задачи в XML формате POST /todos (201) — проверка Content-Type: application/xml
18. Создание задачи в JSON формате POST /todos (201) — явная проверка Content-Type: application/json
19. Ошибка 415 в POST /todos — неподдерживаемый формат данных (text/plain)
20. POST /todos (201) — отправляем XML, принимаем JSON (Content Negotiation)
21. POST /todos (201) — отправляем JSON, принимаем XML (Content Negotiation)
22. GET /todos (200) — получение задач в XML формате (Accept: application/xml)
23. GET /todos (200) — получение задач в JSON формате (Accept: application/json)
24. Ошибка 406 в GET /todos — неподдерживаемый заголовок Accept
25. PUT /todos/{id} (200) — обновление задачи не всеми полями, проверка дефолтных значений в ответе
26. Ошибка 400 в PUT /todos/{id} — попытка изменить id задачи
27. DELETE /heartbeat (405) — Method Not Allowed
28. PATCH /heartbeat (500) — Internal Server Error
29. GET /heartbeat (204) — проверка, что сервер работает (No Content)
30. POST /heartbeat (405) — Method Not Allowed (имитация DELETE через POST)
31. OPTIONS /todos (200) — список разрешённых HTTP-методов (заголовок Allow)
32. Полная очистка списка задач — последовательное DELETE /todos/{id}

## Паттерны

- **Builder** — `TaskBuilder` для генерации тестовых данных задачи
- **Facade** — `ApiClient` в фикстурах для инкапсуляции HTTP-запросов
- **Controller** — по контроллеру на ресурс (session / progress / task / status)

## Теги

`@GET` `@POST` `@PUT` `@DELETE` `@PATCH` `@OPTIONS`

## Как запустить

```bash
npm run test            # все тесты
npm run test:get        # только GET
npm run test:post       # только POST
npm run test:put        # только PUT
npm run test:delete     # только DELETE
npm run test:patch      # только PATCH
npm run test:options    # только OPTIONS
```

### Отчёт Allure

```bash
npm run allure:serve    # собрать и открыть отчёт (нужна Java)
```
