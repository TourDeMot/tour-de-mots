import type { ErrorCode, Player, ServerMessage } from "./types";

export const newErrorMessage = (code: ErrorCode) =>
  ({ event: "ERROR", code }) as ServerMessage;

// toolkit pour une game (Player[]) en pure fonctionnelle

export const findPlayer = (game: Player[], uuid: string) =>
  game.find((player) => player.uuid === uuid);

/**
 * Add a new player to the game, if the player is already in the game this function does nothing
 * @param game players of the game
 * @param plyaer player to add
 * @returns
 */
export const addPlayer = (game: Player[], player: Player) =>
  findPlayer(game, player.uuid) ? game : [...game, player];

export const removePlayer = (game: Player[], uuid: string) =>
  game.filter((player) => player.uuid !== uuid);
