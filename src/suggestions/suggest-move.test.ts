import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Direction, type GameState } from '@shared/types';

const send = vi.hoisted(() => vi.fn());

vi.mock('@openrouter/sdk', () => ({
  OpenRouter: class {
    chat = { send };
  },
}));

import { MissingApiKeyError, suggestMove } from '@suggestions/suggest-move';

const game: GameState = {
  board: [
    [2, 4, null, null],
    [null, 8, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ],
  status: 'playing',
};

describe('suggestMove', () => {
  beforeEach(() => {
    send.mockReset();
  });

  it('returns the direction from a valid JSON completion', async () => {
    send.mockResolvedValue({
      choices: [{ message: { content: '{"direction":"up"}' } }],
    });

    await expect(suggestMove(game, { apiKey: 'test-key' })).resolves.toBe(Direction.Up);
    expect(send).toHaveBeenCalledWith({
      chatRequest: expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: JSON.stringify({ status: game.status, board: game.board }),
            role: 'user',
          }),
        ]),
        responseFormat: { type: 'json_object' },
        stream: false,
      }),
    });
  });

  it('rejects a response with an invalid direction', async () => {
    send.mockResolvedValue({
      choices: [{ message: { content: '{"direction":"diagonal"}' } }],
    });

    await expect(suggestMove(game, { apiKey: 'test-key' })).rejects.toThrow(
      'The suggestion response did not contain a valid direction.',
    );
  });

  it('rejects when no API key is configured without calling OpenRouter', async () => {
    await expect(suggestMove(game, { apiKey: '' })).rejects.toBeInstanceOf(MissingApiKeyError);
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects terminal game states before calling OpenRouter', async () => {
    await expect(suggestMove({ ...game, status: 'lost' }, { apiKey: 'test-key' })).rejects.toThrow(
      'Suggestions are only available while the game is in progress.',
    );
    expect(send).not.toHaveBeenCalled();
  });
});
