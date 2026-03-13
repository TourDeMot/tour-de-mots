import type { ServerWebSocket } from "bun";
import type { Game, SocketData } from "@ws-poc/shared/types";
import { handleNewGame, handleJoinGame } from "./handlers";
import { UNKNOWN_EVENT } from "@ws-poc/shared/error";
import type { Event, Payload, ClientMessage } from "./messages";

type Handler<E extends Event> =
  (ws: ServerWebSocket<SocketData>, games: Map<string, Game>, payload: Payload<E>) => number;

const handlers: {
  [E in Event]: Handler<E>
} = {
  NEW_GAME: handleNewGame,
  JOIN_GAME: handleJoinGame,
};

export const messageRouter = <E extends Event> (
  ws: ServerWebSocket<SocketData>,
  games: Map<string, Game>,
  message: ClientMessage<E>,
) => {
  const handler = handlers[message.event];
  if (!handler) {
    return ws.send(JSON.stringify(UNKNOWN_EVENT));
  }
  return handler(ws, games, message.payload);
};
