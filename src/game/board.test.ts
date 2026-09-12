import { describe, expect, it } from 'vitest'
import { hasAvailableMove, moveBoard, placeTileInRandomEmptyCell } from '@game/board'
import { Direction, type Random } from '@shared/types'
import { createBoard } from '../test/fixtures'

const fixedRandom = (...values: number[]): Random => {
  let index = 0
  return () => values[index++ % values.length]
}

describe('moveBoard', () => {
  it('slides and merges each row when moving left', () => {
    const board = createBoard([
      [null, 8, 2, 2],
      [4, 2, null, 2],
      [null, null, null, null],
      [null, null, null, 2],
    ])

    expect(moveBoard(board, Direction.Left)).toEqual([
      [8, 4, null, null],
      [4, 4, null, null],
      [null, null, null, null],
      [2, null, null, null],
    ])
  })

  it('only merges a tile once within a move', () => {
    const board = createBoard([
      [2, 2, 2, 2],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ])

    expect(moveBoard(board, Direction.Right)).toEqual([
      [null, null, 4, 4],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ])
  })

  it('reads columns in reverse when moving down', () => {
    const board = createBoard([
      [2, null, null, null],
      [2, null, null, null],
      [4, null, null, null],
      [null, null, null, null],
    ])

    expect(moveBoard(board, Direction.Down)).toEqual([
      [null, null, null, null],
      [null, null, null, null],
      [4, null, null, null],
      [4, null, null, null],
    ])
  })
})

describe('placeTileInRandomEmptyCell', () => {
  it('uses the supplied random source to select an empty cell', () => {
    const board = createBoard([
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ])

    expect(placeTileInRandomEmptyCell(board, 4, fixedRandom(0.5))).toEqual([
      [2, null, null, null],
      [null, null, null, null],
      [4, null, null, null],
      [null, null, null, null],
    ])
  })
})

describe('hasAvailableMove', () => {
  it('returns false for a full board with no adjacent matching tiles', () => {
    const board = createBoard([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ])

    expect(hasAvailableMove(board)).toBe(false)
  })

  it('returns true for adjacent matching tiles on a full board', () => {
    const board = createBoard([
      [2, 2, 4, 8],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128],
    ])

    expect(hasAvailableMove(board)).toBe(true)
  })
})
