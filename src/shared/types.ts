export type Tile = number | null;
export type Board = readonly (readonly Tile[])[];
export const Direction = {
  Down: 'down',
  Left: 'left',
  Right: 'right',
  Up: 'up',
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];
export type GameStatus = 'playing' | 'won' | 'lost';

/** Produces a uniformly distributed number in the half-open interval [0, 1). */
export type Random = () => number;

export interface GameState {
  readonly board: Board;
  readonly status: GameStatus;
}

export interface NewGameOptions {
  readonly initialTileCount?: number;
  readonly random?: Random;
}
