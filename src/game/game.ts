import {
  boardsEqual,
  containsTile,
  createEmptyBoard,
  hasAvailableMove,
  moveBoard,
  placeTileInRandomEmptyCell,
} from '@game/board';
import { type Direction, type GameState, type NewGameOptions, type Random } from '@shared/types';
import {
  BOARD_SIZE,
  INITIAL_TILE_VALUE,
  SPAWNED_TILE_VALUES,
  TWO_TILE_SPAWN_PROBABILITY,
  WINNING_TILE,
} from '@shared/constants';

const defaultRandom: Random = Math.random;

export function createGame({
  initialTileCount,
  random = defaultRandom,
}: NewGameOptions = {}): GameState {
  const tileCount = initialTileCount ?? randomInitialTileCount(random);

  if (tileCount < 1 || tileCount > BOARD_SIZE * BOARD_SIZE) {
    throw new RangeError(`initialTileCount must be between 1 and ${BOARD_SIZE * BOARD_SIZE}`);
  }

  let board = createEmptyBoard();

  for (let count = 0; count < tileCount; count += 1) {
    board = placeTileInRandomEmptyCell(board, INITIAL_TILE_VALUE, random);
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
    board: placeTileInRandomEmptyCell(movedBoard, randomSpawnedTile(random), random),
    status: 'playing',
  });
}

function randomInitialTileCount(random: Random): number {
  return 1 + Math.floor(random() * BOARD_SIZE * BOARD_SIZE);
}

function randomSpawnedTile(random: Random): number {
  const [two, four] = SPAWNED_TILE_VALUES;
  return random() < TWO_TILE_SPAWN_PROBABILITY ? two : four;
}

function withStatus(game: GameState): GameState {
  if (containsTile(game.board, WINNING_TILE)) {
    return { ...game, status: 'won' };
  }

  return hasAvailableMove(game.board) ? game : { ...game, status: 'lost' };
}
