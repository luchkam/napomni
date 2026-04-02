import { env } from '../config/env.js';
import {
  countLeads,
  getLeadByTelegramId,
  markLeadAwaitingInterest,
  setLeadInterest,
  upsertLeadOnClick
} from '../repos/leadsRepo.js';

export async function registerLeadClick({ telegramId, sourceParam = null, sectionKey = null }) {
  const existingLead = await getLeadByTelegramId(telegramId);

  if (existingLead?.interest_text) {
    return { state: 'already_captured', lead: existingLead };
  }

  if (!existingLead && env.earlyAccessLimit > 0) {
    const leadsTotal = await countLeads();
    if (leadsTotal >= env.earlyAccessLimit) {
      return { state: 'limit_reached', lead: null };
    }
  }

  await upsertLeadOnClick({
    telegramId,
    sourceParam,
    firstSection: sectionKey,
    lastSection: sectionKey
  });

  const awaitingLead = await markLeadAwaitingInterest(telegramId);
  return {
    state: existingLead ? 'awaiting_existing' : 'awaiting_new',
    lead: awaitingLead ?? existingLead
  };
}

export async function isAwaitingLeadInterest(telegramId) {
  const lead = await getLeadByTelegramId(telegramId);
  if (!lead) {
    return false;
  }

  return lead.status === 'awaiting_interest' && !lead.interest_text;
}

export async function saveLeadInterest({ telegramId, interestText }) {
  const existingLead = await getLeadByTelegramId(telegramId);

  if (!existingLead) {
    return { state: 'missing', lead: null };
  }

  if (existingLead.interest_text) {
    return { state: 'already_captured', lead: existingLead };
  }

  const updatedLead = await setLeadInterest(telegramId, interestText);
  if (!updatedLead) {
    return { state: 'not_updated', lead: existingLead };
  }

  return { state: 'captured', lead: updatedLead };
}

export async function getLead(telegramId) {
  return getLeadByTelegramId(telegramId);
}
