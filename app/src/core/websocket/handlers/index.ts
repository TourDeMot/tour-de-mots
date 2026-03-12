import type { ServerEvent, ServerMessage } from "@tour-de-mot/shared/types";
import type { GameState } from "../types";
import { handleError } from "./error";
import { handleJoinGameOk } from "./joinGame";
import { handleNewGameOk } from "./newGame";
import { handlePlayerLeaved } from "./playerLeaved";

type AnyHandler = (state: GameState, data: any) => GameState;

const handlers: Record<Exclude<ServerEvent, "ERROR">, AnyHandler> = {
  "NEW_GAME_OK": handleNewGameOk,
  "JOIN_GAME_OK": handleJoinGameOk,
  "PLAYER_LEAVED": handlePlayerLeaved,
};

// Version développée de la version ci dessus sans Record et Exclude
// type HandlerMap = {
//   "NEW_GAME_OK":   AnyHandler;
//   "JOIN_GAME_OK":  AnyHandler;
//   "PLAYER_LEAVED": AnyHandler;
// };

// const handlers: HandlerMap = {
//   "NEW_GAME_OK": handleNewGameOk,
//   "JOIN_GAME_OK": handleJoinGameOk,
//   "PLAYER_LEAVED": handlePlayerLeaved,
// };

export function handleMessage(state: GameState, message: ServerMessage): GameState {
  if (message.event === "ERROR") {
    return handleError(state, message.data.code);
  }

  const handler = handlers[message.event];
  if (!handler) throw new Error(`Unknown event: ${message.event}`);
  return handler(state, message.data);
}
