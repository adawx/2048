import { useEffect, useState } from 'react';
import { createGame, move } from '@game/game';
import { MissingApiKeyError, suggestMove } from '@suggestions/suggest-move';
import { Direction, type GameState } from '@shared/types';
import { Board } from './Board';

const directionForKey: Record<string, Direction | undefined> = {
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right,
  ArrowUp: Direction.Up,
};

export function Game() {
  const [game, setGame] = useState<GameState>(() => createGame());
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = directionForKey[event.key];

      if (direction === undefined) {
        return;
      }

      event.preventDefault();
      setSuggestion(null);
      setGame((currentGame) => move(currentGame, direction));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const message =
    game.status === 'won'
      ? 'You reached 2048!'
      : game.status === 'lost'
        ? 'No more moves available.'
        : 'Use your arrow keys to move tiles.';

  async function requestSuggestion() {
    setIsSuggesting(true);
    setSuggestion(null);

    try {
      const direction = await suggestMove(game);
      setSuggestion(`Try moving ${direction}.`);
    } catch (error) {
      setSuggestion(
        error instanceof MissingApiKeyError ? error.message : 'Unable to get a suggestion.',
      );
    } finally {
      setIsSuggesting(false);
    }
  }

  function startNewGame() {
    setSuggestion(null);
    setGame(createGame());
  }

  return (
    <main className="game-page">
      <section className="game-intro" aria-labelledby="game-title">
        <header className="game-header">
          <h1 id="game-title">2048</h1>
        </header>
        <p className="game-message" aria-live="polite">
          {message}
        </p>
        <button className="reset-button" type="button" onClick={startNewGame}>
          Start over
        </button>
        <button
          className="suggestion-button"
          type="button"
          disabled={game.status !== 'playing' || isSuggesting}
          onClick={requestSuggestion}
        >
          {isSuggesting ? 'Thinking...' : 'Suggest a move'}
        </button>
        <p className="suggestion-message" aria-live="polite">
          {suggestion}
        </p>
      </section>

      <section className="game-board" aria-label="2048 game">
        <div className="board-container">
          <Board board={game.board} />
          {game.status !== 'playing' && (
            <div className="game-over" role="alert">
              <p>{game.status === 'won' ? 'You win!' : 'Game over'}</p>
              <button type="button" onClick={startNewGame}>
                Play again
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
