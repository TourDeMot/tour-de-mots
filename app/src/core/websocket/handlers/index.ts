import type {
  ServerEventPayloadMap,
  ServerMessage,
} from "@tour-de-mot/shared/types";
import type { Game } from "../types";
import { handleError } from "./error";
import { handleJoinGameOk } from "./joinGame";
import { handleNewGameOk } from "./newGame";
import { handlePlayerLeaved } from "./playerLeaved";
import { handleGameStarted } from "./gameStarted";
import { handlePrompt } from "./prompt";
import { handleGameFinished } from "./gameFinished";
import { handleLeftGameOk } from "./leftGame";

type Handler<E extends keyof ServerEventPayloadMap> = (
  state: Game,
  payload: ServerEventPayloadMap[E],
) => Game;

const handlers: { [E in keyof ServerEventPayloadMap]: Handler<E> } = {
  NEW_GAME_OK: handleNewGameOk,
  JOIN_GAME_OK: handleJoinGameOk,
  PLAYER_LEAVED: handlePlayerLeaved,
  GAME_STARTED: handleGameStarted,
  PROMPT: handlePrompt,
  GAME_FINISHED: handleGameFinished,
  LEFT_GAME_OK: handleLeftGameOk,
  ERROR: handleError,
};

export function handleMessage(state: Game, message: ServerMessage): Game {
  const handler = handlers[message.event];
  if (!handler) return state;
  // event et payload proviennent du même message → corrélés à l'exécution
  return (handler as (s: Game, p: unknown) => Game)(state, message.payload);
}
