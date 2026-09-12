import { Direction, type Direction as DirectionValue, type GameState } from '@shared/types';

const MODEL = 'openrouter/auto';

const systemPrompt = `You are a 2048 strategy assistant.
Review the current game state and select the best next move to preserve empty cells, create merges, and avoid a game over.
Respond only with a JSON object in this exact shape: {"direction":"left"}.
The direction must be one of: left, right, up, down.`;

export class MissingApiKeyError extends Error {
  constructor() {
    super('No API Key set.');
  }
}

export interface SuggestMoveOptions {
  readonly apiKey?: string;
}

export async function suggestMove(
  game: GameState,
  { apiKey = import.meta.env.OPENROUTER_API_KEY_2048 }: SuggestMoveOptions = {},
): Promise<DirectionValue> {
  if (game.status !== 'playing') {
    throw new Error('Suggestions are only available while the game is in progress.');
  }

  if (!apiKey) {
    throw new MissingApiKeyError();
  }

  const { OpenRouter } = await import('@openrouter/sdk');
  const openRouter = new OpenRouter({ apiKey });
  const response = await openRouter.chat.send({
    chatRequest: {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: JSON.stringify({ status: game.status, board: game.board }),
        },
      ],
      responseFormat: { type: 'json_object' },
      stream: false,
      temperature: 0,
    },
  });

  if (!('choices' in response)) {
    throw new Error('The suggestion response unexpectedly streamed.');
  }

  const content = response.choices[0]?.message.content;

  if (typeof content !== 'string') {
    throw new Error('The suggestion response did not contain text.');
  }

  return parseDirection(content);
}

function parseDirection(content: string): DirectionValue {
  const parsed: unknown = JSON.parse(content);

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('direction' in parsed) ||
    !isDirection(parsed.direction)
  ) {
    throw new Error('The suggestion response did not contain a valid direction.');
  }

  return parsed.direction;
}

function isDirection(value: unknown): value is DirectionValue {
  return (
    value === Direction.Down ||
    value === Direction.Left ||
    value === Direction.Right ||
    value === Direction.Up
  );
}
