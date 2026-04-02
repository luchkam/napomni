import { parseCommand } from './utils.js';
import { handleStartCommand } from '../handlers/startHandler.js';
import { handleCommand } from '../handlers/commandHandler.js';

export async function routeCommandUpdate(update) {
  const message = update?.message;
  if (!message?.text) {
    return false;
  }

  const parsed = parseCommand(message.text);
  if (!parsed) {
    return false;
  }

  if (parsed.command === 'start') {
    const startParam = parsed.args[0] ?? null;
    await handleStartCommand({ update, message, startParam });
    return true;
  }

  await handleCommand({
    update,
    message,
    command: parsed.command,
    args: parsed.args
  });

  return true;
}
