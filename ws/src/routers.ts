import type { ServerWebSocket } from "bun";
import type { Game, SocketData, ClientMessage } from "@ws-poc/shared/types";
import { handleNewGame, handleJoinGame } from "./handlers";
import { UNKNOWN_EVENT } from "@ws-poc/shared/error";

export const messageRouter = (
  ws: ServerWebSocket<SocketData>,
  message: ClientMessage,
  games: Map<string, Game>,
) => {
  switch (message.event) {
    case "NEW_GAME":
      return handleNewGame(ws, message, games);
    case "JOIN_GAME":
      return handleJoinGame(ws, message, games);
    default:
      return ws.send(JSON.stringify(UNKNOWN_EVENT));
  }
};
