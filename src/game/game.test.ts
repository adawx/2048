import { describe, expect, it } from 'vitest';
import { createGame, move } from '@game/game';
import { Direction, type Random } from '@shared/types';
import { createPlayingGame } from '../test/fixtures';

const fixedRandom = (...values: number[]): Random => {
  let index = 0;
  return () => values[index++ % values.length];
};

describe('createGame', () => {
  it('places at least one and up to a full board of twos by default', () => {
    const minimumGame = createGame({ random: fixedRandom(0, 0) });
    const game = createGame({ random: fixedRandom(0.99, 0, 0, 0, 0) });

    expect(minimumGame.board.flat().filter((tile) => tile !== null)).toEqual([2]);
    expect(game.board.flat().filter((tile) => tile !== null)).toEqual(Array(16).fill(2));
  });

  it('places the requested number of twos in distinct cells', () => {
    const game = createGame({ initialTileCount: 3, random: fixedRandom(0, 0, 0) });

    expect(game.board.flat().filter((tile) => tile !== null)).toEqual([2, 2, 2]);
  });
});

describe('move', () => {
  it('slides and merges left once per tile, then adds a new tile', () => {
    const game = createPlayingGame([
      [null, 8, 2, 2],
      [4, 2, null, 2],
      [null, null, null, null],
      [null, null, null, 2],
    ]);

    const result = move(game, Direction.Left, fixedRandom(0, 0.99));

    expect(result.board).toEqual([
      [8, 4, null, null],
      [4, 4, null, null],
      [null, null, null, null],
      [2, null, null, 2],
    ]);
  });

  it('moves right and reverses merge order correctly', () => {
    const result = move(
      createPlayingGame([
        [2, 2, 2, 2],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]),
      Direction.Right,
      fixedRandom(0, 0.99),
    );

    expect(result.board[0]).toEqual([null, null, 4, 4]);
    expect(result.board[3][3]).toBe(2);
  });

  it('moves tiles vertically', () => {
    const result = move(
      createPlayingGame([
        [null, 8, 2, 2],
        [4, 2, null, 2],
        [null, null, null, null],
        [null, null, null, 2],
      ]),
      Direction.Up,
      fixedRandom(0, 0.5),
    );

    expect(result.board).toEqual([
      [4, 8, 2, 4],
      [null, 2, null, 2],
      [null, null, null, 2],
      [null, null, null, null],
    ]);
  });

  it('moves tiles down', () => {
    const result = move(
      createPlayingGame([
        [2, null, null, null],
        [2, null, null, null],
        [4, null, null, null],
        [null, null, null, null],
      ]),
      Direction.Down,
      fixedRandom(0, 0.99),
    );

    expect(result.board.map((row) => row[0])).toEqual([null, null, 4, 4]);
  });

  it('does not add a tile for a move that does not change the board', () => {
    const game = createPlayingGame([
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);

    expect(move(game, Direction.Left, fixedRandom(0, 0))).toEqual(game);
  });

  it('reports a loss when no moves remain', () => {
    const game = createPlayingGame([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]);

    expect(move(game, Direction.Left)).toMatchObject({ status: 'lost' });
  });

  it('reports a win after creating a 2048 tile', () => {
    const result = move(
      createPlayingGame([
        [1024, 1024, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]),
      Direction.Left,
      fixedRandom(0, 0),
    );

    expect(result.status).toBe('won');
    expect(result.board[0][0]).toBe(2048);
  });
});
