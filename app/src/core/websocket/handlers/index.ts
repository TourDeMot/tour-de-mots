import type { MessagePayload, ServerEvent, ServerMessage, ServerPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";
import { handleError } from "./error";
import { handleJoinGameOk } from "./joinGame";
import { handleNewGameOk } from "./newGame";
import { handlePlayerLeaved } from "./playerLeaved";

type AnyHandler = (state: Game, data: ServerPayload) => Game;

const handlers: Record<Exclude<ServerEvent, "ERROR">, AnyHandler> = {
  "NEW_GAME_OK": handleNewGameOk,
  "JOIN_GAME_OK": handleJoinGameOk,
  "PLAYER_LEAVED": handlePlayerLeaved,
};

export function handleMessage(state: Game, message: ServerMessage): Game {
  if (message.event === "ERROR") {
    return handleError(state, message.data.code);
  }

  const handler = handlers[message.event];
  if (!handler) throw new Error(`Unknown event: ${message.event}`);
  return handler(state, message.data);
}
