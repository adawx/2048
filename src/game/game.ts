import {
  boardsEqual,
  containsTile,
  createEmptyBoard,
  hasAvailableMove,
  moveBoard,
  placeTileInRandomEmptyCell,
} from '@game/board';
import {
  type Direction,
  type GameState,
  type NewGameOptions,
  type Random,
} from '@shared/types';
import {
  BOARD_SIZE,
  WINNING_TILE,
} from '@shared/constants';

const defaultRandom: Random = Math.random;

export function createGame({
  initialTileCount,
  random = defaultRandom,
}: NewGameOptions = {}): GameState {
  const tileCount = initialTileCount ?? randomInitialTileCount(random);

  if (tileCount < 1 || tileCount > BOARD_SIZE * BOARD_SIZE) {
    throw new RangeError(
      `initialTileCount must be between 1 and ${BOARD_SIZE * BOARD_SIZE}`,
    );
  }

  let board = createEmptyBoard();

  for (let count = 0; count < tileCount; count += 1) {
    board = placeTileInRandomEmptyCell(board, 2, random);
  }

  return { board, status: 'playing' };
}

export function move(
  game: GameState,
  direction: Direction,
  random: Random = defaultRandom,
): GameState {
  if (game.status !== 'playing') {
    return game;
  }

  const movedBoard = moveBoard(game.board, direction);

  if (boardsEqual(game.board, movedBoard)) {
    return withStatus(game);
  }

  return withStatus({
    board: placeTileInRandomEmptyCell(
      movedBoard,
      random() < 0.9 ? 2 : 4,
      random,
    ),
    status: 'playing',
  });
}

function randomInitialTileCount(random: Random): number {
  return 1 + Math.floor(random() * BOARD_SIZE * BOARD_SIZE);
}

function withStatus(game: GameState): GameState {
  if (containsTile(game.board, WINNING_TILE)) {
    return { ...game, status: 'won' };
  }

  return hasAvailableMove(game.board) ? game : { ...game, status: 'lost' };
}
