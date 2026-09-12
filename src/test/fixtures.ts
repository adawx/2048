import { BOARD_SIZE } from '@shared/constants';
import type { Board, GameState, Tile } from '@shared/types';

export function createBoard(rows: readonly (readonly Tile[])[]): Board {
  if (
    rows.length !== BOARD_SIZE ||
    rows.some((row) => row.length !== BOARD_SIZE)
  ) {
    throw new Error(`A board must contain ${BOARD_SIZE} rows of ${BOARD_SIZE} tiles.`);
  }

  return rows.map((row) => [...row]);
}

export function createPlayingGame(
  rows: readonly (readonly Tile[])[],
): GameState {
  return { board: createBoard(rows), status: 'playing' };
}
