import { INLINE_SECTION_KEYS, MAIN_REPLY_KEYBOARD_LAYOUT, SECTIONS } from '../config/sections.js';

export const CALLBACK_ACTIONS = {
  EARLY_ACCESS: 'early_access',
  OPEN_SECTIONS: 'open_sections',
  SHOW_MORE: 'show_more',
  SECTION_PREFIX: 'section:'
};

export function buildMainReplyKeyboard() {
  return {
    keyboard: MAIN_REPLY_KEYBOARD_LAYOUT.map((row) => row.map((text) => ({ text }))),
    resize_keyboard: true,
    one_time_keyboard: false,
    is_persistent: true,
    input_field_placeholder: 'Выберите раздел или напишите сообщение'
  };
}

export function buildEarlyAccessInlineKeyboard() {
  return {
    inline_keyboard: [[{ text: 'Хочу ранний доступ', callback_data: CALLBACK_ACTIONS.EARLY_ACCESS }]]
  };
}

export function buildSectionActionsInlineKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: 'Хочу ранний доступ', callback_data: CALLBACK_ACTIONS.EARLY_ACCESS },
        { text: 'Другой раздел', callback_data: CALLBACK_ACTIONS.OPEN_SECTIONS }
      ],
      [{ text: 'Ещё по этому разделу', callback_data: CALLBACK_ACTIONS.SHOW_MORE }]
    ]
  };
}

export function buildSectionPickerInlineKeyboard() {
  const rows = [];

  for (let index = 0; index < INLINE_SECTION_KEYS.length; index += 2) {
    const leftKey = INLINE_SECTION_KEYS[index];
    const rightKey = INLINE_SECTION_KEYS[index + 1];

    const row = [];

    if (leftKey) {
      row.push({
        text: SECTIONS[leftKey].label,
        callback_data: `${CALLBACK_ACTIONS.SECTION_PREFIX}${leftKey}`
      });
    }

    if (rightKey) {
      row.push({
        text: SECTIONS[rightKey].label,
        callback_data: `${CALLBACK_ACTIONS.SECTION_PREFIX}${rightKey}`
      });
    }

    rows.push(row);
  }

  rows.push([{ text: 'Хочу ранний доступ', callback_data: CALLBACK_ACTIONS.EARLY_ACCESS }]);

  return {
    inline_keyboard: rows
  };
}
