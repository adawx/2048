import { BLOCKED_TILE, type Board as BoardState } from '@shared/types';

interface BoardProps {
  readonly board: BoardState;
}

export function Board({ board }: BoardProps) {
  return (
    <div className="board" aria-label="Game board" role="grid">
      {board.flatMap((row, rowIndex) =>
        row.map((tile, columnIndex) => (
          <div
            className={`tile${
              tile === null
                ? ' tile--empty'
                : tile === BLOCKED_TILE
                  ? ' tile--blocked'
                  : ` tile--${tile}`
            }`}
            key={`${rowIndex}-${columnIndex}`}
            role="gridcell"
            aria-label={
              tile === null
                ? `Empty row ${rowIndex + 1}, column ${columnIndex + 1}`
                : tile === BLOCKED_TILE
                  ? `Blocked row ${rowIndex + 1}, column ${columnIndex + 1}`
                  : `${tile} at row ${rowIndex + 1}, column ${columnIndex + 1}`
            }
          >
            {tile === BLOCKED_TILE ? null : tile}
          </div>
        )),
      )}
    </div>
  );
}
