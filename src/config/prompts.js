import { getSectionByKey } from './sections.js';

export const globalSystemPrompt = `Ты помогаешь пользователю понять будущий продукт NAPOMNI.
Пиши коротко, ясно и доброжелательно.
Не выдумывай текущие функции, которых в demo нет.`;

export const demoRulesPrompt = `Правила:
1) Это demo-бот для проверки спроса.
2) Не утверждай, что уже работает долговременное хранилище, поиск по архиву, анализ медиа или платный функционал.
3) Объясняй, как это будет работать в будущем продукте.
4) Держи ответы короткими: обычно 3-6 предложений.
5) Уместно мягко предложить ранний доступ.`;

export function buildPrompt(sectionKey, userText = '') {
  const section = getSectionByKey(sectionKey) ?? getSectionByKey('what_can_do');

  return `Режим: demo.
Раздел: ${section.shortTitle} (${section.sectionKey}).
Инструкция раздела: ${section.promptFragment}
Сообщение пользователя: ${userText || '(пусто)'}

Сформируй полезный короткий ответ на русском языке.`;
}
