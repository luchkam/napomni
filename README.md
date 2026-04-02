# NAPOMNI Demo Telegram Bot

Production-ready (в минимальном объёме) demo-бот для проверки спроса на NAPOMNI.

## Что уже реализовано
- Telegram webhook-бот на Node.js + Express.
- PostgreSQL аналитика и idempotent обработка апдейтов (`telegram_updates`).
- Роутинг по типам апдейтов: команды, текст, медиа, callback_query.
- Разделы продукта через OpenAI (с fallback при недоступности API).
- Сбор лидов раннего доступа (без дублей) + сохранение интереса пользователя.
- Admin API для сводки, лидов и последних событий.
- Авто-миграции, регистрация команд, попытка `setWebhook` на старте.

## Стек
- Node.js 20+
- Express
- PostgreSQL (`DATABASE_URL`)
- Telegram Bot API (webhook)
- OpenAI official SDK

## Структура
```text
assets/
src/
  index.js
  app.js
  config/
  db/
  telegram/
  handlers/
  services/
  routes/
  repos/
.env.example
.gitignore
package.json
render.yaml
```

## Локальный запуск
1. Установите зависимости:
   ```bash
   npm install
   ```
2. Создайте `.env` на основе `.env.example`.
3. Запустите сервер:
   ```bash
   npm start
   ```

Сервер:
- слушает `PORT`
- применяет миграции при старте
- регистрирует Telegram-команды
- пытается установить webhook на `BASE_URL + /telegram/webhook`

Если `setWebhook` не удался, приложение не падает и продолжает работу.

## Telegram webhook
- URL: `POST /telegram/webhook`
- Проверяет заголовок: `X-Telegram-Bot-Api-Secret-Token`
- Пишет raw update в `telegram_updates`
- При дубле `update_id` возвращает `200 OK` без повторной обработки

## API
- `GET /healthz` -> `{ status, app, uptime }`
- `GET /admin/stats` (Bearer `ADMIN_TOKEN`)
- `GET /admin/leads` (Bearer `ADMIN_TOKEN`)
- `GET /admin/events` (Bearer `ADMIN_TOKEN`, последние 100)

## Переменные окружения
Заполните все поля из `.env.example`:

- `NODE_ENV`
- `PORT`
- `APP_NAME`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `TELEGRAM_BOT_USERNAME`
- `TELEGRAM_BOT_ID`
- `BASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `DATABASE_URL`
- `ADMIN_TOKEN`
- `ADMIN_CHAT_ID`
- `EARLY_ACCESS_LIMIT`
- `PREMIUM_FREE_MONTHS`
- `START_CARD_PATH`

## База данных
Миграции описаны в `src/db/schema.sql` и выполняются через:
- `npm start` (автоматически)
- `npm run migrate` (вручную)

Таблицы:
- `users`
- `leads`
- `events`
- `telegram_updates`

## Render deployment
`render.yaml` уже добавлен.

Минимальные шаги:
1. Создайте Web Service из этого репозитория.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Добавьте все env-переменные.
5. Укажите корректный `BASE_URL` вида `https://<service>.onrender.com`

## Важно
- Demo-бот не обрабатывает реальные файлы медиа на этом этапе.
- При получении `photo/video/voice/audio/document` бот честно сообщает про ранний доступ.
- Если `assets/logo.png` отсутствует, приложение не падает (файл не обязателен для запуска).
