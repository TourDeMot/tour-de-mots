import type { ServerWebSocket } from "bun";
import type {
  Message,
  ErrorResponse,
  Games,
  SocketData,
  JoinOrLeaveGameResponse,
} from "@/types";
import { newGame, joinGame } from "@/services/game";

export const messageHandler = (
  ws: ServerWebSocket<SocketData>,
  rawMessage: string,
  games: Games,
) => {
  try {
    const message = JSON.parse(rawMessage) as Message;
    switch (message.type) {
      case "NEW_GAME":
        newGame(ws, games);
        break;
      case "JOIN_GAME":
        joinGame(ws, message, games);
        break;
      default:
        return;
    }
  } catch (error) {
    ws.send(
      JSON.stringify({ error: "Failed to parse message" } as ErrorResponse),
    );
  }
};

export const closeHandler = (ws: ServerWebSocket<SocketData>, games: Games) => {
  const { uuid, gameId } = ws.data;
  if (!gameId) return;

  const game = games.get(gameId);
  if (!game) return;

  game.delete(uuid);

  if (game.size === 0) {
    games.delete(gameId);
  } else {
    ws.publish(
      gameId,
      JSON.stringify({ players: Array.from(game) } as JoinOrLeaveGameResponse),
    );
  }
};
