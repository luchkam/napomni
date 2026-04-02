export const START_TEXT = `ХАОС ЗАКОНЧИЛСЯ.

ТЕПЕРЬ У ВАС ЕСТЬ NAPOMNI ✨

🧠 Всё важное теперь в одном месте.
🎤 Кидайте сюда голосовые, текст, фото, PDF, рецепты и документы.
📂 Бот сам всё разберёт по категориям и сохранит.
⏰ Если нужно — заранее напомнит.
👨‍👩‍👧 Дела, дети, лекарства, покупки и встречи — под рукой.
🔎 Нужна старая информация? Просто спросите.

👇 Нажмите кнопку и начните скидывать всё важное в NAPOMNI.`;

export const EARLY_ACCESS_QUESTION = 'Что вам важнее всего в таком боте?';

export const EARLY_ACCESS_MEDIA_REPLY =
  'Эта функция будет открыта в раннем доступе. Сейчас мы собираем первых пользователей. Хотите попасть в список и получить 3 месяца Premium бесплатно?';

export const EARLY_ACCESS_DONE_REPLY =
  'Готово, вы в списке раннего доступа. Первым пользователям дадим 3 месяца Premium бесплатно.';

export const EARLY_ACCESS_ALREADY_REPLY = 'Вы уже в списке раннего доступа. Спасибо, что с нами.';

