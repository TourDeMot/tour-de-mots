import type { MessagePayload,ServerEventPayloadMap , ServerMessage } from "@tour-de-mot/shared/types";
import type { Game } from "../types";
import { handleError } from "./error";
import { handleJoinGameOk } from "./joinGame";
import { handleNewGameOk } from "./newGame";
import { handlePlayerLeaved } from "./playerLeaved";

type Handler<E extends keyof ServerEventPayloadMap> =
  (state: Game, data: ServerEventPayloadMap[E]) => Game;

const handlers: { [E in keyof ServerEventPayloadMap]: Handler<E> } = {
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
  return (handler as Handler<typeof message.event>)(state, message.data);
}
