import OpenAI from 'openai';
import { env } from '../config/env.js';
import { buildPrompt, demoRulesPrompt, globalSystemPrompt } from '../config/prompts.js';
import { getFallbackText, getSectionByKey } from '../config/sections.js';

const openaiClient = env.openaiApiKey
  ? new OpenAI({ apiKey: env.openaiApiKey })
  : null;

function limitReply(text, maxChars = 850) {
  if (!text) {
    return '';
  }

  const trimmed = text.trim();
  if (trimmed.length <= maxChars) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxChars - 1)}…`;
}

function extractOutputText(response) {
  if (typeof response?.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const blocks = response?.output ?? [];
  const pieces = [];

  for (const block of blocks) {
    for (const item of block?.content ?? []) {
      if (item?.type === 'output_text' && item.text) {
        pieces.push(item.text);
      }
    }
  }

  return pieces.join('\n').trim();
}

function fallbackReply(sectionKey) {
  return getFallbackText(sectionKey);
}

export async function generateSectionReply({
  sectionKey,
  userText = '',
  userProfile = null,
  mode = 'section'
}) {
  const section = getSectionByKey(sectionKey) ?? getSectionByKey('what_can_do');

  if (!openaiClient) {
    return fallbackReply(section.sectionKey);
  }

  const userSnapshot = userProfile
    ? `telegram_id: ${userProfile.telegram_id ?? 'unknown'}, current_section: ${userProfile.current_section ?? 'none'}`
    : 'unknown';

  try {
    const response = await openaiClient.responses.create({
      model: env.openaiModel,
      input: [
        {
          role: 'system',
          content: `${globalSystemPrompt}\n\n${demoRulesPrompt}`
        },
        {
          role: 'user',
          content: `${buildPrompt(section.sectionKey, userText)}\n\nПрофиль: ${userSnapshot}\nРежим: ${mode}`
        }
      ],
      temperature: 0.6,
      max_output_tokens: 220
    });

    const text = extractOutputText(response);
    if (!text) {
      return fallbackReply(section.sectionKey);
    }

    return limitReply(text);
  } catch (error) {
    console.error('[openai] generateSectionReply failed:', error);
    return fallbackReply(section.sectionKey);
  }
}
