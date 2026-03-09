import type { ServerMessage } from "@ws-poc/shared/types";
import type { GameState } from "../types";
import { handleError } from "./error";
import { handleJoinGameOk } from "./joinGame";
import { handleNewGameOk } from "./newGame";
import { handlePlayerLeaved } from "./playerLeaved";

const handlers = {
  "NEW_GAME_OK": handleNewGameOk,
  "JOIN_GAME_OK": handleJoinGameOk,
  "PLAYER_LEAVED": handlePlayerLeaved,
};

export function handleMessage(state: GameState, message: ServerMessage): GameState {
  if (message.event === "ERROR") {
    return handleError(state, message.code);
  }

  const handler = handlers[message.event];
  if (!handler) throw new Error(`Unknown event: ${message.event}`);
  return handler(state, message.data);
}
