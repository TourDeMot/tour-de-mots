import type { ServerWebSocket } from "bun";
import type {
  Games,
  SocketData,
  ClientEvent,
  ClientMessage,
  ServerMessage,
} from "./types";
import { handleNewGame, handleJoinGame } from "./handlers";

const handlers: Record<ClientEvent, Function> = {
  NEW_GAME: handleNewGame,
  JOIN_GAME: handleJoinGame,
};

export const messageRouter = (
  ws: ServerWebSocket<SocketData>,
  message: ClientMessage,
  games: Games,
) => {
  const handler = handlers[message.event];
  if (!handler) {
    return ws.send(
      JSON.stringify({
        event: "ERROR",
        code: "UNKNOWN_EVENT",
      } as ServerMessage),
    );
  }

  handler(ws, message, games);
};
