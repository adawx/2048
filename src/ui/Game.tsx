import { useEffect, useState } from 'react'
import { createGame, move } from '@game/game'
import { Direction, type GameState } from '@shared/types'
import { Board } from './Board'

const directionForKey: Record<string, Direction | undefined> = {
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right,
  ArrowUp: Direction.Up,
}

export function Game() {
  const [game, setGame] = useState<GameState>(() => createGame())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = directionForKey[event.key]

      if (direction === undefined) {
        return
      }

      event.preventDefault()
      setGame((currentGame) => move(currentGame, direction))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const message =
    game.status === 'won'
      ? 'You reached 2048!'
      : game.status === 'lost'
        ? 'No more moves available.'
        : 'Use your arrow keys to move tiles.'

  return (
    <main className="game-page">
      <section className="game-intro" aria-labelledby="game-title">
        <header className="game-header">
          <p className="eyebrow">A small numbers game</p>
          <h1 id="game-title">2048</h1>
          <p className="game-description">Shift. Combine. Keep the board alive.</p>
        </header>
        <p className="game-message" aria-live="polite">
          {message}
        </p>
        <button className="reset-button" type="button" onClick={() => setGame(createGame())}>
          Start over
        </button>
      </section>

      <section className="game-board" aria-label="2048 game">
        <div className="board-container">
          <Board board={game.board} />
          {game.status !== 'playing' && (
            <div className="game-over" role="alert">
              <p>{game.status === 'won' ? 'You win!' : 'Game over'}</p>
              <button type="button" onClick={() => setGame(createGame())}>
                Play again
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
