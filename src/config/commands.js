export const TELEGRAM_COMMANDS = [
  { command: 'start', description: '👋 Что умеет бот' },
  { command: 'account', description: '👤 Мой профиль' },
  { command: 'premium', description: '🚀 Премиум' },
  { command: 'mysections', description: '🗂️ Мои разделы' },
  { command: 'deletecontext', description: '💬 Удалить контекст' },
  { command: 'saveimage', description: '🖼️ Сохранить изображение' },
  { command: 'savevideo', description: '🎬 Сохранить видео' },
  { command: 'settings', description: '⚙️ Настройки бота' },
  { command: 'privacy', description: '📄 Приватность и безопасность' },
  { command: 'help', description: '🎱 Основные команды' }
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
