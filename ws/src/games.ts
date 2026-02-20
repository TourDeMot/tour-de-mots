import type { Player } from "@ws-poc/shared/types";
import { Err, Ok } from "@ws-poc/shared/result";
import { ALREADY_IN_A_GAME, GAME_NOT_FOUND } from "@ws-poc/shared/error";

export const isPlayerInGame = (games: Map<string, Player[]>, player: Player) =>
  Array.from(games.values())
    .flat()
    .some(({ uuid }) => uuid === player.uuid);

export const generateGameId = (
  games: Map<string, Player[]>,
  length: number = 6,
): string => {
  let gameId: string;
  do {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    gameId = Array.from(bytes)
      .map((b) => chars[b % chars.length])
      .join("");
  } while (games.has(gameId));
  return gameId;
};

export const addPlayer = (players: Player[], player: Player) =>
  players.some((p) => p.uuid === player.uuid) ? players : [...players, player];

export const removePlayer = (players: Player[], uuid: string) =>
  players.filter((player) => player.uuid !== uuid);

export const createGame = (games: Map<string, Player[]>, player: Player) => {
  if (isPlayerInGame(games, player)) {
    return Err(ALREADY_IN_A_GAME);
  }

  const gameId = generateGameId(games);
  games.set(gameId, [player]);

  return Ok(gameId);
};

export const joinGame = (
  games: Map<string, Player[]>,
  gameId: string,
  player: Player,
) => {
  const game = games.get(gameId);
  if (!game) return Err(GAME_NOT_FOUND);

  if (isPlayerInGame(games, player)) return Err(ALREADY_IN_A_GAME);

  const updatedPlayers = addPlayer(game, player);
  games.set(gameId, updatedPlayers);

  return Ok(updatedPlayers);
};

export const leaveGame = (
  games: Map<string, Player[]>,
  gameId: string,
  uuid: string,
) => {
  const game = games.get(gameId);
  if (!game) return Err(GAME_NOT_FOUND);

  const updatedPlayers = removePlayer(game, uuid);
  games.set(gameId, updatedPlayers);

  if (!updatedPlayers.length) {
    games.delete(gameId);
  }

  return Ok(updatedPlayers);
};
