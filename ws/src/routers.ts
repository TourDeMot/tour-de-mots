import type { ServerWebSocket } from "bun";
<<<<<<< HEAD
import type { Game, SocketData, ClientMessage } from "@tour-de-mot/shared/types";
import { handleNewGame, handleJoinGame } from "./handlers";
import { UNKNOWN_EVENT } from "@tour-de-mot/shared/error";
=======
import type { Game, SocketData } from "@ws-poc/shared/types";
import { handleNewGame, handleJoinGame } from "./handlers";
import { UNKNOWN_EVENT } from "@ws-poc/shared/error";
import type { Event, Payload, ClientMessage } from "./messages";
>>>>>>> f0cb22f (use generic typing and event payload map)

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
