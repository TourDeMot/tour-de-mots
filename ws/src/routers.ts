import type { ServerWebSocket } from "bun";
import type { Games, SocketData, ClientMessage, ServerMessage } from "@ws-poc/shared";
import { handleNewGame, handleJoinGame } from "./handlers";
import { newErrorMessage } from "./utils";

export const messageRouter = (
  ws: ServerWebSocket<SocketData>,
  message: ClientMessage,
  games: Games,
) => {
  switch (message.event) {
    case "NEW_GAME":
      return handleNewGame(ws, message, games);
    case "JOIN_GAME":
      return handleJoinGame(ws, message, games);
    default:
      return ws.send(
        JSON.stringify(newErrorMessage("UNKNOWN_EVENT")),
      );
  }
};
