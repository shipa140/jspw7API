// Единая точка конфигурации окружения для API-клиента.
// Базовый адрес вынесен сюда, чтобы контроллеры не дублировали константу.
export const BASE_URL = process.env.API_BASE_URL ?? 'https://apichallenges.eviltester.com';

// Имя заголовка сессии, который выдаёт apichallenges для трекинга прогресса.
export const SESSION_HEADER = 'x-challenger';
