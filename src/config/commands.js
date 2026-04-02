export const TELEGRAM_COMMANDS = [
  { command: 'start', description: 'Запустить демо-бот' },
  { command: 'account', description: 'Как будет работать аккаунт' },
  { command: 'premium', description: 'Что будет в Premium' },
  { command: 'mysections', description: 'Разделы NAPOMNI' },
  { command: 'deletecontext', description: 'Удаление и контроль контекста' },
  { command: 'saveimage', description: 'Сохранение изображений (demo)' },
  { command: 'savevideo', description: 'Сохранение видео (demo)' },
  { command: 'settings', description: 'Настройки' },
  { command: 'privacy', description: 'Приватность и безопасность' },
  { command: 'help', description: 'Помощь и сценарии использования' }
];

export const COMMAND_TO_SECTION_KEY = {
  account: 'account',
  premium: 'premium',
  mysections: 'my_sections',
  deletecontext: 'delete_context',
  saveimage: 'save_image',
  savevideo: 'save_video',
  settings: 'settings',
  privacy: 'privacy',
  help: 'help'
};
