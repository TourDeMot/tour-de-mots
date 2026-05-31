import type { Player } from "@tour-de-mot/shared/types";
import { Err, Ok } from "@tour-de-mot/shared/result";
import {
  ALREADY_IN_A_GAME,
  GAME_ALREADY_STARTED,
  GAME_NOT_FOUND,
} from "@tour-de-mot/shared/error";
import type { GameState } from "./state";
import { newGameState } from "./state";

export const isPlayerInGame = (games: Map<string, GameState>, player: Player) =>
  Array.from(games.values())
    .flatMap((game) => game.players)
    .some(({ uuid }) => uuid === player.uuid);

export const generateGameId = (
  games: Map<string, GameState>,
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

export const createGame = (games: Map<string, GameState>, player: Player) => {
  if (isPlayerInGame(games, player)) {
    return Err(ALREADY_IN_A_GAME);
  }

  const gameId = generateGameId(games);
  games.set(gameId, newGameState(player));

  return Ok({ gameId, players: [player] });
};

export const joinGame = (
  games: Map<string, GameState>,
  gameId: string,
  player: Player,
) => {
  const game = games.get(gameId);
  if (!game) return Err(GAME_NOT_FOUND);
  if (game.phase !== "LOBBY") return Err(GAME_ALREADY_STARTED);
  if (isPlayerInGame(games, player)) return Err(ALREADY_IN_A_GAME);

  const updatedPlayers = addPlayer(game.players, player);
  games.set(gameId, { ...game, players: updatedPlayers });

  return Ok(updatedPlayers);
};

export const leaveGame = (
  games: Map<string, GameState>,
  gameId: string,
  uuid: string,
) => {
  const game = games.get(gameId);
  if (!game) return Err(GAME_NOT_FOUND);

  const updatedPlayers = removePlayer(game.players, uuid);
  games.set(gameId, { ...game, players: updatedPlayers });

  if (!updatedPlayers.length) {
    games.delete(gameId);
  }

  return Ok(updatedPlayers);
};
