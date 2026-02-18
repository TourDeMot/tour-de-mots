import type {
  Message,
  NewGameResponse,
  ErrorResponse,
  Games,
  JoinOrLeaveGameResponse,
  SocketData,
} from "@/types";
import type { ServerWebSocket } from "bun";

// source: Gemini 3 fast
const generateGameId = (length: number = 6) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
};

export const newGame = (ws: ServerWebSocket<SocketData>, games: Games) => {
  const gameId = generateGameId();
  ws.data.gameId = gameId;
  games.set(gameId, new Set([ws.data.uuid]));
  ws.subscribe(gameId);
  ws.send(JSON.stringify({ gameId } as NewGameResponse));
};

export const joinGame = (
  ws: ServerWebSocket<SocketData>,
  message: Message,
  games: Games,
) => {
  if (!message.gameId) {
    ws.send(JSON.stringify({ error: "Missing gameId" } as ErrorResponse));
    return;
  }
  ws.data.gameId = message.gameId;

  const game = games.get(message.gameId);
  if (!game) {
    ws.send(JSON.stringify({ error: "Game not found" } as ErrorResponse));
    return;
  }
  game.add(ws.data.uuid);
  ws.subscribe(message.gameId);

  const responsePayload = JSON.stringify({
    players: Array.from(game),
  } as JoinOrLeaveGameResponse);
  ws.send(responsePayload);
  ws.publish(message.gameId, responsePayload);
};
