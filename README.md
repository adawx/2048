# 2048

2048 implmentation built with React and TypeScript.

## Table of Contents

- [Overview](#overview)
- [Technical Choices](#technical-choices)
- [Usage](#usage)
- [Other Commands](#other-commands)

## Technical Choices

TypeScript was chosen mostly as a comfort pick for myself, but I also felt it was a good fit for building out a relatively clean solution for the game. Vite and the React template were chosen for speed and ease of use. 

Repository structure is mostly aimed at abstracting out the game logic and shared typing to their own modules. With the aim to keep the seams between the layers clean, well defined and easy to iterate on in future.

Tests are co-located with their corresponding modules, primarily with the philosophy of as a project and repository grows, this generally feels like the best approach. Easy to know where the test for specific things are, easy to see if something has a test or not. They don't get bundled with the production build.

The game module `src/game/game.ts` is the main entry point for the game logic, exposing a small interface for creating/playing a game, evaluating game state. 

The board module `src/game/board.ts` conains the board mechanics behind the game interface: tile movement, merge rules, random placement, available-move detection.

`src/shared` contains shared types and interfaces for the game logic and the rendering layer. 

The React layer pretty much only renders the `GameState` and forwards keyboard input. 

## Usage

Using pnpm as the package manager (but yarn, npm, bun, etc. should work too):

```sh
pnpm install

pnpm dev
```

You should be able to play the game at `localhost:5173`.

Use the arrow keys to move tiles.
Select **New game** to reset the board.

Whilst playing you can select **Suggest a move** to get a suggestion from an AI model for the best possible move. You will need to provide your own OpenRouter API key to use the AI suggestion feature.

## AI suggestions

Create a local `.env.local` file from `.env.example` and add an `OPENROUTER_API_KEY_2048`.
The key is injected into the browser bundle for this demo and must not be used in production.
The **Suggest a move** button is available only while a game is in progress.

## Other Commands

```sh
pnpm test 
pnpm lint
pnpm build
```