export const SECTIONS = {
  what_can_do: {
    sectionKey: 'what_can_do',
    label: 'Что умеет этот бот',
    command: null,
    shortTitle: 'Возможности демо',
    staticFallbackText:
      'Это demo-бот NAPOMNI: показывает будущие сценарии по разделам, собирает заявки на ранний доступ и помогает понять, как сервис снимет хаос в делах.',
    promptFragment:
      'Объясни, как NAPOMNI в будущем объединит напоминания, поиск и структурирование важной информации. Будь честным: сейчас это demo и набор раннего доступа.',
    isLeadCTA: false
  },
  account: {
    sectionKey: 'account',
    label: 'Аккаунт',
    command: '/account',
    shortTitle: 'Аккаунт',
    staticFallbackText:
      'В аккаунте NAPOMNI будет единый центр управления: профиль, настройки уведомлений и синхронизация данных. Сейчас доступен demo-поток и ранний доступ.',
    promptFragment:
      'Опиши, как будет выглядеть раздел аккаунта в будущем продукте, без обещаний что это уже внедрено.',
    isLeadCTA: false
  },
  premium: {
    sectionKey: 'premium',
    label: 'Premium',
    command: '/premium',
    shortTitle: 'Premium',
    staticFallbackText:
      'Premium в NAPOMNI задуман для расширенных функций: больше автоматизации, глубже персонализация и умные напоминания. Сейчас идёт ранний доступ.',
    promptFragment:
      'Опиши ценность будущего Premium простыми словами. Не обещай готовый paywall или доступные прямо сейчас платные функции.',
    isLeadCTA: false
  },
  my_sections: {
    sectionKey: 'my_sections',
    label: 'Мои разделы',
    command: '/mysections',
    shortTitle: 'Разделы',
    staticFallbackText:
      'В NAPOMNI будут разделы для дома, работы, детей, финансов и здоровья. Сейчас это демо-модель сценариев с ранним доступом.',
    promptFragment:
      'Покажи, как разделы помогают навести порядок в задачах и заметках.',
    isLeadCTA: false
  },
  delete_context: {
    sectionKey: 'delete_context',
    label: 'Удаление контекста',
    command: '/deletecontext',
    shortTitle: 'Удаление контекста',
    staticFallbackText:
      'Контроль данных и очистка контекста будут доступны в отдельном сценарии. Сейчас функциональность показывает концепт без реального долговременного хранения.',
    promptFragment:
      'Объясни подход к контролю данных и удалению контекста в будущем продукте.',
    isLeadCTA: false
  },
  save_image: {
    sectionKey: 'save_image',
    label: 'Сохранение фото',
    command: '/saveimage',
    shortTitle: 'Фото',
    staticFallbackText:
      'Сценарий сохранения фото готовится для раннего доступа. В текущем demo бот не обрабатывает файлы и показывает только будущую механику.',
    promptFragment:
      'Опиши будущий сценарий работы с изображениями, честно обозначив, что сейчас это не активировано.',
    isLeadCTA: false
  },
  save_video: {
    sectionKey: 'save_video',
    label: 'Сохранение видео',
    command: '/savevideo',
    shortTitle: 'Видео',
    staticFallbackText:
      'Сценарий сохранения видео будет доступен позже. Сейчас бот демонстрирует идею и собирает ранний доступ.',
    promptFragment:
      'Опиши будущий сценарий работы с видео без заявлений о текущей обработке.',
    isLeadCTA: false
  },
  settings: {
    sectionKey: 'settings',
    label: 'Настройки',
    command: '/settings',
    shortTitle: 'Настройки',
    staticFallbackText:
      'В настройках появятся персональные правила напоминаний, разделы и предпочтения формата ответов. Сейчас доступен demo.',
    promptFragment:
      'Опиши будущие настройки пользователя и зачем они нужны.',
    isLeadCTA: false
  },
  privacy: {
    sectionKey: 'privacy',
    label: 'Приватность',
    command: '/privacy',
    shortTitle: 'Приватность',
    staticFallbackText:
      'NAPOMNI проектируется с акцентом на приватность и контроль доступа. В demo этапе данные используются только для базовой аналитики и заявок.',
    promptFragment:
      'Дай короткое понятное объяснение будущего подхода к приватности без юридических обещаний.',
    isLeadCTA: false
  },
  help: {
    sectionKey: 'help',
    label: 'Помощь',
    command: '/help',
    shortTitle: 'Помощь',
    staticFallbackText:
      'Выберите раздел кнопками снизу или командами. Если хотите доступ к первым функциям, оставьте заявку на ранний доступ.',
    promptFragment:
      'Сформулируй понятную подсказку, как человеку начать пользоваться demo-ботом.',
    isLeadCTA: false
  },
  reminder: {
    sectionKey: 'reminder',
    label: 'Напоминалка',
    command: null,
    shortTitle: 'Напоминания',
    staticFallbackText:
      'В разделе напоминаний NAPOMNI поможет заранее готовить задачи и не терять важные дела. Сейчас это demo-сценарий без реальной автосинхронизации.',
    promptFragment:
      'Покажи, как в будущем раздел напоминаний снимет хаос. Ответ короткий и дружелюбный.',
    isLeadCTA: false
  },
  home: {
    sectionKey: 'home',
    label: 'Дела домашние',
    command: null,
    shortTitle: 'Дом',
    staticFallbackText:
      'Домашний раздел NAPOMNI нужен для покупок, быта, встреч и семейных задач в одном месте. Сейчас это демо.',
    promptFragment:
      'Опиши будущие домашние сценарии: покупки, лекарства, бытовые задачи, встречи.',
    isLeadCTA: false
  },
  work: {
    sectionKey: 'work',
    label: 'Дела рабочие',
    command: null,
    shortTitle: 'Работа',
    staticFallbackText:
      'Рабочий раздел поможет держать сроки, встречи и материалы под рукой. Сейчас бот показывает концепт и собирает ранний доступ.',
    promptFragment:
      'Покажи, как раздел работы будет помогать с фокусом и дедлайнами.',
    isLeadCTA: false
  },
  kids: {
    sectionKey: 'kids',
    label: 'Дети',
    command: null,
    shortTitle: 'Дети',
    staticFallbackText:
      'Раздел для детей задуман как единое место для расписаний, секций, документов и напоминаний. Сейчас доступен demo-поток.',
    promptFragment:
      'Опиши будущую пользу раздела для родителей: кружки, школа, документы, встречи.',
    isLeadCTA: false
  },
  finance: {
    sectionKey: 'finance',
    label: 'Финансы',
    command: null,
    shortTitle: 'Финансы',
    staticFallbackText:
      'Финансовый раздел поможет не забывать платежи и контролировать регулярные траты. Пока это демонстрация без реального банковского подключения.',
    promptFragment:
      'Коротко опиши будущий раздел финансов и какую проблему он решает.',
    isLeadCTA: false
  },
  health: {
    sectionKey: 'health',
    label: 'Здоровье',
    command: null,
    shortTitle: 'Здоровье',
    staticFallbackText:
      'Раздел здоровья в будущем поможет не пропускать лекарства, обследования и важные назначения. Сейчас это только demo.',
    promptFragment:
      'Опиши пользу раздела здоровья коротко и конкретно.',
    isLeadCTA: false
  },
  early_access: {
    sectionKey: 'early_access',
    label: 'Хочу ранний доступ / 3 месяца бесплатно',
    command: null,
    shortTitle: 'Ранний доступ',
    staticFallbackText:
      'Оставьте заявку и расскажите, что для вас самое важное. Первым пользователям дадим 3 месяца Premium бесплатно.',
    promptFragment:
      'Предложи оставить заявку на ранний доступ коротко и мягко.',
    isLeadCTA: true
  }
};

export const MAIN_REPLY_KEYBOARD_LAYOUT = [
  ['Что умеет этот бот', 'Напоминалка'],
  ['Дела домашние', 'Дела рабочие'],
  ['Дети', 'Финансы'],
  ['Здоровье'],
  ['Хочу ранний доступ / 3 месяца бесплатно']
];

export const INLINE_SECTION_KEYS = ['what_can_do', 'reminder', 'home', 'work', 'kids', 'finance', 'health'];

export function getSectionByKey(sectionKey) {
  return SECTIONS[sectionKey] ?? null;
}

export function getSectionByLabel(label) {
  return Object.values(SECTIONS).find((section) => section.label === label) ?? null;
}

export function getSectionByCommand(command) {
  return Object.values(SECTIONS).find((section) => section.command === `/${command}`) ?? null;
}

export function getFallbackText(sectionKey) {
  const section = getSectionByKey(sectionKey);
  if (section) {
    return section.staticFallbackText;
  }

  return SECTIONS.what_can_do.staticFallbackText;
}
