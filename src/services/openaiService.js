import OpenAI from 'openai';
import { env } from '../config/env.js';
import { buildPrompt, demoRulesPrompt, globalSystemPrompt, RESPONSE_CLOSING_HINT } from '../config/prompts.js';
import { getFallbackText, getSectionByKey } from '../config/sections.js';

const openaiClient = env.openaiApiKey
  ? new OpenAI({ apiKey: env.openaiApiKey })
  : null;

function getMaxOutputTokens(sectionKey) {
  if (sectionKey === 'what_can_do') {
    return 420;
  }
  return 260;
}

function getMaxChars(sectionKey) {
  if (sectionKey === 'what_can_do') {
    return 1600;
  }
  return 980;
}

function limitReply(text, maxChars) {
  if (!text) {
    return '';
  }

  const trimmed = text.trim();
  if (trimmed.length <= maxChars) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxChars - 1)}…`;
}

function sanitizeMarkdownArtifacts(text) {
  if (!text) {
    return '';
  }

  let clean = text;
  clean = clean.replace(/\*\*(.*?)\*\*/g, '$1');
  clean = clean.replace(/__(.*?)__/g, '$1');
  clean = clean.replace(/```[\s\S]*?```/g, '');
  clean = clean.replace(/`([^`]+)`/g, '$1');
  clean = clean.replace(/^#{1,6}\s+/gm, '');
  clean = clean.replace(/^\s*[-*]\s+/gm, '• ');
  clean = clean.replace(/\|/g, '');
  clean = clean.replace(/[\*_~]+/g, '');
  clean = clean.replace(/\r/g, '');
  clean = clean.replace(/[ \t]+\n/g, '\n');
  clean = clean.replace(/\n{3,}/g, '\n\n');

  return clean.trim();
}

function ensureClosingLine(text) {
  const normalized = text.trim();
  if (!normalized) {
    return RESPONSE_CLOSING_HINT;
  }

  if (normalized.includes('Другой раздел') && normalized.includes('ранний доступ')) {
    return normalized;
  }

  return `${normalized}\n\n${RESPONSE_CLOSING_HINT}`;
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

function extractConversationId(response) {
  if (typeof response?.conversation_id === 'string' && response.conversation_id) {
    return response.conversation_id;
  }

  if (typeof response?.conversation === 'string' && response.conversation) {
    return response.conversation;
  }

  if (typeof response?.conversation?.id === 'string' && response.conversation.id) {
    return response.conversation.id;
  }

  return null;
}

function buildFallback(sectionKey) {
  const text = getFallbackText(sectionKey);
  const cleaned = sanitizeMarkdownArtifacts(text);
  return ensureClosingLine(cleaned);
}

function buildOpenAiRequest({ sectionKey, userText, userSnapshot, mode, conversationId, asObjectConversation }) {
  const payload = {
    model: env.openaiModel,
    input: [
      {
        role: 'system',
        content: `${globalSystemPrompt}\n\n${demoRulesPrompt}`
      },
      {
        role: 'user',
        content: `${buildPrompt({ sectionKey, userText, mode })}\n\nПрофиль: ${userSnapshot}\nРежим: ${mode}`
      }
    ],
    temperature: 0.7,
    max_output_tokens: getMaxOutputTokens(sectionKey)
  };

  if (conversationId) {
    payload.conversation = asObjectConversation ? { id: conversationId } : conversationId;
  }

  return payload;
}

async function requestWithConversationFallback(params) {
  const { conversationId } = params;

  if (!conversationId) {
    const response = await openaiClient.responses.create(
      buildOpenAiRequest({ ...params, asObjectConversation: false })
    );
    return { response, resetConversation: false };
  }

  try {
    const response = await openaiClient.responses.create(
      buildOpenAiRequest({ ...params, asObjectConversation: false })
    );
    return { response, resetConversation: false };
  } catch (firstError) {
    try {
      const response = await openaiClient.responses.create(
        buildOpenAiRequest({ ...params, asObjectConversation: true })
      );
      return { response, resetConversation: false };
    } catch (secondError) {
      console.error('[openai] Conversation id failed, creating a new conversation:', {
        firstError: firstError?.message,
        secondError: secondError?.message
      });

      const response = await openaiClient.responses.create(
        buildOpenAiRequest({ ...params, conversationId: null, asObjectConversation: false })
      );
      return { response, resetConversation: true };
    }
  }
}

export async function generateSectionReply({
  sectionKey,
  userText = '',
  userProfile = null,
  mode = 'section'
}) {
  const section = getSectionByKey(sectionKey) ?? getSectionByKey('what_can_do');
  const activeConversationId = userProfile?.openai_conversation_id ?? null;

  if (!openaiClient) {
    return {
      text: limitReply(buildFallback(section.sectionKey), getMaxChars(section.sectionKey)),
      conversationId: activeConversationId
    };
  }

  const userSnapshot = userProfile
    ? `telegram_id: ${userProfile.telegram_id ?? 'unknown'}, current_section: ${userProfile.current_section ?? 'none'}`
    : 'unknown';

  try {
    const { response, resetConversation } = await requestWithConversationFallback({
      sectionKey: section.sectionKey,
      userText,
      userSnapshot,
      mode,
      conversationId: activeConversationId
    });

    const detectedConversationId = extractConversationId(response);
    const finalConversationId = detectedConversationId ?? (resetConversation ? null : activeConversationId);

    const extractedText = extractOutputText(response);
    if (!extractedText) {
      return {
        text: limitReply(buildFallback(section.sectionKey), getMaxChars(section.sectionKey)),
        conversationId: finalConversationId
      };
    }

    const cleaned = sanitizeMarkdownArtifacts(extractedText);
    const withClosingLine = ensureClosingLine(cleaned);

    return {
      text: limitReply(withClosingLine, getMaxChars(section.sectionKey)),
      conversationId: finalConversationId
    };
  } catch (error) {
    console.error('[openai] generateSectionReply failed:', error);
    return {
      text: limitReply(buildFallback(section.sectionKey), getMaxChars(section.sectionKey)),
      conversationId: activeConversationId
    };
  }
}
