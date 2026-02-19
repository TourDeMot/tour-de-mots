import type { ErrorCode, Player, ServerMessage } from "@ws-poc/shared";

export const newErrorMessage = (code: ErrorCode) =>
  ({ event: "ERROR", code }) as ServerMessage;

// toolkit pour Player[] en pure fonctionnelle

export const addPlayer = (players: Player[], player: Player) =>
  players.some((p) => p.uuid === player.uuid)
    ? players
    : [...players, player];

export const removePlayer = (players: Player[], uuid: string) =>
  players.filter((player) => player.uuid !== uuid);
