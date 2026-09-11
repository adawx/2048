import { BOARD_SIZE } from '@shared/constants';
import { Direction, type Board, type Random, type Tile } from '@shared/types';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array<Tile>(BOARD_SIZE).fill(null),
  );
}

export function placeRandomTile(
  board: Board,
  value: number,
  random: Random,
): Board {
  const emptyCells = board.flatMap((row, rowIndex) =>
    row.flatMap((tile, columnIndex) =>
      tile === null ? [[rowIndex, columnIndex]] : [],
    ),
  );

  if (emptyCells.length === 0) {
    return board;
  }

  const [rowIndex, columnIndex] =
    emptyCells[Math.floor(random() * emptyCells.length)];
  return board.map((row, index) =>
    index === rowIndex
      ? row.map((tile, column) => (column === columnIndex ? value : tile))
      : row,
  );
}

export function moveBoard(board: Board, direction: Direction): Board {
  const nextBoard = createEmptyBoard().map((row) => [...row]);

  for (let index = 0; index < BOARD_SIZE; index += 1) {
    writeLine(nextBoard, direction, index, mergeLine(readLine(board, direction, index)));
  }

  return nextBoard;
}

export function hasAvailableMove(board: Board): boolean {
  const directions = [Direction.Left, Direction.Up];
  return (
    board.some((row) => row.some((tile) => tile === null)) ||
    directions.some(
      (direction) => !boardsEqual(board, moveBoard(board, direction)),
    )
  );
}

export function containsTile(board: Board, value: number): boolean {
  return board.some((row) =>
    row.some((tile) => tile !== null && tile >= value),
  );
}

export function boardsEqual(first: Board, second: Board): boolean {
  return first.every((row, rowIndex) =>
    row.every((tile, columnIndex) => tile === second[rowIndex][columnIndex]),
  );
}

function readLine(board: Board, direction: Direction, index: number): Tile[] {
  return lineCoordinates(direction, index).map(
    ([row, column]) => board[row][column],
  );
}

function writeLine(
  board: Tile[][],
  direction: Direction,
  index: number,
  line: Tile[],
): void {
  lineCoordinates(direction, index).forEach(([row, column], lineIndex) => {
    board[row][column] = line[lineIndex];
  });
}

function lineCoordinates(
  direction: Direction,
  index: number,
): readonly (readonly [number, number])[] {
  const positions = Array.from(
    { length: BOARD_SIZE },
    (_, offset) => [index, offset] as const,
  );

  switch (direction) {
    case Direction.Left:
      return positions;
    case Direction.Right:
      return [...positions].reverse();
    case Direction.Up:
      return positions.map(([, column]) => [column, index] as const);
    case Direction.Down:
      return positions.map(([, column]) => [column, index] as const).reverse();
  }
}

function mergeLine(line: Tile[]): Tile[] {
  const tiles = line.filter((tile): tile is number => tile !== null);
  const result: Tile[] = [];

  for (let index = 0; index < tiles.length; index += 1) {
    if (tiles[index] === tiles[index + 1]) {
      const mergedTile = tiles[index] * 2;
      result.push(mergedTile);
      index += 1;
    } else {
      result.push(tiles[index]);
    }
  }

  return [...result, ...Array<Tile>(BOARD_SIZE - result.length).fill(null)];
}
