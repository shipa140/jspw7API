import { expect, test } from '../lib/fixtures/app.fixture';
import { TaskBuilder } from '../lib/builders/task.builder';

// Согласование форматов (content negotiation) при создании задач.
test.describe('Задачи · форматы XML/JSON', () => {
  let sessionId;

  const xmlTask = `<?xml version="1.0" encoding="UTF-8"?>
<todo>
  <title>Задача из XML</title>
  <doneStatus>true</doneStatus>
  <description>Создано через application/xml</description>
</todo>`;

  test.beforeAll(async ({ app }) => {
    sessionId = await app.openSession();
  });

  test.afterAll(async ({ app }) => {
    await app.tasks.purge(sessionId);
  });

  test('POST /todos — тело и ответ в XML (201) @POST', async ({ app }) => {
    const { body, status, headers } = await app.tasks.createAsXml(sessionId, xmlTask);

    expect(status).toBe(201);
    expect(headers['content-type']).toContain('application/xml');
    expect(body).toContain('<title>Задача из XML</title>');
    expect(body).toContain('<doneStatus>true</doneStatus>');
  });

  test('POST /todos — тело XML, ответ JSON (201) @POST', async ({ app }) => {
    const { body, status, headers } = await app.tasks.createFromXmlReturnJson(sessionId, xmlTask);

    expect(status).toBe(201);
    expect(headers['content-type']).toContain('application/json');
    expect(body.title).toBe('Задача из XML');
    expect(body.description).toContain('application/xml');
    expect(body.doneStatus).toBe(true);
  });

  test('POST /todos — тело JSON, ответ XML (201) @POST', async ({ app }) => {
    const draft = new TaskBuilder().withTitle(2).withDone(true).withDescription(3).build();

    const { body, status, headers } = await app.tasks.createFromJsonReturnXml(sessionId, draft);

    expect(status).toBe(201);
    expect(headers['content-type']).toContain('application/xml');
    expect(body).toContain('<todo>');
    expect(body).toContain(`<title>${draft.title}</title>`);
    expect(body).toContain('<doneStatus>true</doneStatus>');
    expect(body).toContain(`<description>${draft.description}</description>`);
  });
});
